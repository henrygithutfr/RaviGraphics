import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// Define Admin schema
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@ravigraphics.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    const admin = new Admin({
      name: "Super Admin",
      email: "admin@ravigraphics.com",
      password: hashedPassword,
      role: "admin"
    });
    
    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log("Email: admin@ravigraphics.com");
    console.log("Password: Admin@123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();