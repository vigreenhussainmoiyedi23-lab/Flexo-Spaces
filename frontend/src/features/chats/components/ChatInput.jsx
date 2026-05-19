import { useState, useRef, useEffect } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import { ImagePlusIcon, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useChatHttp } from "../hooks/useChatHttp";

export default function ChatInput({ chatId, socket }) {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileRef = useRef();
  const { createMessage, emitTyping, emitStopTyping } = socket;
  const { uploadImages, loading } = useChatHttp();
  const MAX_IMAGES = 5;
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitStopTyping({ chatId });
    };
  }, [chatId]);
  // 🔥 send message
  const submitHandler = async () => {
    if (!message.trim() && images.length === 0) return;

    try {
      const files = images.map((img) => img.file);
      let data;
      if (files && files.length > 0) {
        const response = await uploadImages(files);
        data = response;
      }
      await createMessage({
        chatId,
        message,
        files: data?.urls,
      });
      emitStopTyping({ chatId });
      setIsTyping(false);
      setMessage("");
      setImages([]);
    } catch (error) {
      console.log(error);
    }
  };

  // 🖼 image handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert("Max 5 images allowed");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    const previews = files
      .filter((file) => validTypes.includes(file.type))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

    setImages((prev) => [...prev, ...previews]);

    e.target.value = null; // reset input
  };

  // ❌ remove image
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 😊 emoji select
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // 🧹 cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return (
    <div className="p-3 border-t border-brand-800 bg-brand-900 relative">
      {/* 🖼 Image Preview */}
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.url}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* 😊 Emoji button */}
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="text-brand-200"
        >
          <Smile size={22} />
        </button>

        {/* 🧠 Input */}
        <input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            const value = e.target.value;
            setMessage(value);

            if (!isTyping) {
              setIsTyping(true);
              emitTyping({ chatId });
            }

            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
              emitStopTyping({ chatId });
            }, 1500);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitHandler();
          }}
          className="flex-1 p-2 rounded-lg bg-brand-800 text-brand-100 outline-none"
        />

        {/* 📎 Image Upload */}
        <button onClick={() => fileRef.current.click()}>
          <ImagePlusIcon />
        </button>

        <input
          ref={fileRef}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* 🚀 Send */}
        {!loading && (
          <button
            onClick={submitHandler}
            className="px-4 py-2 rounded-lg bg-accent-500 text-brand-900 font-semibold"
          >
            Send
          </button>
        )}
        {loading && (
          <button className="px-4 py-2 rounded-lg bg-accent-500/30 text-brand-900 font-semibold">
            Sending..
          </button>
        )}
      </div>

      {/* 😊 Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-2 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}
