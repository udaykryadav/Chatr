import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';


const BASE_URL = import.meta.MODE==="development"?'http://localhost:5001': "/";

export const useAuthStore = create((set, get) => ({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    

    checkAuth : async () =>{
        try{
            const res = await axiosInstance.get('/auth/check');
            set ({authUser: res.data});

            get().connectSocket();

        }
        catch(error){
            console.error("Error checking authentication:", error);
            set({authUser: null});

        }
        finally{
            set({isCheckingAuth: false});
        }
    },
  
    signup : async (data)=>{
        set({isSigningUp: true});
        try{
           const res = await axiosInstance.post('/auth/signup', data);
           set({authUser: res.data});
           toast.success("Account created successfully");

           get().connectSocket(); // Connect to socket after signup
           
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Signup failed");

        }finally{
            set({isSigningUp: false});

        }
    },

    login : async (data)=>{
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket(); // Connect to socket after login

        }
        catch(error){
            toast.error(error?.response?.data?.message || "Login failed");

        }finally{
            set({isLoggingIn: false});

        }

    },

    logout : async () => {
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket(); // Disconnect socket on logout

        }
        catch{
            toast.error(error?.response?.data?.message || "Logout failed");

        }

            
    },

    updateProfile : async (data) => {
        set ({isUpdatingProfile: true});
        try{
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");

        }
        catch(error){
            toast.error(error?.response?.data?.message || "Profile update failed");
            console.error("Error updating profile:", error);

        }
        finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket:()=>{
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userId : authUser._id,
            }
        });

        socket.connect();
        set({ socket:socket });

        socket.on('getOnlineUsers', (usersIds) => {
            set({ onlineUsers: usersIds });
        });

    },
    
    disconnectSocket:()=>{
        if (get().socket?.connected) get().socket.disconnect(); 

    },


}));
