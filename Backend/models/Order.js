import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  categorySlug: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  unit: { type: String, default: "piece" },
  options: { type: Object, default: {} },
  image: { type: String, default: "" },
  orderType: { type: String } // Store whether this is design_print or design_only
});

// File attachment schema
const fileAttachmentSchema = new mongoose.Schema({
  originalName: { type: String },
  size: { type: Number },
  mimeType: { type: String },
  driveLink: { type: String },
  downloadLink: { type: String },
  fileId: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  orderType: { 
    type: String, 
    enum: ["design_only", "design_print"], 
    default: "design_print",
    required: true
  },
  
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  
  items: [orderItemSchema],
  files: [fileAttachmentSchema],
  totalAmount: { type: Number, required: true },
  
  paymentMethod: { 
    type: String, 
    enum: ["upi", "bank", "cod", "razorpay"], 
    default: "razorpay",
    required: true 
  },
  
  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },
  
  transactionId: { type: String, default: "" },
  
  status: { 
    type: String, 
    enum: [
      "pending_payment",
      "payment_received",
      "processing",
      "design_ready",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "pending_payment"
  },
  
  designDelivery: {
    deliveredAt: { type: Date },
    designLink: { type: String },
    notes: { type: String }
  },
  
  shipping: {
    trackingNumber: { type: String },
    courierName: { type: String },
    shippedAt: { type: Date },
    expectedDelivery: { type: Date }
  },
  
  adminNotes: { type: String, default: "" }
  
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre("save", function () {
  if (!this.orderId) {
    this.orderId =
      "RG" +
      Date.now() +
      Math.floor(Math.random() * 10000);
  }
});

// Virtuals
orderSchema.virtual('isDesignOnly').get(function() {
  return this.orderType === 'design_only';
});

orderSchema.virtual('isDesignPrint').get(function() {
  return this.orderType === 'design_print';
});

orderSchema.virtual('filesCount').get(function() {
  return this.files?.length || 0;
});

const Order = mongoose.model("Order", orderSchema);
export default Order;