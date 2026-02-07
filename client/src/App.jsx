import React, { useContext } from 'react'
import { Navigate,Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'
import assets from './assets/assets'
//here we will check if user is authenticated or not and then render the appropriate page. If user is authenticated then we will render the HomePage otherwise we will render the LoginPage. We will also have a route for ProfilePage which will be accessible only if user is authenticated. We will use Navigate component from react-router-dom to redirect the user to the appropriate page based on their authentication status.
const App = () => {
  const { authUser } = useContext(AuthContext);
  return (

    <div style={{ backgroundImage: `url(${assets.bgImage})` }} className="min-h-screen min-h-[100dvh] bg-cover bg-center bg-fixed">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ?<HomePage />:<Navigate to ="/login"/> } />
        <Route path='/login' element={!authUser ? <LoginPage />:<Navigate to ="/"/> } />
        <Route path='/profile' element={authUser ? <ProfilePage />:<Navigate to ="/login"/>} />
      </Routes>
    </div>
  )
}

export default App