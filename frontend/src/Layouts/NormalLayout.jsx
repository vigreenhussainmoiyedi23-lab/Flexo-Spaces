import React, { useContext } from "react";
import Navbar from "../features/commonComponents/Navbar";
import Footer from "../features/commonComponents/Footer";
import Footbar from "../features/commonComponents/Footbar";
import { AuthContext } from "../features/auth/auth.context";
import useAuth from "../features/auth/hooks/useAuth";

const NormalLayout = ({ children }) => {
  const {user}=useAuth()
  return (
    <section className="w-full relative">
      <Navbar user={user}/>
      {children}
      <Footer />
      {user && <Footbar user={user}/>}
    </section>
  );
};

export default NormalLayout;
