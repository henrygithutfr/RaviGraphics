import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Quote from "../models/Quote.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email);
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "ravi_graphics_secret_key_2024",
      { expiresIn: "7d" }
    );
    
    console.log("Login successful for:", email);
    
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify admin token
export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ravi_graphics_secret_key_2024");
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get dashboard stats
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalServices, totalProducts, totalQuotes, pendingQuotes] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["pending_payment", "payment_received", "processing"] } }),
      Service.countDocuments(),
      Service.aggregate([{ $unwind: "$services" }, { $count: "total" }]),
      Quote.countDocuments(),
      Quote.countDocuments({ status: "pending" })
    ]);
    
    res.json({
      totalOrders,
      pendingOrders,
      totalServices,
      totalProducts: totalProducts[0]?.total || 0,
      totalQuotes,
      pendingQuotes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS MANAGEMENT ====================

// Get all orders
router.get("/orders", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put("/orders/:orderId/status", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete("/orders/:orderId", verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    await Order.findByIdAndDelete(req.params.orderId);
    
    console.log(`✅ Order deleted: ${order.orderId}`);
    
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== QUOTES MANAGEMENT ====================

// Get all quotes
router.get("/quotes", verifyAdmin, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).populate("userId", "name email");
    res.json({ quotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single quote
router.get("/quotes/:quoteId", verifyAdmin, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId).populate("userId", "name email");
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.json({ quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quote status
router.put("/quotes/:quoteId/status", verifyAdmin, async (req, res) => {
  try {
    const { status, quotedAmount, adminNotes } = req.body;
    const quote = await Quote.findById(req.params.quoteId);
    
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    
    quote.status = status;
    if (quotedAmount) quote.quotedAmount = quotedAmount;
    if (adminNotes) quote.adminNotes = adminNotes;
    if (status === "quoted") quote.quotedAt = new Date();
    
    await quote.save();
    
    res.json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quote
router.delete("/quotes/:quoteId", verifyAdmin, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.quoteId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS MANAGEMENT ====================

// Get all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVICES MANAGEMENT ====================

// Create service category
router.post("/services", verifyAdmin, async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      price_do: req.body.price_do ? parseInt(req.body.price_do) : 0
    };
    
    const service = new Service(serviceData);
    await service.save();
    console.log("✅ Category created:", service.name, "with price_do:", service.price_do);
    res.json({ success: true, service });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update service category (FIXED with better logging)
router.put("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      price_do: req.body.price_do ? parseInt(req.body.price_do) : 0
    };
    
    console.log("Updating category with data:", JSON.stringify(updateData, null, 2));
    
    const service = await Service.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }  // Added runValidators
    );
    
    if (!service) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    console.log("✅ Category updated:", service.name, "price_do:", service.price_do);
    res.json({ success: true, service });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete service category
router.delete("/services/:id", verifyAdmin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCTS MANAGEMENT ====================

// Create product (FIXED with better logging)
router.post("/products", verifyAdmin, async (req, res) => {
  try {
    const { categoryId, product } = req.body;
    console.log("Creating product in category:", categoryId);
    console.log("Product data:", JSON.stringify(product, null, 2));
    
    const category = await Service.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    category.services.push(product);
    await category.save();
    
    console.log("✅ Product created:", product.name, "in category:", category.name);
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product (FIXED with better logging and proper update)
router.put("/products/:productId", verifyAdmin, async (req, res) => {
  try {
    const { categoryId, product } = req.body;
    
    console.log("Updating product:", req.params.productId);
    console.log("Category ID:", categoryId);
    console.log("New product data:", JSON.stringify(product, null, 2));
    
    const category = await Service.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const index = category.services.findIndex(s => s.id === req.params.productId);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Update the product while preserving the id
    category.services[index] = { 
      ...category.services[index], 
      ...product,
      id: category.services[index].id // Keep the original ID
    };
    
    await category.save();
    
    console.log("✅ Product updated:", product.name);
    console.log("Updated product at index:", index);
    
    res.json({ success: true, product: category.services[index] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete("/products/:categoryId/:productId", verifyAdmin, async (req, res) => {
  try {
    console.log("Deleting product:", req.params.productId, "from category:", req.params.categoryId);
    
    const category = await Service.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const originalLength = category.services.length;
    category.services = category.services.filter(s => s.id !== req.params.productId);
    
    if (category.services.length === originalLength) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    await category.save();
    
    console.log("✅ Product deleted");
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;