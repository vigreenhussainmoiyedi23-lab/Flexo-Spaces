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
import FilterHeader from "../components/ui/FilterHeader.jsx";

const Listings = () => {
  const { fetchSpaces, allSpaces, loading, totalPages, filters } = useSpace();
  const [isOpen, setIsOpen] = useState(true);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    fetchSpaces(filters);
  }, [filters, coordinates]);

  return (
    <section className="w-full flex mt-[10vh] h-[90dvh]  text-white">
      <div
        className={`
          h-full border-r-accent-300 transition-all ease-in-out duration-300 z-10 bg-text-secondary overflow-auto border-r w-80 absolute lg:relative
           ${isOpen ? "translate-x-0" : "-translate-x-full"}
           lg:translate-x-0
          `}
      >
        <FiltersSidebar />
      </div>
      <div className=" max-h-full py-4 overflow-auto w-full lg:w-[calc(100%-(80*4px))] ">
        <FilterHeader isOpen={isOpen} setIsOpen={setIsOpen} />
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
