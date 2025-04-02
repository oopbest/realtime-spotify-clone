import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // 0 for success, 1 for failure
  }
};

export default connectDB;
