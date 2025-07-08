import React, { useEffect } from 'react'
import {useChatStore} from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import  MessageSkeleton from './skeletons/MessageSkeleton';

export const ChatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser} = useChatStore();

  useEffect(() => {
  if (selectedUser?._id) {
    getMessages(selectedUser._id);
  }
}, [selectedUser?._id]);


  if (isMessagesLoading){ 
    return (
    <div className='flex-1 flex items-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>

    </div>

  )
}
    
  return (
    <div className='flex-1  flex flex-col overflow-y-auto '>

      <ChatHeader/>

      <p>messages....</p>
      <MessageInput />
    </div>
  )
};
