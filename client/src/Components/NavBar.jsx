import React from "react";
import logo from "../assets/navlogo.png";

const NavBar = () => {
    return (
    <div className="flex items-center bg-[#0f123f] h-[10vh] border-b-2 border-[#436ec677] z-40">
  
        <div className="flex-grow flex items-center ml-14">
            <h1 className="text-2xl lg:text-3xl  font-bold text-white">
                Fish Catch repo
            </h1>
        </div>
        {/* Logo Section */}
        <div className="flex-shrink-flex-shrink-0 mx-4">
            <img className="w-[100px] sm:w-[80px] lg:w-[150px] h-auto lg:p-5 sm:p-0" src={logo} alt="logo" />
        </div>
    </div>
  );
};

export default NavBar;
