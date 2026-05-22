import nodemailer from "nodemailer";
import dns from "dns";

// FORCE IPv4 globally
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    family: 4,
    rejectUnauthorized: false,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer Error:", error);
  } else {
    console.log("✅ Mailer Ready");
  }
});

export default transporter;