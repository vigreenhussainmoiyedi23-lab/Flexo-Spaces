import { Edit, Edit2, LucideSquareArrowRightExit, Shield } from "lucide-react";
import React from "react";
import useAuth from "../../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { useProfile } from "../../Hooks/useProfile";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";

const ProfileHeader = ({ user, isOwner }) => {
  const { logoutHandler } = useAuth();
  const { loading } = useProfile();
  if (loading) return <ProfileHeaderSkeleton />;
  return (
    <div className="bg-white border md:flex-row flex-col border-black/50 rounded-2xl p-6 flex justify-between items-center">
      <div className="flex gap-4">
        <img
          src={user?.profilePicture || "https://i.pravatar.cc/150"}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div>
          <h2 className="text-xl text-text-primary font-semibold">{user?.username || "user"}</h2>
          <p className="text-text-secondary text-sm">
            {user?.email || "user@gmail.com"}
          </p>

          {user?.isBanned && (
            <p className="text-red-500 text-xl bg-yellow-300 font-bold capitalize rounded-lg px-3 py-1 w-fit mt-2">
              {"Banned"}
            </p>
          )}

          <p className="text-sm mt-2 text-gray-400">{user?.bio || "No bio"}</p>

          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 text-xs bg-brand-100 text-text-primary rounded-full">
              Fraud Score :- {user?.fraudScore}
            </span>
            {user.badge.map((badge) => (
              <span className="px-3 py-1 text-xs  bg-brand-100 text-text-primary rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="flex md:flex-col mt-5 mb:mt-0 px-4 md:px-0 md:w-fit w-full gap-3 ">
          <Link
            to={`/Editprofile`}
            className="bg-brand-500 text-white text-shadow-2xs shadow-2xs  shadow-gray-500/20  exo-2 cursor-pointer flex items-center justify-center gap-3 px-4 py-2 rounded-lg text-sm"
          >
            Edit Profile <Edit2 className="" />
          </Link>
          {!user.isGoogleAuthenticated && (
            <Link
              to={`/SecurityProfile`}
              className="border cursor-pointer flex items-center justify-center gap-3 border-white/20 px-4 py-2 rounded-lg text-sm"
            >
              Security <Shield className="text-yellow-300" />
            </Link>
          )}
          <button
            onClick={logoutHandler}
            className="border active:scale-95 cursor-pointer shadow-2xs  shadow-gray-500/10 text-white bg-red-500 flex items-center justify-center gap-3 border-white/20 px-4 py-2 rounded-lg text-sm exo-2"
          >
            Logout <LucideSquareArrowRightExit className=" " />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
