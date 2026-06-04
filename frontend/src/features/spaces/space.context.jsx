import { createContext, useState } from "react";

export const SpaceContext = createContext();
export const SpaceContextProvider = ({ children }) => {
  const defaultFilters = {
    search: "",
    sortBy: "newest",
    page: 1,
    amenities: [],
    capacity: [0, null],
    spaceType: "all",
    pricing: {
      rate: [0, null],
      interval: "all",
    },
    lat: null,
    lng: null,
  };
  const [allSpaces, setAllSpaces] = useState([]);
  const [userAllSpaces, setUserAllSpaces] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  return (
    <SpaceContext.Provider
      value={{
        allSpaces,
        setAllSpaces,
        userAllSpaces,
        setUserAllSpaces,
        page,
        setPage,
        totalPages,
        setTotalPages,
        loading,
        setLoading,
        filters,
        setFilters,
        defaultFilters,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};
