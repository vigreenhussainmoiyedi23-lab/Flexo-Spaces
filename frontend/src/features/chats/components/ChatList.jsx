import ChatItem from "./ChatItem";

export default function ChatList({ chats,chatId }) {

  return (
    <div className="p-3" >
      <h2 className="playfair text-2xl mb-4 text-brand-100">Messages</h2>

      <div className="space-y-2">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} current={chatId}/>
        ))}
      </div>
    </div>
  );
}
