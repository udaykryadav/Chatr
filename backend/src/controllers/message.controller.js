import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import e from "express";
import cloudinary from "../lib/cloudinary.js";



export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInuserId = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInuserId }
        }).select("-password");

        res.status(200).json(filteredUsers);

    }
    catch(error){
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });  
    }

};

export const getMessages = async (req, res) => {
    try{
        const {id:userToChatId}= req.params
        const myid = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderid: myid, receiverid: userToChatId },
                { senderid: userToChatId, receiverid: myid }
            ]
        })

        res.status(200).json(messages);

    }
    catch(error){
        console.error("Error getMessages controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
};

export const sendMessage = async (req, res) => {
    try{
        const {text , image} = req.body;
        const {id:receiverid} = req.params;
        const senderid = req.user._id;

        let imageUrl;
        if(image){
            // Upload image to Cloudinary
            const upLoadResponse = await cloudinary.uploader.upload(image);
            imageUrl = upLoadResponse.secure_url;
        }
        const newMessage = await Message({
            senderid,
            receiverid,
            text,
            image: imageUrl,
            
        });

        await newMessage.save();

        //todo: real-time functionality goes here => socket.io


        res.status(201).json(newMessage);


    }
    catch(error){
        console.log("Error send message controller ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
