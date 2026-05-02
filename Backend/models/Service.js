import mongoose from "mongoose";

const serviceOptionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  options: [{ type: String }]
});

const pricingSchema = new mongoose.Schema({
  type: { type: String, enum: ["fixed", "quote"], default: "quote" },
  amount: { type: Number },  // Changed from price_per_unit to match your data
  min_quantity: { type: Number },
  currency: { type: String, default: "INR" },
  unit: { type: String, default: "piece" }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "Untitled" },
  slug: { type: String, required: true, unique: true },
  pricing: pricingSchema,
  images: [{ type: String }]
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "Untitled" },
  slug: { type: String, required: true, unique: true },
  options: [serviceOptionSchema],
  quoteNote: { type: String },
  image: { type: String },
  price_do: { type: Number, default: 0 },  // ← MOVED HERE - Category level
  services: [productSchema]
}, {
  timestamps: true
});

const Service = mongoose.model("Service", categorySchema);
export default Service;