import mongoose from "mongoose";

// File attachment schema - REMOVED required fields
const fileAttachmentSchema = new mongoose.Schema({
  originalName: { type: String },
  size: { type: Number },
  mimeType: { type: String },
  driveLink: { type: String },
  downloadLink: { type: String },
  fileId: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

const quoteSchema = new mongoose.Schema({
  quoteId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, default: "" }
  },
  projectDetails: {
    productType: { type: String, required: true },
    quantity: { type: Number, required: true },
    colorType: { type: String, default: "full-color" },
    size: { type: String, default: "" },
    material: { type: String, default: "" },
    finishing: [{ type: String }],
    turnaround: { type: String, default: "standard" },
    designStatus: { type: String, default: "need-design" },
    description: { type: String, default: "" },
    budget: { type: String, default: "" }
  },
  files: [fileAttachmentSchema],
  status: { 
    type: String, 
    enum: ["pending", "reviewed", "quoted", "expired", "converted"],
    default: "pending"
  },
  quotedAmount: { type: Number, default: null },
  quotedAt: { type: Date },
  adminNotes: { type: String, default: "" },
  convertedToOrderId: { type: String, default: "" }
}, {
  timestamps: true
});

// Generate quote ID before saving - SIMPLIFIED
quoteSchema.pre("save", function () {
  if (!this.quoteId) {
    this.quoteId =
      "QT" +
      Date.now() +
      Math.floor(Math.random() * 10000);
  }
});

const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;