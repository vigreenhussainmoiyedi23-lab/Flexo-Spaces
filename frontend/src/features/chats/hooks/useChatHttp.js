import { useContext } from "react";
import { getChatAllMessages, getUserAllChats, chatAccess, UploadImage } from "../services/chat.api.js";
import { ChatContext } from "../chat.context.jsx";

export const useChatHttp = () => {
    const {
        loading, setLoading,
        userAllChats, setUserAllChats,
        chatsAllMessages, setChatsAllMessages
    } = useContext(ChatContext)
    const getChatAllMessagesHandler = async ({ chatId, limit, skip }) => {
        setLoading(true)
        try {
            const { messages } = await getChatAllMessages({ chatId, limit, skip });
            setChatsAllMessages(messages);

            return messages
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const getUserAllChatsHandler = async () => {
        setLoading(true)
        try {
            let { chats } = await getUserAllChats();
            setUserAllChats(chats);
            return chats;
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const chatAccessHandler = async (otherUserId) => {
        setLoading(true)
        try {
            const response = await chatAccess(otherUserId);
            return response;
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    }
    const addNewMessage = async (message) => {
        setChatsAllMessages([...chatsAllMessages, message])
        setUserAllChats(prev =>
            prev.map(chat =>
                chat._id === message.chatId
                    ? {
                        ...chat,
                        lastMessage: message,
                        lastMessageAt: message.createdAt
                    }
                    : chat
            )
        );
    }
  
    const uploadImages = async (files) => {
        setLoading(true)
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file); // key = "images"
            });
            const response = await UploadImage(formData)
            return response
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return {
        loading,
        userAllChats,
        chatsAllMessages,
        getChatAllMessagesHandler,
        getUserAllChatsHandler,
        chatAccessHandler,
        addNewMessage,
        uploadImages,
    }
}