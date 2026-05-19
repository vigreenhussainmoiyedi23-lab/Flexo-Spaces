import Navbar from "../features/commonComponents/Navbar";

import useAuth from "../features/auth/hooks/useAuth";
import { Link } from "react-router-dom";

const ProtectedLayoutWithNoFooter = ({ children }) => {
  const { user, loading } = useAuth();
  if (!user && !loading)
    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-brand-900 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white playfair">
          You need to be logged in
        </h1>
        <Link
          to="/login"
          className="mt-10 bg-brand-500 px-4 py-2 rounded-lg text-white source-code-pro"
        >
          Login Now
        </Link>
        <Link
          to="/register"
          className="mt-10 bg-brand-500 px-4 py-2 rounded-lg text-white source-code-pro"
        >
          Join For Free
        </Link>
      </div>
    );
  if (loading) {
    return (
      <div className="bg-brand-900 text-5xl flex items-center justify-center animate-pulse min-h-screen w-full text-white ">
        loading...
      </div>
    );
  }
  return (
    <section className="w-full relative">
      <Navbar user={user} />
      {children}
    </section>
  );
};

export default ProtectedLayoutWithNoFooter;
