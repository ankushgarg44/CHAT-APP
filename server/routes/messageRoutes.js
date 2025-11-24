import express from "express";
import { getUsersForSidebar, getMessages, sendMessage, markMessageAsSeen } from "../controllers/messageControlller.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;
