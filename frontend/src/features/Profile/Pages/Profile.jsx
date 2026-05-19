import React, { useContext, useState } from "react";

import { AuthContext } from "../../auth/auth.context";
import MainDashboard from "../components/MainDashboard";
import { useParams } from "react-router-dom";
import { useProfile } from "../Hooks/useProfile";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const {
    fetchUserAllRatings,
    fetchUserAllListings,
    fetchUserData,
    userAllListings,
    profileUser,
    loading,
  } = useProfile();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserAllListings(id);
        await fetchUserAllRatings(id);
        await fetchUserData(id);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!profileUser)
    return (
      <div className="text-center w-full text-white bg-brand-900 h-screen flex items-center flex-col justify-center gap-4 border-accent-300 border p-2 rounded-xl">
        <h2>No User Found</h2>
        <p>
          The user you're looking for doesn't exist or may have been removed.
        </p>
        <button
          className="bg-brand-500 px-3 py-2 rounded-lg"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </button>
      </div>
    );
  const isOwner = user?._id.toString() == id;
  return (
    <section className="w-full relative h-fit  bg-brand-900 text-white">
      <div className=" pt-[12vh] lg:px-10 px-2">
        <MainDashboard
          user={profileUser}
          listings={userAllListings}
          isOwner={isOwner}
        />
      </div>
    </section>
  );
};

export default Profile;
