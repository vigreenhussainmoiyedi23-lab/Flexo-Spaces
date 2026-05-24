import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MyListingsOverlay from "../components/ListingMore/MyListingsOverlay";
import { AuthContext } from "../../auth/auth.context";
import { useContext } from "react";
import { useProfile } from "../../Profile/Hooks/useProfile";
import { Edit2, MapPin, Trash } from "lucide-react";
import showToast from "../../../utils/Toastify.util";
import Loader from "../../commonComponents/Loading";
import { useSpace } from "../hooks/useSpace";

const ListingMore = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { getSpaceById, deleteSpace } = useSpace();

  const navigate = useNavigate();

  const [space, setSpace] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      const data = await getSpaceById(id);
      setSpace(data.Space);
    }
    fetchListing();
  }, [id]);
  if (!space) return <Loader />;

  return (
    <div className="min-h-screen relative mt-[10vh] bg-[var(--color-brand-900)] text-white p-6">
      <div className="max-w-6xl relative mx-auto grid md:grid-cols-2 gap-8">
        {/* LEFT: IMAGES */}
        <div>
          <img
            src={space.images?.[0]?.url}
            alt={space.title}
            className="w-fit h-100 object-contain rounded-2xl"
          />

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {space.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="bg-text-primary p-6 rounded-2xl shadow-lg">
          <div className="flex-shrink-0 flex items-center justify-between text-start">
            <h1
              className="font-bold text-brand-100 text-xl sm:text-3xl leading-snug
            line-clamp-2 capitalize tracking-tight"
            >
              {space.title}
            </h1>
            <p className="text-brand-100 font-extrabold text-xl lg:text-3xl leading-none tracking-tight">
              ₹{space?.pricing?.rate} / {space?.pricing?.interval.slice(0, -2)}
            </p>
          </div>

          <p className="text-gray-300 mb-4">{space.description}</p>

          {/* Title */}

          {/* Price */}

          {/* Location */}
          <p className="flex items-center gap-1 mt-1 text-brand-100/70 text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate capitalize">
              {space.location.city}, {space.location.state}
            </span>
          </p>
          <details>
            <summary className="text-xl font-black exo-2 text-brand-100 mt-3">
              Amenities
            </summary>

            <div className="flex flex-wrap gap-2 mt-3 ">
              {space.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-1 rounded-full bg-brand-100 border border-white/10
                 text-[10px] text-text-secondary font-bold"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </details>
          {/* OWNER INFO */}
          <div className="mt-6 flex items-center gap-4 border-t border-[var(--color-brand-500)] pt-4">
            <img
              src={space.owner?.profilePicture}
              alt="owner"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{space.owner?.username}</p>
              <p className="text-xs text-gray-300">
                ⭐ {space.owner?.rating} | Swaps: {space.owner?.totalSwaps}
              </p>
            </div>
          </div>

          <CTA
            user={user}
            space={space}
            navigate={navigate}
            deleteSpace={deleteSpace}
          />
        </div>
      </div>
    </div>
  );
};

function CTA({ user, space, navigate, deleteSpace }) {
  return (
    <>
      {" "}
      {/* ACTION BUTTON */}
      {user && user?._id.toString() !== space?.owner?._id.toString() && (
        <div className="  z-10 flex-col gap-3  flex w-full mt-3 px-3 py-1 rounded-xl text-xs font-medium capitalize">
          <Link
            to={`/profile/${space?.owner?._id}`}
            className=" w-full text-center text-accent-300 shanti bg-brand-500 font-semibold source-code-pro hover:bg-brand-600 active:scale-98 transition py-2 rounded-xl text-lg"
          >
            View
            <span className="mx-2 text-bold text-text-primary">
              {space?.owner?.username}
            </span>
            Profile
          </Link>
          <Link
            to={`/createBooking/${space?._id}`}
            className=" w-full text-center text-text-primary font-bold stroke-1 stroke-accent-500 exo-2 bg-brand-100  source-code-pro hover:bg-brand-600 active:scale-98 transition py-2 rounded-xl text-lg"
          >
            Book WorkSpace
          </Link>
        </div>
      )}
      {user && user?._id.toString() === space?.owner?._id.toString() && (
        <div className=" text-black z-10 flex-col gap-3 justify-between flex w-full mt-3 px-3 py-1 rounded-xl text-xs font-medium capitalize">
          <button
            className="flex items-center bg-accent-500 rounded-2xl px-2 py-1  gap-2 justify-center"
            onClick={() =>
              (window.location.href = `/spaces/update/${space._id}`)
            }
          >
            Update <Edit2 className="w-4" />
          </button>
          <button
            onClick={async (e) => {
              let isDeleted = window.confirm(
                "Are you sure you want to delete this space?",
              );
              if (isDeleted) {
                await deleteSpace(space._id);
                navigate("/spaces");
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
          className="mt-6 w-full bg-brand-500 hover:bg-[var(--color-brand-200)] transition py-3 rounded-xl font-semibold"
        >
          Login to Book WorkSpace
        </button>
      )}
    </>
  );
}

export default ListingMore;
