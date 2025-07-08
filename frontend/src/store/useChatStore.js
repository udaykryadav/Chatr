import { create } from 'zustand';

import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios';

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
            set({messages: res.data, selectedUser: userId});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sentMessage: async (messageData) => {
        const {selectedUser,messages} = get()

        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser}`, messageData);
             
            set({
                messages: [...messages, res.data],
            });
        }catch(error){
            toast.error(error.response.data.message);

        }

    },
    //todo: optimistic later

    setSelectedUser: (selectedUser) => set({selectedUser}),


}));