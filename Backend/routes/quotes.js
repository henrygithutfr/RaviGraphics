import express from "express";
import Quote from "../models/Quote.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Create quote request
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { customer, projectDetails, files } = req.body;
    
    console.log("Creating quote for user:", req.userId);
    
    const quote = new Quote({
      userId: req.userId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || ""
      },
      projectDetails: projectDetails,
      files: files || [],
      status: "pending"
    });
    
    await quote.save();
    
    console.log(`✅ Quote created: ${quote.quoteId}`);
    
    res.json({ success: true, quote });
  } catch (error) {
    console.error("Quote creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's quotes
router.get("/my-quotes", verifyToken, async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ quotes });
  } catch (error) {
    console.error("Error fetching user quotes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single quote
router.get("/:quoteId", verifyToken, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    if (quote.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    res.json({ quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;