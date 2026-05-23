import { createContext, useState } from "react";

export const SpaceContext = createContext();

export const SpaceContextProvider = ({ children }) => {
  const [allSpaces, setAllSpaces] = useState([]);
  const [userAllSpaces, setUserAllSpaces] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "newest",
    page: 1,
    amenities: [],
    capacity: 0,
    spaceType: "",
    pricing: {
      rate: 0,
      interval: "",
    },
  });
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
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};
