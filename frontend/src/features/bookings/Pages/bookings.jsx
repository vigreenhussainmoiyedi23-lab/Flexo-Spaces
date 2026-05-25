import React, { useEffect, useState } from "react";
import SwapCard from "../components/SwapCard";
import SwapFilters from "../components/SwapFilters";
import useSwap from "../hooks/useSwap";
import useAuth from "../../auth/hooks/useAuth";
import { FilterIcon, MenuSquare, X } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../commonComponents/Pagination";
import Loader from "../../commonComponents/Loading";
import BookingWizard from "../components/BookingWizard";

const Swaps = () => {
  let typeConditions = {
    incoming: {
      type: "received",
      status: "pending",
    },
    sent: {
      type: "sent",
      status: "pending",
    },
    active: {
      type: "all",
      status: "accepted",
    },
    declined: {
      type: "all",
      status: ["rejected", "cancelled"],
    },
    completed: {
      type: "all",
      status: "completed",
    },
    all: {
      type: "all",
      status: "all",
    },
  };
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { userAllSwaps, loading, getSwapRequests, totalPages } = useSwap();
  const [shipment_type, setShipment_type] = useState("all");
  const [page, setPage] = useState(1);

  shipment_type;
  useEffect(() => {
    const second = async () => {
      const filters = {
        status: typeConditions[activeFilter].status,
        type: typeConditions[activeFilter].type,
        shipment_type,
        limit: 10,
        page: page,
      };
      await getSwapRequests({ filters });
    };
    second();
  }, [activeFilter, shipment_type, page]);

  return (
    <div className="w-full min-h-screen bg-brand-900 relative pt-[12vh]">
      <BookingWizard />
    </div>
  );
};

export default Swaps;
