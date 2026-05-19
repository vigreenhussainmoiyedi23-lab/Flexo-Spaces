import { createContext, useState } from "react";

export const AdminContext = createContext();

function AdminContextProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsTotal, setAnalyticsTotal] = useState({});
  const [analyticsDaily, setAnalyticsDaily] = useState({});
  const [insights, setInsights] = useState("");
  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        listings,
        setListings,
        swaps,
        setSwaps,
        loading,
        setLoading,
        analyticsTotal,
        setAnalyticsTotal,
        analyticsDaily,
        setAnalyticsDaily,
        disputes,
        setDisputes,
        insights,
        setInsights,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContextProvider;
