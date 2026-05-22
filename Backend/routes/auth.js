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
          email: process.env.BREVO_SENDER_EMAIL || "ravigraphics.odisha@gmail.com"
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

// Temporary storage for unverified users
const tempUsers = new Map();

// ==================== AUTH ROUTES ====================

// Signup Route
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
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    // Store user data temporarily
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

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const tempUser = tempUsers.get(email.toLowerCase());

    if (!tempUser) {
      return res.status(400).json({
        error: "No pending verification found. Please sign up again.",
      });
    }

    if (Date.now() > tempUser.verificationCodeExpires) {
      tempUsers.delete(email.toLowerCase());
      return res.status(400).json({
        error: "Verification code has expired. Please request a new code.",
      });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({
        error: "Invalid verification code. Please try again.",
      });
    }

    // Check if user already exists
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
      // Create new user
      user = new User({
        name: tempUser.name,
        email: tempUser.email,
        phone: tempUser.phone,
        savedProducts: [],
        isVerified: true,
      });
      await user.save();
    }

    tempUsers.delete(email.toLowerCase());

    console.log("✅ User verified and saved to DB:", user._id);

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

    const tempUser = tempUsers.get(email.toLowerCase());

    if (!tempUser) {
      return res.status(404).json({
        error: "No pending verification found. Please sign up again.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser && existingUser.isVerified) {
      tempUsers.delete(email.toLowerCase());
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    const otp = generateOTP();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    tempUser.otp = otp;
    tempUser.verificationCodeExpires = verificationCodeExpires;
    tempUsers.set(email.toLowerCase(), tempUser);

    console.log(`🔐 Resend OTP for ${email}: ${otp}`);

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

// ==================== SAVED PRODUCTS ROUTES ====================

// Get user's saved products
router.get("/saved-products", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("savedProducts");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      success: true, 
      savedProducts: user.savedProducts || [] 
    });
  } catch (error) {
    console.error("Error fetching saved products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save a product
router.post("/save-product", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if already saved
    if (user.savedProducts.includes(productId)) {
      return res.status(400).json({ 
        error: "Product already saved",
        alreadySaved: true
      });
    }
    
    // Add to saved products
    user.savedProducts.push(productId);
    await user.save();
    
    res.json({ 
      success: true, 
      message: "Product saved successfully",
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove a saved product
router.delete("/remove-saved-product/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Filter out the product
    user.savedProducts = user.savedProducts.filter(id => id !== productId);
    await user.save();
    
    res.json({ 
      success: true, 
      message: "Product removed successfully",
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error("Error removing saved product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle save product (save if not saved, remove if already saved)
router.post("/toggle-save-product", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const exists = user.savedProducts.includes(productId);
    let action;
    
    if (exists) {
      user.savedProducts = user.savedProducts.filter(id => id !== productId);
      action = "removed";
    } else {
      user.savedProducts.push(productId);
      action = "added";
    }
    
    await user.save();
    
    res.json({ 
      success: true, 
      action: action,
      message: action === "added" ? "Product saved" : "Product removed",
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error("Error toggling saved product:", error);
    res.status(500).json({ error: error.message });
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
}, 60 * 60 * 1000);

export default router;