import { ShirtIcon, Handshake, MessageCircle, Plus, User2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footbar = ({ user }) => {
  return (
    <div className="w-full max-h-16 fixed lg:hidden text-white px-6  flex items-center justify-between   bottom-0  sm:h-20  bg-brand-900 border-t border-white/20 ">
      <Link
        to="/listings"
        className="flex flex-col items-center justify-center"
      >
        <ShirtIcon className="rounded-full " />
        <span className="text-[10px] ">Listings</span>
      </Link>
      <Link to="/swaps" className="flex flex-col items-center justify-center">
        <Handshake className="rounded-full " />
        <span className="text-[10px] ">Swaps</span>
      </Link>
      <Link
        to="/createListing"
        className="h-full relative flex items-center justify-center flex-col"
      >
        <Plus className="w-full h-full" />
        <span className="text-[10px] ">Create</span>
      </Link> 
      <Link to="/chats" className="flex flex-col items-center">
        <MessageCircle />
        <span className="text-[10px] ">Chat</span>
      </Link>
      <Link
        to={`/profile/${user._id}`}
        className="flex flex-col items-center justify-center"
      >
        <img
          src={user.profilePicture}
          className="w-8 h-8 rounded-full"
          alt=""
        />
        <span className="text-[10px] ">Account</span>
      </Link>
    </div>
  );
};

export default Footbar;
