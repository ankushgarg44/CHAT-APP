import React, { useEffect, useRef, useState, useContext } from 'react';
import assets from '../assets/assets';
import { formatMessageTime, readFileAsDataURL } from '../lib/utilis';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const { authUser, socket, axios } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const scrollEnd = useRef();
  const fileInputRef = useRef(null);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedUser) return;
      try {
        const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    getMessages();
  }, [selectedUser, axios]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Only append if the message is from the currently selected user
      if (newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await readFileAsDataURL(file);
      setImage(base64);
      setImagePreview(base64);
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const handleSendMessage = async () => {
    if (!text && !image) return;
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, {
        text,
        image,
      });

      if (data.success) {
        setMessages([...messages, data.newMessage]);
        setText("");
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg flex flex-col'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.default_profile} alt="" className='w-8 rounded-full object-cover aspect-square' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {/* Online status could be checked here too if we passed onlineUsers */}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt=""
          className='md:hidden max-w-7 cursor-pointer'
        />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      <div className='flex-1 overflow-y-scroll p-3 pb-6 flex flex-col gap-4'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 
          ${msg.senderId === authUser._id ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
            <img src={msg.senderId === authUser._id ?
              (authUser.profilePic || assets.default_profile) :
              (selectedUser.profilePic || assets.default_profile)}
              alt="" className='w-7 rounded-full object-cover aspect-square' />

            <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
              {msg.image && (
                <img src={msg.image} alt="" className='max-w-[230px] border
                border-gray-700 rounded-lg overflow-hidden mb-2' />
              )}
              {msg.text && (
                <p className={`p-2 max-w-[200px] md:text-sm font-light
                rounded-lg break-all text-white
                ${msg.senderId === authUser._id ? 'bg-violet-500/30 rounded-br-none' :
                    'bg-gray-700/50 rounded-bl-none'}`}>{msg.text}</p>
              )}
              <p className='text-gray-500 text-xs mt-1'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* ----- bottom area ----- */}
      <div className='p-3'>
        {imagePreview && (
          <div className="relative w-20 h-20 mb-2">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-600" />
            <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              X
            </button>
          </div>
        )}
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Send a message"
              className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            />
            <input
              type="file"
              id="image"
              accept='image/*'
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer hover:opacity-80' />
            </label>
          </div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer hover:scale-110 transition-transform' />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-md:hidden h-full'>
      <img src={assets.logo_icon} className="max-w-16 " alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime,anywhere</p>
    </div>
  )
}

export default ChatContainer;