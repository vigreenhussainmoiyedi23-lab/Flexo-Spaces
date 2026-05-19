import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useChatHttp } from "../hooks/useChatHttp";
import useAuth from "../../auth/hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
export default function ChatWindow({ chat }) {
  const { user } = useAuth();
  const { chatsAllMessages } = useChatHttp();
  const socket = useChatSocket();
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="
        p-4 border-b border-brand-800
        playfair text-brand-100
        flex items-center justify-start gap-3
      "
      >
        <img
          className="w-10 h-10 rounded-full"
          src={chat?.otherUser?.profilePicture}
          alt="profilePicture"
        />
        {chat?.otherUser?.username || "Username"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {chatsAllMessages &&
          chatsAllMessages.map((message) => (
            <MessageBubble
              key={message._id}
              from={
                user?._id.toString() === message.sender?._id.toString()
                  ? "me"
                  : "other"
              }
              message={message}
              currentUser={user}
              socket={socket}
            />
          ))}
      </div>
      {socket.typingUsers[chat?._id]?.length > 0 && (
        <div className="px-4 pb-2 text-sm bg-accent-500 text-brand-900 w-fit mx-3 my-2 py-2 rounded-bl-sm rounded-lg italic flex gap-1">
          <span>{chat.otherUser.username} Typing</span>
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
        </div>
      )}
      {/* Input */}
      <ChatInput chatId={chat?._id} socket={socket} />
    </div>
  );
}
