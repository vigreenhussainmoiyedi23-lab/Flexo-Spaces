import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import MyListingsOverlay from "../components/ListingMore/MyListingsOverlay";
import { AuthContext } from "../../auth/auth.context";
import { useContext } from "react";
import { useProfile } from "../../Profile/Hooks/useProfile";
import { Edit2, Trash } from "lucide-react";
import showToast from "../../../utils/Toastify.util";
import Loader from "../../commonComponents/Loading";

const ListingMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, updateListing, deleteListing, createSwap } =
    useListing();
  const [listing, setlisting] = useState({});
  useEffect(() => {
    async function fetchListing() {
      const data = await getListingById(id);
      setlisting(data.listing);
    }
    fetchListing();
  }, [id]);
  if (!listing) return <Loader />;

  const [isActive, setIsActive] = useState(false);
  const [myListings, setMyListings] = useState(null);
  const { fetchUserAllListings } = useProfile();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const response = await fetchUserAllListings(user?._id);
      setMyListings(response?.listings);
    };
    fetch();
  }, [user]);
  async function createSwapHandler(offerefListingId) {
    try {
      await createSwap({
        offeredListingId: offerefListingId,
        requestedListingId: id,
      });
      navigate("/swaps");
    } catch (error) {
      showToast(error?.response?.data?.message || error.message, "error");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen relative mt-[10vh] bg-[var(--color-brand-900)] text-white p-6">
      <div className="max-w-6xl relative mx-auto grid md:grid-cols-2 gap-8">
        {/* LEFT: IMAGES */}
        <div>
          <img
            src={listing.images?.[0]?.url}
            alt={listing.title}
            className="w-fit h-100 object-contain rounded-2xl border border-[var(--color-brand-700)]"
          />

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {listing.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-[var(--color-brand-700)] cursor-pointer"
              />
            ))}
          </div>
        </div>
        {myListings && (
          <MyListingsOverlay
            listing={myListings}
            isActive={isActive}
            setIsActive={setIsActive}
            createSwapHandler={createSwapHandler}
          />
        )}
        {/* RIGHT: DETAILS */}
        <div className="bg-[var(--color-brand-700)] p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-3">{listing.title}</h1>

          <p className="text-gray-300 mb-4">{listing.description}</p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              listing.category,
              listing.clothingType,
              listing.size,
              listing.condition,
            ].map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-brand-500 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {/* DETAILS */}
          <div className="space-y-2 text-sm">
            <p>
              <strong>Brand:</strong> {listing.brandName}
            </p>
            <p>
              <strong>Estimated Value:</strong> ₹{listing.estimatedValue}
            </p>
            <p>
              <strong>Location:</strong> {listing.Location?.city},{" "}
              {listing.Location?.State}
            </p>
          </div>

          {/* OWNER INFO */}
          <div className="mt-6 flex items-center gap-4 border-t border-[var(--color-brand-500)] pt-4">
            <img
              src={listing.owner?.profilePicture}
              alt="owner"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{listing.owner?.username}</p>
              <p className="text-xs text-gray-300">
                ⭐ {listing.owner?.rating} | Swaps: {listing.owner?.totalSwaps}
              </p>
            </div>
          </div>

          {/* ACTION BUTTON */}
          {user && user?._id.toString() !== listing?.owner?._id.toString() && (
            <div className="  z-10 flex-col gap-3  flex w-full mt-3 px-3 py-1 rounded-xl text-xs font-medium capitalize">
              <Link
                to={`/profile/${listing?.owner?._id}`}
                className=" w-full text-center text-accent-300 bg-brand-500 font-semibold source-code-pro hover:bg-brand-600 active:scale-98 transition py-2 rounded-xl text-lg"
              >
                VIEW USER PROFILE
              </Link>
              {myListings &&
              myListings.filter(
                (l) => l.isAvailable && !l.isLocked && !l.isRemoved,
              ).length > 0 ? (
                <button
                  onClick={() => setIsActive(true)}
                  className="w-full text-center text-accent-500 bg-brand-900 font-semibold source-code-pro hover:bg-brand-800 active:scale-98 transition py-2 rounded-xl text-lg"
                >
                  Request Swap
                </button>
              ) : (
                <Link
                  to={"/createListing"}
                  className="w-full text-center text-accent-500 bg-brand-900 font-semibold source-code-pro hover:bg-brand-800 active:scale-98 transition py-2 rounded-xl text-lg"
                >
                  Create A Listing To Swap
                </Link>
              )}
            </div>
          )}
          {user && user?._id.toString() === listing?.owner?._id.toString() && (
            <div className=" text-black z-10 flex-col gap-3 justify-between flex w-full mt-3 px-3 py-1 rounded-xl text-xs font-medium capitalize">
              <button
                className="flex items-center bg-accent-500 rounded-2xl px-2 py-1  gap-2 justify-center"
                onClick={() =>
                  (window.location.href = `/listings/update/${id}`)
                }
              >
                Update <Edit2 className="w-4" />
              </button>
              <button
                onClick={(e) => {
                  let isDeleted = window.confirm(
                    "Are you sure you want to delete this listing?",
                  );
                  if (isDeleted) {
                    deleteListing(id);
                  }
                }}
                className="flex items-center bg-red-600 rounded-2xl px-2 py-1  gap-2 justify-center text-white "
              >
                Delete <Trash className="w-4" />
              </button>
            </div>
          )}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full bg-brand-500 hover:bg-[var(--color-brand-300)] transition py-3 rounded-xl font-semibold"
            >
              Login to Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingMore;
