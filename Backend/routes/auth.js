import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import nodemailer from "nodemailer";

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
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Generate 6-digit OTP code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send verification email with OTP - FIXED with proper HTML
const sendVerificationEmail = async (email, name, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,  // ← ADD THIS
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });
  // ... rest of the function
};

// STEP 1: Signup - Send verification code to email
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log("Signup attempt for:", email);

    // Check if user already exists and is verified
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
        // User exists but not verified - update their info and resend code
        const otp = generateOTP();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        existingUser.name = name;
        existingUser.verificationCode = otp;
        existingUser.verificationCodeExpires = verificationCodeExpires;
        await existingUser.save();

        console.log(`🔐 OTP for existing user ${email}: ${otp}`);

        // Send verification email
        try {
          await sendVerificationEmail(email, name, otp);
          console.log("Verification email sent to existing user:", email);
        } catch (emailError) {
          console.error("Email sending failed:", emailError.message);
          // Still return success - user can see OTP in logs if needed
        }

        return res.status(200).json({
          success: true,
          message: "Verification code sent to your email. Please check your inbox.",
          requiresVerification: true,
          email: email,
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user (unverified)
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

    // Send verification email
    try {
      await sendVerificationEmail(email, name, otp);
      console.log("Verification email sent to new user:", email);
    } catch (emailError) {
      console.error("Email sending failed but user was created:", emailError.message);
      // User is created but email failed - they can request resend
    }

    res.status(201).json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
      requiresVerification: true,
      email: email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate key error (MongoDB error code 11000)
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

// STEP 2: Verify OTP code
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP code are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: otp,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification code. Please request a new code.",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
      { expiresIn: "7d" },
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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = otp;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    console.log(`🔐 Resend OTP for ${email}: ${otp}`);

    try {
      await sendVerificationEmail(email, user.name, otp);
      console.log("Resend email sent to:", email);
    } catch (emailError) {
      console.error("Resend email failed:", emailError.message);
    }

    res.json({
      success: true,
      message: "New verification code sent to your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login - Check if email is verified
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
        error: "Please verify your email before logging in. Check your inbox for the verification code.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
      { expiresIn: "7d" },
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
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedProducts: user.savedProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save product to user's saved list
router.post("/save-product", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.savedProducts.includes(productId)) {
      user.savedProducts.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      savedProducts: user.savedProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove product from saved list
router.delete("/save-product/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.savedProducts = user.savedProducts.filter((id) => id !== productId);
    await user.save();

    res.json({
      success: true,
      savedProducts: user.savedProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's saved products
router.get("/saved-products", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ savedProducts: user.savedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;