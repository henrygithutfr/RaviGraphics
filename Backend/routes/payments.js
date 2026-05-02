import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SgYjNK1csR68XU",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    console.log("Creating Razorpay order for amount:", amount, "orderId:", orderId);
    
    // Find the order in database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: "INR",
      receipt: order.orderId,
      payment_capture: 1,
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("Razorpay order created:", razorpayOrder.id);
    
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post("/verify-payment", verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDatabaseId } = req.body;
    
    console.log("Verifying payment for order:", orderDatabaseId);
    
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    
    if (generatedSignature === razorpay_signature) {
      const order = await Order.findById(orderDatabaseId);
      if (order) {
        order.paymentStatus = "completed";
        order.transactionId = razorpay_payment_id;
        order.status = "payment_received";
        await order.save();
        console.log(`✅ Payment verified for order: ${order.orderId}`);
      }
      
      res.json({ success: true, message: "Payment verified" });
    } else {
      console.error("Invalid signature for payment");
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;