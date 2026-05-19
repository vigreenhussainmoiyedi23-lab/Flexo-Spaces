import { useEffect } from "react";
import Button from "../components/Button";
import useAdmin from "../hooks/useAdmin";

export default function Listings() {
  const {
    GetAllListingsHandler,
    listings,
    loading,
    RemoveOrRestoreListingHandler,
  } = useAdmin();
  useEffect(() => {
    GetAllListingsHandler();
  }, []);
  
  if (loading)
    return (
      <div className="bg-brand-900 text-5xl flex items-center justify-center animate-pulse min-h-screen w-full text-white ">
        loading...
      </div>
    );
  return (
    <div>
      <h1 className="playfair text-3xl mb-6">Listings</h1>

      <div className="bg-brand-800 flex flex-col gap-4  p-4 rounded text-black">
        {listings.map((list) => (
          <div
            key={list.id}
            className="flex bg-accent-500 rounded-lg justify-between p-3 border-b"
          >
            <div className="flex gap-3">
              <img
                src={list.images[0].url}
                alt="listingImage"
                className="w-20 h-20 "
              />
              <div className="flex flex-col">
                <p className="montserrat text-xl">{list.title}</p>
                <p className="montserrat text-sm">{list.description}</p>
                <div className="flex gap-2 montserrat">
                  <p className="text-xs bg-brand-900 text-white rounded-full px-3 py-1">
                    {list.category}
                  </p>
                  <p className="text-xs bg-brand-900 text-white rounded-full px-3 py-1">
                    {list.size}
                  </p>
                  <p className="text-xs bg-brand-900 text-white rounded-full px-3 py-1">
                    {list.brandName}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                RemoveOrRestoreListingHandler(list._id);
              }}
              variant={list.isRemoved ? "secondary" : "danger"}
            >
              {list.isRemoved ? "Restore" : "Remove"}
            </Button>
          </div>
        ))}
        {listings.length == 0 && <p className="text-white">No Listings found.</p>}

      </div>
    </div>
  );
}
