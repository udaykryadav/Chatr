import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
       
    },
});

//used to store online user
const userSocketMap = {}; //userId: socketId


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId; 
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
    }

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients

    socket.on("disconnect", () => {
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId]; // Remove the user from the map

        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users to all clients
    });

    // Handle other socket events here
});
export { io , app , server };