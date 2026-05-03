import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    console.log("🔍 Testing MongoDB Connection...");
    console.log("URI:", process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      family: 4
    });
    
    console.log("✅ MongoDB Connection Successful!");
    console.log("Database Name:", mongoose.connection.db.getName());
    console.log("Ready State:", mongoose.connection.readyState);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log("✅ Disconnected successfully");
  } catch (error) {
    console.error("❌ Connection Error:", error.message);
    console.error("Error Code:", error.code);
    process.exit(1);
  }
}

testConnection();
