import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FORCE LOAD .env from the correct path
dotenv.config({ path: path.join(__dirname, ".env") });

// Debug: Check if env loaded properly
console.log("=== ENV LOAD DEBUG ===");
console.log("Current directory:", __dirname);
console.log(".env path:", path.join(__dirname, ".env"));
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
console.log("=====================");

import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import quoteRoutes from "./routes/quotes.js";
import paymentRoutes from "./routes/payments.js";

import "./models/Quote.js";

const PORT = process.env.PORT || 4001;

const app = express();

// Middleware
// app.use(
//   cors({
//     origin: "https://ravi-graphics.vercel.app",
//     credentials: true,
//   }),
// );

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

connectDB();

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email configuration error:", error.message);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Rest of your routes...
app.get("/", (req, res) => {
  res.send("Hello world from Ravi Graphics API");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and message",
    });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    <h2 style="color: #ea580c;">New Contact Form Submission</h2>
                    <table style="width: 100%; margin: 20px 0;">
                        <tr><th style="text-align: left;">Name:</th><td>${name}</td></tr>
                        <tr><th style="text-align: left;">Email:</th><td>${email}</td></tr>
                        <tr><th style="text-align: left;">Message:</th><td>${message.replace(/\n/g, "<br>")}</td></tr>
                    </table>
                    <p style="color: #6b7280; font-size: 12px;">Sent from Ravi Graphics Contact Form</p>
                </div>
            `,
    });

    await transporter.sendMail({
      from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Ravi Graphics",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #ea580c;">Thank You for Reaching Out!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your message and will get back to you within 24 hours.</p>
                    <p>For urgent inquiries, please WhatsApp us at <strong>+91 8480154045</strong></p>
                    <p style="margin-top: 20px;">Ravi Graphics — Where Quality Meets Excellence ☀️</p>
                </div>
            `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
