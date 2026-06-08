import React, { useContext, useState } from "react";

import { AuthContext } from "../../auth/auth.context";
import { useParams } from "react-router-dom";
import { useProfile } from "../Hooks/useProfile";
import { useEffect } from "react";
import ProfileHeader from "../components/dashboard/ProfileHeader";
import Loader from "../../commonComponents/Loading";
import UserAllListings from "../components/dashboard/UserAllListings";
const Profile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const {
    fetchUserAllRatings,
    fetchUserAllListings,
    fetchUserData,
    userAllListings,
    profileUser,
  } = useProfile();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchUserAllRatings(id),
          fetchUserAllListings(id),
          fetchUserData(id),
        ]);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) return <Loader />;
  if (!profileUser && !loading)
    return (
      <div className="text-center w-full text-white bg-brand-200 h-screen flex items-center flex-col justify-center gap-4 border-accent-300 border p-2 rounded-xl">
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
    <section className="min-h-screen pt-[12dvh] md:px-5 bg-brand-100 text-text-primary">
      <ProfileHeader user={profileUser} isOwner={isOwner} />
      {userAllListings  && (
        <UserAllListings
          listings={userAllListings}
          isOwner={isOwner}
          user={user}
        />
      )}
    </section>
  );
};

export default Profile;
