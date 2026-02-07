import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatcontainer from '../components/Chatcontainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div
      className="w-full min-h-screen min-h-[100dvh] flex items-center justify-center
        p-3 sm:p-4 md:p-5 lg:p-6 xl:px-[8%] xl:py-[2%]
        [padding-left:max(0.5rem,env(safe-area-inset-left))] [padding-right:max(0.5rem,env(safe-area-inset-right))]
        [padding-top:max(0.5rem,env(safe-area-inset-top))] [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div
        className="w-full max-w-7xl backdrop-blur-xl bg-slate-900/40 border border-white/10
          rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row
          h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] md:h-[calc(100dvh-2.5rem)] lg:h-[calc(100dvh-3rem)]
          shadow-2xl shadow-violet-500/5"
      >
        {/* Left Sidebar - User list */}
        <div
          className={`flex-shrink-0 w-full md:w-72 lg:w-80 xl:w-96 min-w-0
            ${selectedUser ? 'hidden md:flex' : 'flex'}`}
        >
          <Sidebar />
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex-1 min-w-0 flex flex-col
            ${selectedUser ? 'flex' : 'hidden md:flex'}`}
        >
          <Chatcontainer />
        </div>

        {/* Right Sidebar - Profile & Media */}
        {selectedUser && (
          <div className="hidden lg:flex flex-shrink-0 w-80 xl:w-96">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
