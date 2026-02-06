// src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

// Set axios defaults
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
// Set token from localStorage if available
const storedToken = localStorage.getItem("token");
if (storedToken) {
  axios.defaults.headers.common["token"] = storedToken;
}

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // auth token
  const [authUser, setAuthUser] = useState(null);                          // logged-in user
  const [onlineUsers, setOnlineUsers] = useState([]);                      // ids of online users
  const [socket, setSocket] = useState(null);                              // socket.io instance
  const [messages, setMessages] = useState([]);                            // current chat messages
  const [unseenMessages, setUnseenMessages] = useState({});                // { userId: count }
  const [users, setUsers] = useState([]);                                  // all users list
  const [selectedUser, setSelectedUser] = useState(null);                  // currently selected user for chat

  // check auth and fetch user when app loads
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data?.success) {
        setAuthUser(data.user);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Authentication failed");
      setAuthUser(null);
      setToken("");
      localStorage.removeItem("token");
    }
  };

  // fetch all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users");
    }
  };

  // call checkAuth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // connect / disconnect socket on auth change
  useEffect(() => {
    if (!authUser) {
      if (socket) socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "/", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      // console.log("socket connected", newSocket.id);
    });

    newSocket.on("getOnlineUsers", users => {
      setOnlineUsers(users);
    });

    newSocket.on("newMessage", newMessage => {
      // if chat is open with this sender, append and mark as seen
      if (
        newMessage?.senderId &&
        newMessage?.receiverId &&
        authUser &&
        newMessage.receiverId === authUser._id
      ) {
        setMessages(prev => [...prev, newMessage]);

        // increase unseen count for that sender
        setUnseenMessages(prev => ({
          ...prev,
          [newMessage.senderId]:
            (prev[newMessage.senderId] || 0) + (newMessage.seen ? 0 : 1),
        }));
      }
    });

    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.off("newMessage");
      newSocket.disconnect();
    };
  }, [authUser]);

  // fetch messages for a selected user
  const getMessages = async selectedUserId => {
    if (!selectedUserId) return;
    try {
      const { data } = await axios.get(`/api/messages/${selectedUserId}`);
      if (data?.success) {
        setMessages(data.messages);
        // when opening chat, clear unseen counter for that user
        setUnseenMessages(prev => {
          const copy = { ...prev };
          delete copy[selectedUserId];
          return copy;
        });
      }
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  // send text or image message
  const sendMessage = async ({ receiverId, text, image }) => {
    if (!receiverId || (!text && !image)) return;
    try {
      const { data } = await axios.post(`/api/messages/send/${receiverId}`, {
        text,
        image,
      });

      if (data?.success) {
        setMessages(prev => [...prev, data.newMessage]);
        if (socket) {
          socket.emit("sendMessage", data.newMessage);
        }
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const value = {
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    socket,
    messages,
    setMessages,
    unseenMessages,
    setUnseenMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    checkAuth,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
