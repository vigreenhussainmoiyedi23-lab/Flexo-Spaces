import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../commonComponents/Logo";
import { Handshake, PackageCheck, UserCheck2 } from "lucide-react";
const Panel = ({ heading, paragragh }) => {
  return (
    <div className="bg-linear-to-tl relative px-5  bg-text-primary w-full h-full flex items-center  justify-center">
      <Logo className={"absolute top-5 left-5"} />
      <div className="w-full px-3 flex flex-col gap-3 scale-75 md:scale-100">
        <p className="bg-black/20 w-fit text-xs lg:text-base rounded-full lg:px-3 px-2 lg:py-2 py-1  flex items-center justify-between gap-4">
          <span className=" h-4 w-4  rounded-full bg-brand-500 animate-pulse flex items-center justify-center">
            <span className=" block h-3 w-3 bg-brand-100 rounded-full "></span>
          </span>
          <span className="exo-2 text-xs lg:text-sm">Free Forever</span>
        </p>
        <h1 className="lg:text-4xl text-3xl xl:text-5xl mt-2 exo-2 font-semibold">
          {heading}
        </h1>
        <p className="text-brand-300 pr-[calc(15%)] lg:text-sm xl:text-md text-xs montserrat mb-10">
          {paragragh}{" "}
        </p>
      </div>
      <div className="absolute bottom-10 left-10">
        <p className="text-gray-300 exo-2 text-xs lg:text-sm flex items-center justify-center  ">
          © 2026 <span className="oleo-script mx-2">Flexo Spaces</span> All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Panel;
