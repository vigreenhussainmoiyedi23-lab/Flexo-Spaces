import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../commonComponents/Logo";
import { Handshake, PackageCheck, UserCheck2 } from "lucide-react";
const Panel = ({ heading, paragragh }) => {
  return (
    <div className="bg-linear-to-tl relative px-5  from-brand-700 to-brand-500 w-full h-full flex items-center  justify-center">
      <Logo className={"absolute top-5 left-5"} />
      <div className="w-full px-3 flex flex-col gap-3 scale-75 md:scale-100">
        <p className="bg-white/20 w-fit text-xs lg:text-base rounded-full lg:px-3 px-2 lg:py-2 py-1  flex items-center justify-between gap-4">
          <span className=" h-4 w-4  rounded-full bg-brand-500 animate-pulse flex items-center justify-center">
            <span className=" block h-3 w-3 bg-sec rounded-full "></span>
          </span>
          <span className="source-code-pro text-xs lg:text-sm">Free Forever</span>
        </p>
        <h1 className="lg:text-4xl text-3xl xl:text-5xl mt-2 playfair font-semibold">{heading}</h1>
        <p className="text-gray-400 pr-[calc(15%)] lg:text-sm xl:text-md text-xs montserrat mb-10">{paragragh} </p>
        <div className="source-code-pro text-gray-400 text-xs lg:text-sm flex flex-col gap-2 items-start ">
          <p className=" bg-black/5 flex items-center justify-center gap-2 w-fit rounded-full lg:p-1.5 p-1  mb-2">
            <Handshake className="w-8 " />
            <span className="text-sec2/60">100+</span> Swaps Done
          </p>
          <p className=" bg-black/5 flex items-center justify-center gap-2 w-fit rounded-full lg:p-1.5 p-1  mb-2">
            <UserCheck2 className="w-8 " />
            <span className="text-sec2/60">50+</span> active users
          </p>
          <p className=" bg-black/5 flex items-center justify-center gap-2 w-fit rounded-full lg:p-1.5 p-1  mb-2">
            <PackageCheck className="w-8 " />
            <span className="text-sec2/60">200+</span> Listings
          </p>
  
        </div>
      </div>
      <div className="absolute bottom-10 left-10">
        <p className="text-gray-300 source-code-pro text-xs lg:text-sm ">© 2026 SwapStyle All rights reserved.</p>
      </div>
    </div>
  );
};

export default Panel;
