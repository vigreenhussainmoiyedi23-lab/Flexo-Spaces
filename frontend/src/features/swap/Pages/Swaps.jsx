import React, { useEffect, useState } from "react";
import SwapCard from "../components/SwapCard";
import SwapFilters from "../components/SwapFilters";
import useSwap from "../hooks/useSwap";
import useAuth from "../../auth/hooks/useAuth";
import { FilterIcon, MenuSquare, X } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../commonComponents/Pagination";
import Loader from "../../commonComponents/Loading";

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
      <div className="fixed hidden lg:flex top-[10vh] left-0 w-80">
        <SwapFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          shipment_type={shipment_type}
          setShipment_type={setShipment_type}
        />
      </div>
      {showFilter && (
        <div className="fixed transition-all duration-300 ease-in-out top-[10vh] z-10 left-0 w-80 ">
          {showFilter && (
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="absolute top-5 right-5  flex lg:hidden items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg"
            >
              Close <X />
            </button>
          )}
          <SwapFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            shipment_type={shipment_type}
            setShipment_type={setShipment_type}
          />
        </div>
      )}
      <div className="flex flex-col relative gap-4 px-3 py-2  lg:ml-80">
        {!showFilter && (
          <div className="fixed z-10 top-[12vh] w-fit h-20 right-0">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex lg:hidden items-center gap-2 bg-accent-500 text-brand-900 px-3 py-2 rounded-lg"
            >
              Filters <FilterIcon />
            </button>
          </div>
        )}
        {userAllSwaps &&
          userAllSwaps.swaps.map((swap) => {
            return <SwapCard swap={swap} />;
          })}
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        {userAllSwaps && userAllSwaps.swaps.length === 0 && (
          <div className="bg-brand-900 min-h-screen w-full  flex-col flex items-center justify-center text-white">
            <h3 className="text-accent-500 text-5xl lg:text-6xl xl:text-7xl mb-2 playfair font-bold underline  decoration-brand-300">
              No Swaps Found
            </h3>
            <p className="text-sm montserrat text-gray-200 md:text-base lg:text-lg mb-7 ">
              Try clearing some filters
              <br />
              Or create a new swap
            </p>
            <Link
              to="/listings"
              className="bg-accent-500 text-brand-900 font-bold source-code-pro text-xl lg:text-2xl px-4 py-2 rounded-lg"
            >
              Go Back To Listings
            </Link>
          </div>
        )}
      </div>
      {(loading || !userAllSwaps) && <Loader />}
    </div>
  );
};

export default Swaps;
