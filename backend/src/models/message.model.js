import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: String, // Clerk user ID
      required: true,
    },
    receiverId: {
      type: String, // Clerk user ID
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const Message = mongoose.model("Message", messageSchema);
