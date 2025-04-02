import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true, //
    },
  });

  const userSockets = new Map(); // ใช้เก็บ socket ID ของผู้ใช้แต่ละคน
  const userActivities = new Map(); // ใช้เก็บกิจกรรมของผู้ใช้แต่ละคน

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id); // เก็บ socket ID ของผู้ใช้แต่ละคน
      userActivities.set(userId, "Idle"); // เซิร์ฟเวอร์กำหนดให้สถานะเริ่มต้นของผู้ใช้เป็น "Idle"

      io.emit("user_connected", userId); // แจ้งให้ไคลเอนต์อื่นทราบว่ามีผู้ใช้ใหม่ออนไลน์

      socket.emit("users_online", Array.from(userSockets.keys())); // แจ้งไคลเอนต์เกี่ยวกับผู้ใช้ออนไลน์ทั้งหมด

      io.emit("activities", Array.from(userActivities.entries())); // แจ้งไคลเอนต์เกี่ยวกับกิจกรรมของผู้ใช้ทั้งหมด
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);

      userActivities.set(userId, activity); // อัปเดตกิจกรรมของผู้ใช้
      io.emit("activity_updated", { userId, activity }); // แจ้งให้ไคลเอนต์อื่นทราบว่ากิจกรรมของผู้ใช้มีการอัปเดต
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId; // เก็บไอดีของผู้ใช้ที่ disconnect

      // ตรวจสอบว่าไคลเอนต์ที่ disconnect ไปมีไอดีอะไร
      // ถ้ามีไอดีให้ลบออกจากตาราง userSockets และ userActivities
      // และแทนที่ด้วยไอดีที่ disconnect ไปเพื่อแจ้งให้ไคลเอนต์อื่นทราบ
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId); // แจ้งให้ไคลเอนต์อื่นทราบว่าผู้ใช้ที่ disconnect
      }
    });
  });
};

initializeSocket(server);

export { app, server };
