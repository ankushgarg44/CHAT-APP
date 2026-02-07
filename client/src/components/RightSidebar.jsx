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
    <div className='w-full bg-slate-900/60 backdrop-blur-lg flex flex-col h-full border-l border-white/10'>
      {/* ===== Profile Section ===== */}
      <div className='flex-1 overflow-y-auto'>
        {/* Profile Header */}
        <div className='pt-10 pb-6 px-6 text-center border-b border-white/10 bg-gradient-to-b from-violet-900/20 to-transparent'>
          {/* Avatar with online ring */}
          <div className='relative inline-block mb-5'>
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className={`w-28 h-28 rounded-full object-cover border-4 shadow-lg shadow-violet-500/20 ${isOnline ? 'border-green-500/60' : 'border-white/20'
                }`}
            />
            {isOnline && (
              <span className='absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-[3px] border-slate-900 shadow-lg shadow-green-500/50'></span>
            )}
          </div>

          {/* Name */}
          <h2 className='text-xl font-semibold text-white mb-2'>
            {selectedUser.fullName}
          </h2>

          {/* Online Status Badge */}
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
            {isOnline ? 'Online now' : 'Offline'}
          </span>

          {/* Bio */}
          {selectedUser.bio && (
            <p className='mt-5 text-sm text-slate-300 leading-relaxed px-2'>
              {selectedUser.bio}
            </p>
          )}
        </div>

        {/* ===== Media Section ===== */}
        <div className='p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Shared Media
            </h3>
            {msgImages.length > 0 && (
              <span className='text-xs text-violet-400 font-medium bg-violet-500/20 px-2 py-0.5 rounded-full'>
                {msgImages.length} {msgImages.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {msgImages.length === 0 ? (
            <div className='py-10 text-center bg-white/5 rounded-xl border border-white/5'>
              <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center'>
                <img src={assets.gallery_icon} alt="" className='w-6 h-6 opacity-50' />
              </div>
              <p className='text-sm text-slate-400'>No shared media yet</p>
              <p className='text-xs text-slate-500 mt-1'>Photos will appear here</p>
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-2'>
              {msgImages.slice(0, 9).map((url, index) => (
                <button
                  key={index}
                  onClick={() => window.open(url)}
                  className='aspect-square rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 border border-white/10 hover:border-violet-500/50 shadow-lg hover:shadow-violet-500/20'
                >
                  <img
                    src={url}
                    alt=""
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
              {msgImages.length > 9 && (
                <button
                  onClick={() => {/* Could open gallery modal */ }}
                  className='aspect-square rounded-xl bg-violet-500/20 flex flex-col items-center justify-center border border-violet-500/30 hover:bg-violet-500/30 transition-colors'
                >
                  <span className='text-lg font-semibold text-violet-400'>+{msgImages.length - 9}</span>
                  <span className='text-[10px] text-violet-300'>more</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Logout Button ===== */}
      <div className='p-5 border-t border-white/10'>
        <button
          onClick={logout}
          className='w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200'
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
};

export default RightSidebar;