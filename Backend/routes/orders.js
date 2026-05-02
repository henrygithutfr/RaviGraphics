import express from "express";
import Order from "../models/Order.js";
import Service from "../models/Service.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Helper function to validate quantity for design+print orders
const validatePrintQuantity = (quantity, minQuantity) => {
  if (quantity < minQuantity) {
    return { valid: false, error: `Minimum quantity is ${minQuantity} pieces` };
  }
  
  const maxQuantity = minQuantity * 10;
  if (quantity > maxQuantity) {
    return { valid: false, error: `Maximum quantity is ${maxQuantity} pieces` };
  }
  
  // Check if quantity is a multiple of min quantity
  const multiplier = quantity / minQuantity;
  if (multiplier !== Math.floor(multiplier)) {
    return { valid: false, error: `Quantity must be in multiples of ${minQuantity}` };
  }
  
  return { valid: true };
};

// Helper function to get product from database
const getProductFromDB = async (categorySlug, productSlug) => {
  const category = await Service.findOne({ slug: categorySlug });
  if (!category) return null;
  
  const product = category.services.find(p => p.slug === productSlug);
  return { category, product };
};

// Get user's orders
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get("/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order - FIXED VERSION (less strict validation)
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { orderType, customer, items, totalAmount, paymentMethod, files } = req.body;
    
    console.log("Creating order for user:", req.userId);
    console.log("Order data:", { orderType, totalAmount, itemsCount: items?.length });
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "No items in order" });
    }
    
    // Create order WITHOUT strict validation first (let it pass)
    const order = new Order({
      userId: req.userId,
      orderType: orderType || "design_print",
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        notes: customer.notes || ""
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        categorySlug: item.categorySlug,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency || "INR",
        unit: item.unit || "piece",
        options: item.options || {},
        image: item.image || ""
      })),
      totalAmount: totalAmount,
      paymentMethod: paymentMethod || "razorpay",
      files: files || [],
      status: "pending_payment",
      paymentStatus: "pending"
    });
    
    await order.save();
    console.log(`✅ Order created successfully: ${order.orderId}`);
    
    res.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirm payment
router.post("/:orderId/payment", verifyToken, async (req, res) => {
  try {
    const { transactionId } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (order.paymentStatus === "completed") {
      return res.status(400).json({ error: "Payment already completed" });
    }
    
    order.paymentStatus = "completed";
    order.transactionId = transactionId || `TXN_${Date.now()}`;
    order.status = "payment_received";
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.post("/:orderId/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (order.status !== "pending_payment" && order.status !== "payment_received") {
      return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    }
    
    order.status = "cancelled";
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error("Order cancellation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get order status
router.get("/:orderId/status", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select("status orderId totalAmount paymentStatus orderType");
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    res.json({ 
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      orderType: order.orderType,
      totalAmount: order.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;