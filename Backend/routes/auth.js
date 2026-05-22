import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure Nodemailer transporter (same as your main server file)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,  // Force IPv4
  connectionTimeout: 15000,
  socketTimeout: 15000
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email configuration error in auth:", error.message);
  } else {
    console.log("✅ Email server is ready in auth routes");
  }
});

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({
      error: "Access denied. Invalid token.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024"
    );

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email using Nodemailer
const sendVerificationEmail = async (email, name, otp) => {
  try {
    console.log("Sending OTP to:", email);

    const mailOptions = {
      from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
      to: email,  // ✅ Sends to customer's email from signup form
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${name}</h2>
          <p>Your verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            background: #f3f4f6;
            padding: 15px;
            display: inline-block;
            border-radius: 10px;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>This code expires in 10 minutes.</p>

          <p style="margin-top: 30px;">
            Ravi Graphics — Where Quality Meets Excellence ☀️
          </p>
        </div>
      `,
      // Add plain text version for better email client compatibility
      text: `
        Hello ${name},
        
        Your verification code is: ${otp}
        
        This code expires in 10 minutes.
        
        Ravi Graphics — Where Quality Meets Excellence ☀️
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    
    return true;
  } catch (error) {
    console.error("❌ Nodemailer email failed:", error);
    throw error;
  }
};

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log("Signup attempt for:", email);

    const existingUser = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          error: "User already exists with this email or phone number",
        });
      } else {
        const otp = generateOTP();
        const verificationCodeExpires = new Date(
          Date.now() + 10 * 60 * 1000
        );

        existingUser.name = name;
        existingUser.verificationCode = otp;
        existingUser.verificationCodeExpires = verificationCodeExpires;

        await existingUser.save();

        console.log(`🔐 OTP for existing user ${email}: ${otp}`);

        try {
          await sendVerificationEmail(email, name, otp);
        } catch (emailError) {
          console.error("Email sending failed:", emailError.message);
        }

        return res.status(200).json({
          success: true,
          message:
            "Verification code sent to your email. Please check your inbox.",
          requiresVerification: true,
          email,
        });
      }
    }

    // Create new user
    const otp = generateOTP();
    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      savedProducts: [],
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires,
    });

    await user.save();

    console.log("New user created:", user._id);
    console.log(`🔐 OTP for new user ${email}: ${otp}`);

    try {
      await sendVerificationEmail(email, name, otp);
    } catch (emailError) {
      console.error(
        "Email sending failed but user was created:",
        emailError.message
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Verification code sent to your email. Please check your inbox.",
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email or phone number.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Signup failed. Please try again later.",
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: otp,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error:
          "Invalid or expired verification code. Please request a new code.",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedProducts: user.savedProducts,
      },
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Resend verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    const otp = generateOTP();

    user.verificationCode = otp;
    user.verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    console.log(`🔐 Resend OTP for ${email}: ${otp}`);

    await sendVerificationEmail(email, user.name, otp);

    res.json({
      success: true,
      message: "New verification code sent to your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone }],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found. Please sign up first.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error:
          "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedProducts: user.savedProducts,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;