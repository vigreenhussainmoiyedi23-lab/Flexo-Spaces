import { useState } from "react";
import { createContext } from "react";

export const BookingContext = createContext();

import React from "react";

const BookingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userAllSwaps, setUserAllSwaps] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [overlappingBookings, setOverlappingBookings] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [swapAllDisputes, setSwapAllDisputes] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "all",
    type: "all",
    shipment_type: "all",
  });
  return (
    <BookingContext.Provider
      value={{
        loading,
        userAllSwaps,
        filters,
        swapAllDisputes,
        totalPages,
        availableSeats,
        overlappingBookings,
        setAvailableSeats,
        setOverlappingBookings, 
        setLoading,
        setUserAllSwaps,
        setFilters,
        setSwapAllDisputes,
        setTotalPages,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
