// src/components/Sidebar.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import assets from "../assets/assets";
import { ChatContext } from "../context/ChatContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";


const Sidebar = () => {
  const navigate = useNavigate();

  // from ChatContext: users list, selection, unseen counts, fetch
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  // from AuthContext: logout and online users
  const { logout, onlineUsers } = useContext(AuthContext);

  // search input
  const [input, setInput] = useState("");

  // load users on mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // filter users by search
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(input.toLowerCase())
  );

  // check if a user is online
  const isUserOnline = userId => {
    return onlineUsers.includes(userId);
  };

  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-lg w-full md:w-72 lg:w-80 border-r border-white/10 flex flex-col ${selectedUser ? "max-md:hidden" : ""
        }`}
    >
      {/* ===== Header ===== */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={assets.logo}
              alt="logo"
              className="w-8 h-8"
            />
            <span className="text-white font-semibold text-lg">QuickChat</span>
          </div>

          {/* Menu dropdown */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <img
                src={assets.menu_icon}
                alt="menu"
                className="w-5 h-5 opacity-70"
              />
            </button>

            <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                Edit Profile
              </button>
              <hr className="border-white/10 my-1" />
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search box */}
        <div className="relative">
          <img
            src={assets.search_icon}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-slate-400 outline-none focus:border-violet-500/50 transition-colors"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* ===== Online Users Section ===== */}
      {onlineUsers.length > 0 && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Online Now</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {users.filter(u => isUserOnline(u._id)).map(user => (
              <button
                key={user._id}
                onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-all ${selectedUser?._id === user._id ? 'bg-violet-500/20' : ''
                  }`}
              >
                <div className="relative">
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
                </div>
                <span className="text-[10px] text-slate-300 whitespace-nowrap max-w-12 truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Users List ===== */}
      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 text-xs text-slate-400 mb-2 uppercase tracking-wider">Messages</p>

        {filteredUsers.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-slate-400">No users found</p>
          </div>
        )}

        {filteredUsers.map(user => (
          <button
            key={user._id}
            onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all ${selectedUser && selectedUser._id === user._id
                ? "bg-violet-500/20 border-l-2 border-violet-500"
                : "border-l-2 border-transparent"
              }`}
          >
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || assets.avatar_icon}
                alt={user.fullName}
                className={`w-12 h-12 rounded-full object-cover border-2 ${isUserOnline(user._id) ? 'border-green-500/50' : 'border-white/10'
                  }`}
              />
              {isUserOnline(user._id) && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></span>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white truncate">
                  {user.fullName}
                </p>
                {unseenMessages[user._id] > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-violet-500 text-[10px] text-white font-medium">
                    {unseenMessages[user._id]}
                  </span>
                )}
              </div>
              <p className={`text-xs ${isUserOnline(user._id) ? "text-green-400" : "text-slate-400"}`}>
                {isUserOnline(user._id) ? "● Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
