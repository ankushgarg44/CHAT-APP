import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSunbmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });
  }

  return (
    <div className='min-h-screen min-h-[100dvh] w-full flex flex-col sm:flex-row items-center 
      justify-center sm:justify-evenly gap-6 sm:gap-8 p-4 sm:p-6 md:p-8
      [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))]
      [padding-top:max(1rem,env(safe-area-inset-top))] [padding-bottom:max(1rem,env(safe-area-inset-bottom))]'>
      {/* --- left --- */}
      <img src={assets.logo_big} alt="" className='w-[min(25vw,200px)] sm:w-[min(30vw,250px)] flex-shrink-0' />

      {/* --- right --- */}
      <form onSubmit={onSunbmitHandler} className='w-full max-w-md border-2 bg-white/10 backdrop-blur-xl text-white 
        border-white/20 p-5 sm:p-6 flex flex-col gap-5 sm:gap-6 rounded-xl sm:rounded-2xl shadow-2xl shadow-violet-500/10'>
        <h2 className='font-medium text-xl sm:text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt=""
            className='w-5 cursor-pointer' />}

        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
            placeholder='provide a short bio...'
            required
          ></textarea>
        )}

        <button type='submit' className='py-3 px-4 bg-gradient-to-r from-purple-500
          to-violet-600 text-white rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-slate-400'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-slate-400'>Already have an account? <span
              onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
              className='font-medium text-violet-500 cursor-pointer'>login here</span></p>
          ) : (
            <p className='text-sm text-slate-400'>Create an account <span onClick=
              {() => setCurrState("Sign up")} className='font-medium text-violet-400 cursor-pointer hover:underline'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}


export default LoginPage