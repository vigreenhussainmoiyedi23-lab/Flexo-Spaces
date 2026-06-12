import React, { useState } from "react";
import { useSpace } from "../../hooks/useSpace";
import { Menu, Search, X } from "lucide-react";

const FilterHeader = ({ isOpen, setIsOpen }) => {
  const [search, setSearch] = useState("");
  const { updateFilters } = useSpace();
  const UpdateSearch = (e) => {
    setSearch(e.target.value);
    let timout = null;
    if (timout) {
      clearTimeout(timout);
    }
    timout = setTimeout(() => {
      updateFilters("search", e.target.value);
    }, 1000);
  };
  return (
    <div className="w-full px-5 relative flex items-center justify-between gap-3">
      <Search className="w-5 h-5 absolute left-8" />
      <input
        className="bg-text-primary pl-10 outline-0 border border-brand-200 text-brand-100 rounded-xl py-2 px-4 w-full"
        type="text"
        placeholder="Search For Spaces  "
        value={search}
        onChange={UpdateSearch}
      />
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`block lg:hidden ${isOpen?"bg-red-500":"bg-brand-200"} hover:scale-102 active:scale-90 border border-text-primary transition-all ease-in px-2 py-2 rounded-lg`}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
    </div>
  );
};

export default FilterHeader;
