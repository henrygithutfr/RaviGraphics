import dns from "dns";
dns.setDefaultResultOrder('ipv4first');

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("=== ENV LOAD DEBUG ===");
console.log("SMTP_USER exists:", !!process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
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

// CORS configuration
const allowedOrigins = [
  'https://ravigraphics.vercel.app', 
  'https://ravigraphics.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked CORS from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Brevo SMTP with your variable names
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Brevo email configuration error:", error.message);
  } else {
    console.log("✅ Brevo email transporter ready");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello world from Ravi Graphics API");
});

app.get("/health", (req, res) => {
  res.send("alive");
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
      from: `"Ravi Graphics" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #ea580c;">New Contact Form Submission</h2>
          <table style="width: 100%; margin: 20px 0;">
            <tr><th style="text-align: left;">Name:</th><td>${name}</th></tr>
            <tr><th style="text-align: left;">Email:</th><td>${email}</th></tr>
            <tr><th style="text-align: left;">Message:</th><td>${message.replace(/\n/g, "<br>")}</th></tr>
          </table>
          <p style="color: #6b7280; font-size: 12px;">Sent from Ravi Graphics Contact Form</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Ravi Graphics" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
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