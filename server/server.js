// server.js
import express from "express";
import "dotenv/config.js";
import http from "http";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { initializeSocket, userSocketMap } from "./lib/socket.js";

// Create Express app + HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup with production CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

// Initialize socket logic (your existing function)
initializeSocket(io);

// Socket connection handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("New client connected:", userId || "Anonymous");

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Send updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Client disconnected:", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware - CORS config for production
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true })); // Optional: for form data

// Basic route to check if server is alive
app.get("/api/status", (req, res) => {
  res.json({ message: "Server is running!", onlineUsers: Object.keys(userSocketMap) });
});

// API Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Users route - for fetching all users (used by sidebar)
import { getAllUsers } from "./controllers/userController.js";
import { protectRoute } from "./middleware/auth.js";
app.get("/api/users", protectRoute, getAllUsers);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB(); // This will throw if connection fails
    server.listen(PORT, () => {
      console.log(`MONGODB connected and Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error("Check your MONGODB_URI and IP whitelist!");
    process.exit(1);
  }
};

startServer();