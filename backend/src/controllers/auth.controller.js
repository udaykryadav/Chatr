import { generateToken } from "../lib/utils.js";    
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

//sign up controller
// This controller handles user registration
// It checks if the user already exists, hashes the password, and saves the user to the database
// It also generates a JWT token for the user upon successful registration

export const signup = async (req,res)=>{ 
    const {fullName,email,password,profilePic} = req.body;
    try {
        
        if(!fullName || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
 
        
        if(password.length < 6){
            return res.status(400).json({message:"Password should be at least 6 characters long"});
        }
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"User already exists"});
        
       //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password : hashedPassword,
            profilePic,
        });

        if(newUser){
            //generate jwt token here
              await newUser.save();
              generateToken(newUser._id,res)
              

              res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
              })

        }
        else{
            return res.status(400).json({message:"invalid user data"});
        }

    }catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};

//login controller
// This controller handles user login
// It checks if the user exists, verifies the password, and generates a JWT token for the user upon successful login


export const login =async(req,res) =>{
    const {email,password} = req.body;
    try{
        // Check if email and password are provided
        const user = await User.findOne({email})
        // If user does not exist, return an error
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        // If user exists, compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        // If the password is incorrect, return an error
        if(!isPasswordCorrect) {
        return res.status(400).json({message:"Invalid credentials"});}
        // If the password is correct, generate a JWT token for the user
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });
    }
    // Catch any errors that occur during the process and return a 500 status code
    catch (error){
        console.log("Error in login controller",error.message);
        res.status(500).json({
            message:"Invalid credentials",
        });
    
    }

};


//logout controller
// This controller handles user logout
// It simply sends a response indicating that the user has logged out successfully

export const logout =(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"});

    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({
            message:"Internal server error",
        });

    }
};


//update profile controller
// This controller handles updating the user's profile picture
// It checks if the user is authenticated, uploads the new profile picture to Cloudinary, and updates the user's profile in the database
// It returns the updated user information upon success
export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userid = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error in update Profile ", error);
        res.status(500).json({
            message: "Internal server error",
        });

    }
};

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

