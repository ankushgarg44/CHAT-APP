import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { readFileAsDataURL } from '../lib/utilis';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { authUser, updateProfile } = useContext(AuthContext);
    const [selectedImg, setSelectedImg] = useState(null)
    const [previewImg, setPreviewImg] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")

    useEffect(() => {
        if (authUser) {
            setName(authUser.fullName || "");
            setBio(authUser.bio || "");
            setPreviewImg(authUser.profilePic || null);
        }
    }, [authUser]);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const base64 = await readFileAsDataURL(file);
            setSelectedImg(base64);
            setPreviewImg(base64);
        } catch (error) {
            toast.error("Failed to process image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateProfile({ fullName: name, bio, profilePic: selectedImg });
            // navigate('/') // Optional: stay on profile page or go home
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center 
        justify-center'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
             border-gray-600 flex items-center justify-between max-sm:flex-col-reverse 
             rounded-lg'>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    <h3 className="text-lg">Profile details</h3>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input
                            onChange={handleImageSelect}
                            type="file"
                            id='avatar'
                            accept='.png, .jpg, .jpeg'
                            hidden
                        />
                        <img
                            src={previewImg || assets.avatar_icon}
                            alt=""
                            className={`w-12 h-12 object-cover ${previewImg && 'rounded-full'}`}
                        />
                        upload profile image
                    </label>

                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        required
                        placeholder='Your name'
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent'
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="Write profile bio"
                        required
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent"
                        rows={4}
                    ></textarea>

                    <button type="submit" className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer hover:opacity-90">
                        Save
                    </button>
                </form>
                <img
                    className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover'
                    src={assets.logo_icon}
                    alt=""
                />
            </div>
        </div>
    )
}

export default ProfilePage