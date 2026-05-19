import { createContext, useState } from "react";

export const ListingContext = createContext();

export const ListingContextProvider = ({ children }) => {
  const [allListings, setAllListings] = useState([]);
  const [userAllListings, setUserAllListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  return (
    <ListingContext.Provider
      value={{
        allListings,
        setAllListings,
        userAllListings,
        setUserAllListings,
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
    </ListingContext.Provider>
  );
};
