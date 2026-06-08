import { ShirtIcon, Handshake, MessageCircle, Plus, User2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footbar = ({ user }) => {
  return (
    <div className="w-full max-h-16 fixed lg:hidden text-white px-6  flex items-center justify-between   bottom-0  sm:h-20  bg-text-primary border-t border-white/20 ">

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
