import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatcontainer from '../components/Chatcontainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div className='min-h-screen w-full p-4 sm:p-6 md:p-8 lg:px-[10%] lg:py-[3%]'>
      <div className={`backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl
         overflow-hidden h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6%)]
         shadow-2xl shadow-violet-500/5
         flex ${selectedUser ? '' : ''}`}
      >
        {/* Left Sidebar - User list */}
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96`}>
          <Sidebar />
        </div>

        {/* Main Chat Area */}
        <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1`}>
          <Chatcontainer />
        </div>

        {/* Right Sidebar - Profile & Media */}
        {selectedUser && (
          <div className='hidden lg:flex w-72 xl:w-80'>
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
