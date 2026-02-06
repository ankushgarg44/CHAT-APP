import { useState, useContext, useEffect } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(
      messages
        .filter(msg => msg.image)
        .map(msg => msg.image)
    );
  }, [messages]);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className='bg-slate-900/60 backdrop-blur-lg flex flex-col h-full border-l border-white/10 max-md:hidden'>
      {/* ===== Profile Section ===== */}
      <div className='flex-1 overflow-y-auto'>
        <div className='pt-8 pb-6 px-6 text-center border-b border-white/10'>
          {/* Avatar with online ring */}
          <div className='relative inline-block mb-4'>
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className={`w-24 h-24 rounded-full object-cover border-4 ${isOnline ? 'border-green-500/50' : 'border-white/10'
                }`}
            />
            {isOnline && (
              <span className='absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-slate-900'></span>
            )}
          </div>

          {/* Name and status */}
          <h2 className='text-xl font-semibold text-white mb-1'>
            {selectedUser.fullName}
          </h2>
          <span className={`inline-flex items-center gap-1.5 text-xs ${isOnline ? 'text-green-400' : 'text-slate-400'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>
            {isOnline ? 'Online now' : 'Offline'}
          </span>

          {/* Bio */}
          {selectedUser.bio && (
            <p className='mt-3 text-sm text-slate-400 leading-relaxed'>
              {selectedUser.bio}
            </p>
          )}
        </div>

        {/* ===== Media Section ===== */}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-white'>Shared Media</h3>
            {msgImages.length > 0 && (
              <span className='text-xs text-slate-400'>{msgImages.length} items</span>
            )}
          </div>

          {msgImages.length === 0 ? (
            <div className='py-8 text-center'>
              <div className='w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center'>
                <img src={assets.gallery_icon} alt="" className='w-5 h-5 opacity-40' />
              </div>
              <p className='text-xs text-slate-400'>No shared media yet</p>
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-2'>
              {msgImages.slice(0, 9).map((url, index) => (
                <button
                  key={index}
                  onClick={() => window.open(url)}
                  className='aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity border border-white/10 hover:border-violet-500/50'
                >
                  <img
                    src={url}
                    alt=""
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
              {msgImages.length > 9 && (
                <div className='aspect-square rounded-lg bg-white/5 flex items-center justify-center border border-white/10'>
                  <span className='text-sm text-slate-400'>+{msgImages.length - 9}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Logout Button ===== */}
      <div className='p-4 border-t border-white/10'>
        <button
          onClick={logout}
          className='w-full py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity'
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
};

export default RightSidebar;