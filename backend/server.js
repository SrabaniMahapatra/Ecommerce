import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

// Fix DNS resolution on Windows
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/orders.js";
import customerRoutes from "./routes/customers.js";
import statsRoutes from "./routes/stats.js";
import heroSlidesRoutes from "./routes/heroSlides.js";
import uploadRoutes from "./routes/upload.js";
import bannerOffersRoutes from "./routes/bannerOffers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB with retry logic
const connectMongoDB = async (retries = 5) => {
  let uri = process.env.MONGODB_URI;
  
  console.log("🔍 Attempting to connect to MongoDB...");
  console.log("📍 Using DNS: Google Public DNS (8.8.8.8)");
  
  const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 20000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    maxIdleTimeMS: 30000,
  };
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, mongoOptions);
      console.log("✅ MongoDB connected successfully!");
      return;
    } catch (err) {
      console.error(`\n❌ Attempt ${i + 1} failed:`);
      console.error(`   Error: ${err.message}`);
      console.error(`   Code: ${err.code}\n`);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 3 seconds... (${retries - i - 1} attempts left)\n`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error("\n⚠️  MongoDB Connection Failed!");
        console.error("📌 Check these things:");
        console.error("   1. Is your MongoDB Atlas IP Whitelist updated?");
        console.error("   2. Are your username and password correct?");
        console.error("   3. Is your cluster name correct in .env?");
        console.error("   4. Do you have internet connection?");
        console.error("\n🔗 Atlas Dashboard: https://cloud.mongodb.com");
      }
    }
  }
};

connectMongoDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/hero-slides", heroSlidesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/banner-offers", bannerOffersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
