import { create } from 'zustand';

import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async()=>{
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get('/messages/users');
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            set({isUsersLoading: false});
        }finally{
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            const { users } = get();
            const fullUser = users.find((u) => u._id === userId);
             set({
            messages: res.data,
            selectedUser: fullUser,
            });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser,messages} = get()

        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
             
            set({
                messages: [...messages, res.data],
            });
        }catch(error){
            toast.error(error.response.data.message);

        }

    },


    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
 
        const socket = useAuthStore.getState().socket; 

        //todo: optimistic later
        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage],
            });
        });
        
    },

    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket; 

        socket.off("newMessage"); // Unsubscribe from the newMessage event

    },



    //todo: optimistic later

    setSelectedUser: (selectedUser) => set({selectedUser}),


}));