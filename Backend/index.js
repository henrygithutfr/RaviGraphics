import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import transporter from "./config/mailer.js";

// Routes
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import quoteRoutes from "./routes/quotes.js";
import paymentRoutes from "./routes/payments.js";

import "./models/Quote.js";

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({
  path: path.join(__dirname, ".env"),
});

// Debug logs
console.log("=== ENV DEBUG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("=================");

const app = express();

const PORT = process.env.PORT || 4001;

// CORS
const allowedOrigins = [
  "https://ravigraphics.vercel.app",
  "https://ravigraphics.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      // Allow all vercel preview deployments
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);

      callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
  }
};

connectDB();

// Verify mailer
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email config error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

// Health route
app.get("/", (req, res) => {
  res.send("Ravi Graphics API Running");
});

app.get("/health", (req, res) => {
  res.send("alive");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Contact route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Send to admin
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: subject || `Contact Form - ${name}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Message:</strong></p>

          <div style="margin-top:10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    // Auto reply
    await transporter.sendMail({
      from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Thank You</h2>

          <p>Hello ${name},</p>

          <p>
            We received your message and will reply soon.
          </p>

          <p>
            Ravi Graphics
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("❌ Contact email error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});