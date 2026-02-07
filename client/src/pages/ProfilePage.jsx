import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
    const {authUser,updateProfile}=useContext(AuthContext)
    const [selectedImg, setSelectedImg] = useState(null)
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName)
    const [bio, setBio] = useState(authUser.bio)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!selectedImg){
            await updateProfile({ fullName : name, bio });
            navigate('/')
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onloadend = async () => {
            const base64Image = reader.result;
            await updateProfile({ profilePic: base64Image ,fullName : name, bio });
            navigate('/');
        };
    }
    return (
        <div className='min-h-screen min-h-[100dvh] w-full flex items-center justify-center
          p-4 sm:p-6 md:p-8
          [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))]
          [padding-top:max(1rem,env(safe-area-inset-top))] [padding-bottom:max(1rem,env(safe-area-inset-bottom))]'>
            <div className='w-full max-w-2xl backdrop-blur-xl bg-slate-900/40 text-gray-300 border border-white/20
              flex flex-col sm:flex-row items-center gap-6 sm:gap-8 rounded-xl sm:rounded-2xl overflow-hidden
              p-6 sm:p-8 md:p-10'>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full min-w-0">
                    <h3 className="text-lg">Profile details</h3>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input
                            onChange={(e) => setSelectedImg(e.target.files[0])}
                            type="file"
                            id='avatar'
                            accept='.png, .jpg, .jpeg'
                            hidden
                        />
                        <img
                            src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
                            alt=""
                            className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}
                        />
                        upload profile image
                    </label>

                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        required
                        placeholder='Your name'
                        className='p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="Write profile bio"
                        required
                        className="p-2.5 sm:p-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        rows={4}
                    ></textarea>

                    <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 px-6 rounded-full text-base font-medium cursor-pointer hover:opacity-90 transition-opacity">
                        Save
                    </button>
                </form>
                <img
                    className={`max-w-36 sm:max-w-44 aspect-square rounded-full object-cover flex-shrink-0 ${selectedImg ? 'rounded-full' : ''}`}
                    src={authUser?.profilePic || assets.logo_icon}
                    alt=""
                />
            </div>
        </div>
    )
}

export default ProfilePage