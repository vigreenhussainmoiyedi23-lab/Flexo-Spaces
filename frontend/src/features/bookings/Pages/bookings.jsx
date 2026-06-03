import React, { useEffect, useState } from "react";
import BookingWizard from "../components/BookingWizard";
import useBooking from "../hooks/useBooking";
import BookingGrid from "../components/BookingGrid";
import Loader from "../../commonComponents/Loading";

const Swaps = () => {
  // const [showFilter, setShowFilter] = useState(false);
  // const [activeFilter, setActiveFilter] = useState("all");
  // const [shipment_type, setShipment_type] = useState("all");
  // const [page, setPage] = useState(1);
  // useEffect(() => {
  //   const second = async () => {
  //     const filters = {
  //       status: typeConditions[activeFilter].status,
  //       type: typeConditions[activeFilter].type,
  //       shipment_type,
  //       limit: 10,
  //       page: page,
  //     };
  //     await getSwapRequests({ filters });
  //   };
  //   second();
  // }, [activeFilter, shipment_type, page]);

  const { userAllBookings, loading, getBookingRequests } = useBooking();
  useEffect(() => {
    getBookingRequests();
  },[]);
  if (loading) <Loader />;
  return (
    <div className="w-full min-h-screen bg-brand-100 relative pt-[12vh]">
      <BookingGrid bookings={userAllBookings  || []}/>
    </div>
  );
};

export default Swaps;
