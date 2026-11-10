import mongoose from "mongoose";
import dns from "dns";

// แก้ไขปัญหา querySrv ECONNREFUSED บน Windows เมื่อ DNS ของ Router ไม่รองรับ SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is missing in backend/.env. Please configure your MongoDB connection string.");
      process.exit(1);
    }
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // 0 for success, 1 for failure
  }
};

export default connectDB;
