import { generateToken } from "../lib/utils.js";    
import User from "../models/user.model.js";


export const signup = async (req,res)=>{ 
    const {fullName,email,password,profilePic} = req.body;
    try {
        //hash password
        if(password.length < 6){
            return res.status(400).json({message:"Password should be at least 6 characters long"});
        }
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"User already exists"});

        const salt = await bccrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
        });

        if(newUser){
            //generate jwt token here
              generateToken(newUser._id,req)
              await newUser.save();

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
export const login =(req,res)=>{
    res.send("signup route");
};
export const logout =(req,res)=>{
    res.send("signup route");
};