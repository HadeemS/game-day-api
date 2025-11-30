// Test MongoDB connection
require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Testing MongoDB connection...");
console.log("Connection string (first 50 chars):", MONGODB_URI?.substring(0, 50));
console.log("Full URI (hidden password):", MONGODB_URI?.replace(/:[^:@]+@/, ":****@"));

async function testConnection() {
  try {
    console.log("\nAttempting to connect...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ SUCCESS! Connected to MongoDB!");
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("✅ Database accessible!");
    console.log("Collections:", collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log("✅ Connection closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    
    if (error.message.includes("authentication failed")) {
      console.error("\n🔍 AUTHENTICATION ISSUE:");
      console.error("1. Check password in MongoDB Atlas → Database Access");
      console.error("2. Verify IP is whitelisted in Network Access");
      console.error("3. Make sure password has no special characters that need encoding");
      console.error("4. Try resetting the password in MongoDB Atlas");
    } else if (error.message.includes("IP")) {
      console.error("\n🔍 IP WHITELISTING ISSUE:");
      console.error("1. Go to MongoDB Atlas → Network Access");
      console.error("2. Add 'Allow Access from Anywhere' (0.0.0.0/0)");
      console.error("3. Wait for status to show 'Active'");
    }
    
    process.exit(1);
  }
}

testConnection();

