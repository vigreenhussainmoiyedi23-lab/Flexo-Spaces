// Listings.jsx
import { useEffect, useState } from "react";
import { CLOTHING_TYPES, CATEGORIES, SIZES, CONDITIONS } from "./enums.jsx";
import FiltersSidebar from "../components/ui/FilterSidebar.jsx";
import ListingHeader from "../components/ui/ListingHeader.jsx";
import ListingGrid from "../components/ui/ListingGrid.jsx";
import { useSpace } from "../hooks/useSpace.js";
import { Loader2, X } from "lucide-react";
import Pagination from "../../commonComponents/Pagination.jsx";
import Loader from "../../commonComponents/Loading.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";

const Listings = () => {
  const { fetchSpaces, allSpaces, loading, totalPages, filters } = useSpace();

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    fetchSpaces(filters);
  }, [filters, coordinates]);

  return (
    <section className="w-full flex mt-[10vh] h-[90dvh]  text-white">
      <div className=" h-full border-r-accent-300 border-r w-80 hidden lg:block  "></div>
      <div className=" max-h-full overflow-auto w-full lg:w-[calc(100%-(80*4px))] ">
        {allSpaces.length > 0 && <ListingGrid spaces={allSpaces} />}
        {loading && <Loader />}
        {allSpaces.length === 0 && (
          <div className="text-center py-20 text-brand-500">
            {"No items match your filters. Try clearing some filters."}
          </div>
        )}
      </div>
      {/* <div className="relative lg:ml-80 min-h-[90dvh] bg-brand-900">
      </div> */}
    </section>
  );
};

export default Listings;
