import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

// Set axios defaults
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { authUser, socket } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);           // current chat messages
  const [unseenMessages, setUnseenMessages] = useState({}); // { userId: count }
  const [users, setUsers] = useState([]);                 // all users list
  const [selectedUser, setSelectedUser] = useState(null); // currently selected user for chat

  // fetch all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      if (data?.success) {
        setUsers(data.users);
        // Also fetch unseen messages count
        if (data.unseenMessages) {
          setUnseenMessages(data.unseenMessages);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users");
    }
  };

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
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewMessage = newMessage => {
      // if message is for current user, handle it
      if (newMessage?.receiverId === authUser._id) {
        // if chat with sender is open, add to messages
        if (selectedUser?._id === newMessage.senderId) {
          setMessages(prev => [...prev, newMessage]);
        } else {
          // otherwise increase unseen count
          setUnseenMessages(prev => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, authUser, selectedUser]);

  // Clear messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser?._id]);

  const value = {
    messages,
    setMessages,
    unseenMessages,
    setUnseenMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
