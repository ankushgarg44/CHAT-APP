import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// get all users except the logged-in user
export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        res.json({ success: true, users });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// signup a new user
export const signup = async (req, res) => {
    // Implementation for user signup
    const { email, password, fullName, bio } = req.body;

    try {
        if (!email || !password || !fullName || !bio) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            bio
        });
        await newUser.save();
        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    // Implementation for user login


    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        // Check if user exists before accessing password
        if (!userData) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id)
        res.json({ success: true, userData, token, message: "Login successful" })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// controller to check if user is authenticated
export const checkAuth = async (req, res) => {
    // Implementation for checking user authentication
    res.json({ success: true, user: req.user });
}

// controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {
                profilePic:
                    upload.secure_url, bio, fullName
            }, { new: true });
        }
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}