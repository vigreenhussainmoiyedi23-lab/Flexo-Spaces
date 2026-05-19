// Listings.jsx
import { useEffect, useState } from "react";
import { CLOTHING_TYPES, CATEGORIES, SIZES, CONDITIONS } from "./enums.jsx";
import FiltersSidebar from "../components/ui/FilterSidebar.jsx";
import ListingHeader from "../components/ui/ListingHeader.jsx";
import ListingGrid from "../components/ui/ListingGrid.jsx";
import { useListing } from "../hooks/useListing.js";
import { Loader2, X } from "lucide-react";
import Pagination from "../../commonComponents/Pagination.jsx";
import Loader from "../../commonComponents/Loading.jsx";

const Listings = () => {
  const { fetchListings, allListings, loading, totalPages } = useListing();

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    let filter = {
      category: selectedCategory,
      types: selectedTypes,
      sizes: selectedSizes,
      conditions: selectedConditions,
      sortBy: sortBy,
      search: search,
      lat: coordinates.lat,
      lng: coordinates.lng,
      page,
    };
    fetchListings(filter);
  }, [
    sortBy,
    selectedCategory,
    selectedTypes,
    selectedSizes,
    selectedConditions,
    search,
    coordinates,
    page,
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSearch("");
    setCoordinates({ lat: null, lng: null });
  };

  const toggleArray = (arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };
  return (
    <section className="w-full pt-[10vh] min-h-screen bg-brand-900 text-white">
      {/* Filters Sidebar */}
      <div className="hidden lg:block overflow-y-auto fixed left-0 top-[10vh] w-80 h-[90dvh]">
        <FiltersSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          clearAllFilters={clearAllFilters}
          CATEGORIES={CATEGORIES}
          CLOTHING_TYPES={CLOTHING_TYPES}
          SIZES={SIZES}
          CONDITIONS={CONDITIONS}
          toggleArray={toggleArray}
          coordinates={coordinates}
          itemCount={allListings.length}
          setCoordinates={setCoordinates}
        />
      </div>
      {isMenuOpen && (
        <div className="fixed z-20 top-[10vh] left-0 w-80 h-[90dvh] lg:hidden overflow-y-auto">
          <button
            className="text-white bg-red-500 p-2 absolute top-5 right-5 flex items-center justify-center gap-3 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Close <X />
          </button>
          <FiltersSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            selectedConditions={selectedConditions}
            setSelectedConditions={setSelectedConditions}
            clearAllFilters={clearAllFilters}
            CATEGORIES={CATEGORIES}
            CLOTHING_TYPES={CLOTHING_TYPES}
            SIZES={SIZES}
            itemCount={allListings.length}
            CONDITIONS={CONDITIONS}
            toggleArray={toggleArray}
            sortBy={sortBy}
            setSortBy={setSortBy}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </div>
      )}
      {/* Main Content Area */}
      <div className="relative lg:ml-80 min-h-[90dvh] bg-brand-900">
        <ListingHeader
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
          itemCount={allListings.length}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {!loading && <ListingGrid listings={allListings} />}
        {loading && <Loader />}
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Number(totalPages)}
        />
      </div>
    </section>
  );
};

export default Listings;
