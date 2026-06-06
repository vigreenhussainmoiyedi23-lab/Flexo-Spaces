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
    <section className="min-h-screen bg-brand-100 text-text-primary">
      <div className="pt-[12vh] lg:px-10 px-4 pb-10">
        {/* Profile Header */}
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={profileUser.profilePicture}
              alt=""
              className="w-28 h-28 rounded-full object-cover"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profileUser.username}</h1>

              <p className="text-text-muted mt-2">
                {profileUser.bio || "No bio available"}
              </p>
            </div>
          </div>
        </div>

        {isOwner ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-surface rounded-2xl p-5">
                <p>Total Spaces</p>
                <h2 className="text-3xl font-bold">12</h2>
              </div>

              <div className="bg-surface rounded-2xl p-5">
                <p>Total Bookings</p>
                <h2 className="text-3xl font-bold">84</h2>
              </div>

              <div className="bg-surface rounded-2xl p-5">
                <p>Revenue</p>
                <h2 className="text-3xl font-bold">₹56,000</h2>
              </div>

              <div className="bg-surface rounded-2xl p-5">
                <p>Pending Requests</p>
                <h2 className="text-3xl font-bold">8</h2>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2 bg-surface rounded-3xl p-6">
                Revenue Overview
              </div>

              <div className="bg-surface rounded-3xl p-6">Recent Activity</div>
            </div>
          </>
        ) : (
          <>
            {/* Public Profile */}

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Spaces</h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* {listings?.map((space) => (
                  <div
                    key={space._id}
                    className="bg-surface rounded-2xl overflow-hidden"
                  >
                    Space Card
                  </div>
                ))} */}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
