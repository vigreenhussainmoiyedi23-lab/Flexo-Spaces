import { ArrowLeft, ArrowRight, ArrowRightCircle } from "lucide-react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useNavigate } from "react-router-dom";

export default function ChatLayout({ chatId, chats, chatAllMessages }) {
  const chat = chats.find((chat) => chat._id.toString() === chatId);
  const navigate = useNavigate();
  return (
    <div className="flex h-[90vh] relative bg-brand-900 text-white mt-[10vh]">
      {/* Inbox */}
      <div
        className="
        w-full md:w-1/3
        border-r border-brand-800
        bg-brand-900
      "
      >
        <ChatList chatId={chatId} chats={chats} />
      </div>

      {/* Chat Window */}
      <div
        className="
        hidden md:flex md:flex-1
        flex-col
      "
      >
        {!chatId && (
          <div className="hidden md:flex flex-1 items-center justify-center text-brand-400">
            Select a chat to start messaging
          </div>
        )}
        {chatId && <ChatWindow chat={chat} chatAllMessages={chatAllMessages} />}
      </div>
      {chatId && (
        <div className="absolute bg-brand-900 top-0 bottom-0 left-0 right-0 md:hidden">
          <button
            onClick={() => navigate("/chats")}
            className="absolute top-8 right-4 flex text-accent-500 items-center justify-center gap-3"
          >
            Back
            <ArrowRightCircle className="w-full h-full" />
          </button>
          <ChatWindow chat={chat} chatAllMessages={chatAllMessages} />
        </div>
      )}
    </div>
  );
}
