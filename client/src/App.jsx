import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import assets from './assets/assets'

const App = () => {
  const { authUser } = useContext(AuthContext);
  return (

    <div style={{ backgroundImage: `url(${assets.bgImage})` }} className="bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App