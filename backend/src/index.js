import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import statRoutes from "./routes/stat.route.js";
import albumRoutes from "./routes/album.route.js";
import songRoutes from "./routes/song.route.js";
import connectDB from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json()); // for parsing req.body
app.use(clerkMiddleware()); // this will add auth to req object => req.auth

// file upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "/tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  })
);

// ใช้ node-cron ตั้งเวลาทำงาน ทุกต้นชั่วโมง
const tempDir = path.join(process.cwd(), "/tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    try {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
        console.log(`Deleted file: ${file}`);
      }
    } catch (err) {
      console.error("Error processing files:", err);
    }
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

server.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});
