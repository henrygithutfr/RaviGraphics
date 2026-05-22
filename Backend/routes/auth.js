import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

const router = express.Router();

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

// Send verification email using Brevo API
const sendVerificationEmail = async (email, name, otp) => {
  try {
    console.log("📧 Attempting to send OTP to:", email);

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "Ravi Graphics",
          email: process.env.BREVO_SENDER_EMAIL || "noreply@ravigraphics.com"
        },
        to: [{ email: email, name: name }],
        subject: "Your Verification Code - Ravi Graphics",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
            <h2 style="color: #ea580c;">Hello ${name}!</h2>
            <p>Your verification code is:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background: #f3f4f6; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              Ravi Graphics — Where Quality Meets Excellence ☀️
            </p>
          </div>
        `,
        textContent: `
Hello ${name}!

Your verification code is: ${otp}

This code expires in 10 minutes.

Ravi Graphics — Where Quality Meets Excellence ☀️
        `
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        timeout: 10000
      }
    );

    console.log("✅ Email sent successfully! Message ID:", response.data.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.response?.data || error.message);
    throw error;
  }
};

// Temporary storage for unverified users (in production, use Redis or similar)
// For now, we'll store in memory (will reset on server restart)
const tempUsers = new Map();

// Signup Route - ONLY stores temporarily, does NOT save to DB
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log("Signup attempt for:", email);

    // Check if user already exists and is verified in DB
    const existingUser = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone }],
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email or phone number",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store user data temporarily (not in database yet)
    tempUsers.set(email.toLowerCase(), {
      name,
      email: email.toLowerCase(),
      phone,
      otp,
      verificationCodeExpires,
      createdAt: Date.now()
    });

    console.log(`🔐 OTP for ${email}: ${otp}`);

    // Send email with OTP
    try {
      await sendVerificationEmail(email, name, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Remove temp user if email fails
      tempUsers.delete(email.toLowerCase());
      return res.status(500).json({
        success: false,
        error: "Failed to send verification code. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Signup failed. Please try again later.",
    });
  }
});

// Verify OTP - ONLY saves to DB after successful verification
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Check temp storage for unverified user
    const tempUser = tempUsers.get(email.toLowerCase());

    if (!tempUser) {
      return res.status(400).json({
        error: "No pending verification found. Please sign up again.",
      });
    }

    // Check if OTP is expired
    if (Date.now() > tempUser.verificationCodeExpires) {
      tempUsers.delete(email.toLowerCase());
      return res.status(400).json({
        error: "Verification code has expired. Please request a new code.",
      });
    }

    // Check if OTP matches
    if (tempUser.otp !== otp) {
      return res.status(400).json({
        error: "Invalid verification code. Please try again.",
      });
    }

    // Check if user already exists in DB (might have been created by another process)
    let user = await User.findOne({
      $or: [{ email: tempUser.email }, { phone: tempUser.phone }],
    });

    if (user && user.isVerified) {
      tempUsers.delete(email.toLowerCase());
      return res.status(400).json({
        error: "User already exists with this email or phone number.",
      });
    }

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = tempUser.name;
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();
    } else {
      // Create NEW user in database ONLY after successful verification
      user = new User({
        name: tempUser.name,
        email: tempUser.email,
        phone: tempUser.phone,
        savedProducts: [],
        isVerified: true,
      });
      await user.save();
    }

    // Remove from temp storage
    tempUsers.delete(email.toLowerCase());

    console.log("✅ User verified and saved to DB:", user._id);

    // Generate JWT token
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

// Resend verification code
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const tempUser = tempUsers.get(email.toLowerCase());

    if (!tempUser) {
      return res.status(404).json({
        error: "No pending verification found. Please sign up again.",
      });
    }

    // Check if already verified in DB
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser && existingUser.isVerified) {
      tempUsers.delete(email.toLowerCase());
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    // Update temp user
    tempUser.otp = otp;
    tempUser.verificationCodeExpires = verificationCodeExpires;
    tempUsers.set(email.toLowerCase(), tempUser);

    console.log(`🔐 Resend OTP for ${email}: ${otp}`);

    // Send new OTP
    await sendVerificationEmail(email, tempUser.name, otp);

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
        error: "Please verify your email before logging in.",
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

// Clean up expired temp users every hour
setInterval(() => {
  const now = Date.now();
  for (const [email, user] of tempUsers.entries()) {
    if (now > user.verificationCodeExpires) {
      tempUsers.delete(email);
      console.log(`🧹 Cleaned up expired temp user: ${email}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

export default router;