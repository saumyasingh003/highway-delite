import mongoose = require("mongoose");


const connectDB = async (): Promise<void> => {
  const env = (globalThis as any).process?.env;
  const uri = env?.MONGO_URI || env?.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};


export = connectDB;
