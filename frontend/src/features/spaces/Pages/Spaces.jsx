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
    <section className="w-full pt-[10vh] min-h-screen bg-brand-900 text-white">
      {/* Main Content Area */}
        {allSpaces.length > 0 && <ListingGrid spaces={allSpaces} />}
      <div className="relative lg:ml-80 min-h-[90dvh] bg-brand-900">
        {loading && <Loader />}
        <Pagination page={filters.page} totalPages={Number(totalPages)} />
      </div>
    </section>
  );
};

export default Listings;
