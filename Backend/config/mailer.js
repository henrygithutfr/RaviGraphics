import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 15000,
  socketTimeout: 15000,
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer Error:", error.message);
  } else {
    console.log("✅ Mailer Ready");
  }
});

export default transporter;