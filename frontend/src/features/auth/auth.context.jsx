import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user");
  return (
    <AuthContext.Provider
      value={{ user, role, loading, setRole, setUser, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
