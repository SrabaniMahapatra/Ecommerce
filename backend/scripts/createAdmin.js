import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import dns from "dns";

// Fix DNS resolution on Windows
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log("✅ MongoDB connected");

    // Use password from environment variable or provide a secure one
    const newPassword = process.env.ADMIN_PASSWORD || "Admin@12345"; // Change this in .env file

    // Check if admin already exists
    let adminUser = await User.findOne({ email: "admin@tealeaf.com" });
    if (adminUser) {
      console.log("⚠️ Admin user already exists, updating password...");
      adminUser.password = newPassword;
    } else {
      console.log("Creating new admin user...");
      adminUser = new User({
        name: "Admin",
        email: "admin@tealeaf.com",
        password: newPassword,
        role: "admin",
        phone: "+91-1234567890",
        address: "TeaLeaf HQ, India",
      });
    }

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@tealeaf.com");
    console.log("🔑 Password: " + newPassword);
    console.log("⚠️ Change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminUser();
