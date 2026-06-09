import { createContext, useState } from "react";

export const OwnerDashboardContext = createContext();

export const OwnerDashboardContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topPerformer, setTopPerformer] = useState(null);
  const [trends, setTrends] = useState(null);
  return (
    <OwnerDashboardContext.Provider
      value={{
        loading,
        stats,
        topPerformer,
        trends,
        setLoading,
        setStats,
        setTopPerformer,
        setTrends,
      }}
    >
      {children}
    </OwnerDashboardContext.Provider>
  );
};
