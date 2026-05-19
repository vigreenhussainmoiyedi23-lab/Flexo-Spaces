import { Link } from "react-router-dom";
import React from "react";

const Logo = ({className}) => {
  return (
    <Link
      to={"/"}
      className={" md:scale-90 scale-70  hover:cursor-pointer  flex  items-center gap-4 "+className}
    >
      <img
        src="/svg/panel.png"
        alt="Swap Style Logo"
        className="w-10 rounded-full object-center object-cover"
      />
      <h3 className=" carattere-regular text-4xl text-white">SwapStyle</h3>
    </Link>
  );
};

export default Logo;
