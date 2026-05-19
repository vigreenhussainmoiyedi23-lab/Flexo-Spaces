import { useEffect } from "react";
import { useState } from "react";

export default function ChatItem({ chat, current }) {
  function timeAgo(date, now) {
    const past = new Date(date);
    const diff = now - past;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return past.toLocaleDateString();
  }
  useEffect(() => {
    const getDelay = () => {
      const diff = Date.now() - new Date(chat?.lastMessageAt).getTime();

      if (diff < 60 * 1000) return 1000; // < 1 min → every sec
      if (diff < 60 * 60 * 1000) return 60_000; // < 1 hr → every min
      return 300_000; // older → every 5 min
    };

    let interval;

    const run = () => {
      setNow(Date.now());
      const delay = getDelay();

      clearInterval(interval);
      interval = setInterval(run, delay);
    };

    run();

    return () => clearInterval(interval);
  }, [chat?.lastMessageAt]);
  const [now, setNow] = useState(Date.now());
  return (
    <div
      style={
        chat._id.toString() === current
          ? {
              backgroundColor: "var(--color-accent-500)",
              color: "var(--color-brand-900)",
            }
          : {}
      }
      className="
      flex items-center gap-3
      p-3 rounded-xl
      bg-brand-800/40
      hover:bg-brand-700/40
      transition cursor-pointer
    "
      onClick={() => {
        window.location.href = `/chats/${chat._id}`;
      }}
    >
      <img
        src={chat.otherUser.profilePicture}
        className="w-10 h-10 rounded-full bg-brand-700"
      />

      <div className="flex-1 w-full overflow-hidden">
        <p className="montserrat font-medium ">{chat.otherUser.username}</p>
        <p className="text-sm text-brand-300 truncate flex items-center justify-between w-full">
          <span className="truncate ">
            {chat?.lastMessage?.isDeleted
              ? "Message deleted"
              : chat?.lastMessage?.text
                ? chat.lastMessage.text
                : chat?.lastMessage?.images?.length > 0
                  ? "Sent an image"
                  : "Start Messaging Now"}
          </span>
          <span className="text-brand-900">
            <span className="text-brand-900">
              {chat?.lastMessageAt ? timeAgo(chat.lastMessageAt, now) : ""}
            </span>
          </span>
        </p>
      </div>
      <div
        className={`w-3 h-3 rounded-full ${chat?.isOnline ? "bg-green-500" : "bg-red-500"}`}
      ></div>
    </div>
  );
}
