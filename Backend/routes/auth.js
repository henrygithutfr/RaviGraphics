import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/mailer.js";

const router = express.Router();

// Verify JWT
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
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, name, otp) => {
  console.log("Attempting to send email to:", email);

  const mailOptions = {
    from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code - Ravi Graphics",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email</h2>

        <p>Hello ${name},</p>

        <p>Your verification code is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          margin: 20px 0;
          color: #ea580c;
        ">
          ${otp}
        </div>

        <p>This code will expire in 10 minutes.</p>

        <p>Ravi Graphics</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("✅ Email sent:", info.response);
};

// Signup
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
          error: "User already exists",
        });
      }

      const otp = generateOTP();

      existingUser.name = name;
      existingUser.verificationCode = otp;
      existingUser.verificationCodeExpires = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await existingUser.save();

      console.log(`🔐 OTP for existing user ${email}: ${otp}`);

      try {
        await sendVerificationEmail(email, name, otp);
      } catch (emailError) {
        console.error("❌ Email failed:", emailError.message);

        return res.status(500).json({
          success: false,
          error: "Failed to send verification email",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Verification code sent",
        requiresVerification: true,
        email,
      });
    }

    const otp = generateOTP();

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      savedProducts: [],
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();

    console.log(`🔐 OTP for new user ${email}: ${otp}`);

    try {
      await sendVerificationEmail(email, name, otp);
    } catch (emailError) {
      console.error("❌ Email failed:", emailError.message);

      return res.status(500).json({
        success: false,
        error: "Failed to send verification email",
      });
    }

    res.status(201).json({
      success: true,
      message: "Verification code sent",
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Signup failed",
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: otp,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
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
      {
        expiresIn: "7d",
      }
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
    console.error("OTP verify error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Resend OTP
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
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    res.status(500).json({
      error: error.message,
    });
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
        error: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: "Please verify your email first",
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
      {
        expiresIn: "7d",
      }
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