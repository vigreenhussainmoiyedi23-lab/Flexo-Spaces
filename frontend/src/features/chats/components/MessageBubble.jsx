import { useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import { MoreVertical, X } from "lucide-react";

export default function MessageBubble({ from, message, currentUser, socket }) {
  const { text, images, _id: messageId, chatId, isDeleted, sender } = message;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const { EditMessage, deleteMessage } = socket;
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const HandleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const payload = {
      chatId,
      messageId,
      text: editText,
    };
    EditMessage(payload);
    setIsEditing(false);
    setLoading(false);
  };

  if (isDeleted) {
    return (
      <div
        className={"flex " + (from === "me" ? "justify-end" : "justify-start")}
      >
        <p
          className={
            "text-sm bg-brand-800 rounded-xl px-3 py-2 text-accent-500 " +
            (from === "me" ? " rounded-br" : " rounded-bl")
          }
        >
          {sender.username} Deleted This Message
        </p>
      </div>
    );
  }
  return (
    <div
      className={`
      relative 
      flex  ${from === "me" ? "justify-end" : "justify-start"}
    `}
    >
      {from !== "me" && (
        <img
          src={sender?.profilePicture}
          alt="profilePicture"
          className="w-10 h-10 rounded-full mr-3 self-center"
        />
      )}
      {from === "me" && (
        <div
          onClick={() => setMenuOpen((prev) => !prev)}
          className={
            menuOpen
              ? "top-0 left-0 "
              : "flex items-center justify-center cursor-pointer"
          }
        >
          {!menuOpen ? (
            <MoreVertical className=" " />
          ) : (
            <X className="bg-red-500 rounded-full" />
          )}
        </div>
      )}
      {from === "me" && menuOpen && (
        <div className="flex flex-col w-fit h-fit px-3 py-2 rounded-lg bg-brand-800">
          {text && images.length === 0 && (
            <button onClick={() => setIsEditing(true)} className="">
              Edit
            </button>
          )}
          <button
            onClick={() => {
              setLoading(true);
              if (loading) return;
              deleteMessage({ messageId, chatId });
              setMenuOpen(false);
              setLoading(false);
            }}
            className=""
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
      {text && images.length === 0 && !isEditing && (
        <div
          className={`
        p-3 rounded-2xl max-w-[70%]
        ${
          from === "me"
            ? "bg-accent-500 text-brand-900 rounded-br-none"
            : "bg-brand-800 text-brand-100 rounded-bl-none"
        }
      `}
        >
          {text}
        </div>
      )}
      {text && images.length === 0 && isEditing && (
        <div className="flex flex-col items-end justify-end">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border border-sec rounded-lg px-4 py-2 focus:outline-none  focus:bg-brand-500"
          />
          <button
            onClick={HandleSubmit}
            className="bg-brand-500 w-fit text-white rounded-lg px-4 py-2"
          >
            {loading ? "Saving..." : "  Save"}
          </button>
        </div>
      )}

      {images.length > 0 && !text && (
        <div
          className={` flex flex-wrap rounded-lg gap-2 border border-white/30 ${from === "me" ? "justify-end bg-accent-500" : "justify-start bg-brand-800 "}`}
        >
          {images.map((img) => (
            <img
              src={img.url}
              alt="image"
              className="w-30 lg:w-60   rounded-lg"
            />
          ))}
        </div>
      )}
      {images.length > 0 && text && (
        <div
          className={`flex flex-col ${from === "me" ? "items-end" : "items-start"}`}
        >
          <div
            className={` flex flex-wrap rounded-lg gap-2 border border-white/30 ${from === "me" ? "justify-end bg-accent-500" : "justify-start bg-brand-800 "}`}
          >
            {images.map((img) => (
              <img
                src={img.url}
                alt="image"
                className="w-30 lg:w-60   rounded-lg"
              />
            ))}
          </div>
          {
            <div
              className={`
        p-3 rounded-2xl max-w-[70%] w-fit
        ${
          from === "me"
            ? "bg-accent-500 text-brand-900"
            : "bg-brand-800 text-brand-100"
        }
      `}
            >
              {text}
            </div>
          }
        </div>
      )}
      {from === "me" && (
        <img
          src={sender?.profilePicture}
          alt="profilePicture"
          className="w-10 h-10 rounded-full ml-3 self-center"
        />
      )}
    </div>
  );
}
