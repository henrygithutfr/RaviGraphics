import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// GET all services - assumes data is already in MongoDB
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    if (services.length === 0) {
      return res.json([]);
    }
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET single category by slug
router.get("/category/:slug", async (req, res) => {
  try {
    const category = await Service.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by category slug and product slug
router.get("/product/:categorySlug/:productSlug", async (req, res) => {
  try {
    const category = await Service.findOne({ slug: req.params.categorySlug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const product = category.services.find(p => p.slug === req.params.productSlug);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ category, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;