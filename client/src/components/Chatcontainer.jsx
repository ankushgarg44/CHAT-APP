import { useRef, useEffect, useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ receiverId: selectedUser._id, text: input });
    setInput("");
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      await sendMessage({ receiverId: selectedUser._id, image: reader.result });
      e.target.value = null;
    };
  }

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className='flex flex-col h-full bg-slate-900/50 backdrop-blur-lg'>
      {/* ===== Chat Header ===== */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-purple-600/10'>
        {/* Back button (mobile) */}
        <button
          onClick={() => setSelectedUser(null)}
          className='md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors'
        >
          <img src={assets.arrow_icon} alt="back" className='w-5 h-5 opacity-70' />
        </button>

        {/* User avatar with online indicator */}
        <div className='relative'>
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className='w-10 h-10 rounded-full object-cover border-2 border-white/20'
          />
          {isOnline && (
            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900'></span>
          )}
        </div>

        {/* User info */}
        <div className='flex-1'>
          <h3 className='text-white font-medium'>{selectedUser.fullName}</h3>
          <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Help icon */}
        <button className='p-2 rounded-full hover:bg-white/10 transition-colors max-md:hidden'>
          <img src={assets.help_icon} alt="help" className='w-5 h-5 opacity-60' />
        </button>
      </div>

      {/* ===== Messages Area ===== */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full text-slate-400'>
            <img src={assets.logo_icon} alt="" className='w-16 opacity-30 mb-4' />
            <p className='text-sm'>No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;
          const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                <img
                  src={isSender
                    ? (authUser?.profilePic || assets.avatar_icon)
                    : (selectedUser?.profilePic || assets.avatar_icon)
                  }
                  alt=""
                  className='w-8 h-8 rounded-full object-cover'
                />
              </div>

              {/* Message bubble */}
              <div className={`max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                {msg.image ? (
                  <div className='relative group'>
                    <img
                      src={msg.image}
                      alt=""
                      className='max-w-xs rounded-2xl border border-white/10 hover:border-violet-500/50 transition-colors cursor-pointer'
                      onClick={() => window.open(msg.image)}
                    />
                    <p className={`text-[10px] text-slate-500 mt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${isSender
                          ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-md'
                          : 'bg-white/10 text-white rounded-bl-md'
                        }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-slate-500 mt-1 px-1 ${isSender ? 'text-right' : 'text-left'}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ===== Input Area ===== */}
      <div className='p-4 border-t border-white/10 bg-slate-900/80'>
        <div className='flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-violet-500/50 transition-colors'>
          {/* Image upload */}
          <label htmlFor="image" className='cursor-pointer hover:opacity-80 transition-opacity'>
            <img src={assets.gallery_icon} alt="attach" className='w-5 h-5 opacity-60' />
          </label>
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept='image/png, image/jpeg'
            hidden
          />

          {/* Text input */}
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            className='flex-1 bg-transparent text-white text-sm placeholder-slate-400 outline-none'
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`p-2 rounded-full transition-all ${input.trim()
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
              }`}
          >
            <img src={assets.send_button} alt="send" className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  ) : (
    // Empty state when no user selected
    <div className='flex flex-col items-center justify-center h-full bg-gradient-to-br from-violet-900/20 to-slate-900 max-md:hidden'>
      <div className='text-center'>
        <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-violet-500/20 flex items-center justify-center'>
          <img src={assets.logo_icon} className="w-10 h-10" alt="" />
        </div>
        <h2 className='text-2xl font-semibold text-white mb-2'>Chat anytime, anywhere</h2>
        <p className='text-slate-400'>Select a conversation to start messaging</p>
      </div>
    </div>
  )
}

export default ChatContainer;