import React from 'react'
import logo from '../assets/navlogo.png'

const NavBar = () => {
    return (
    <div className="fixed top-0 w-full lg:w-[calc(100%-200px)] flex items-center bg-[#0f123f] h-[10vh] border-b-2 border-[#436ec677] z-40">
        {/* Title Section (Centered) */}
        <div className="flex-grow ml-14 lg:w-1/2 flex justify-center">
            <h1 className="text-2xl lg:text-3xl  font-bold text-white">
                Fish Catch Repo
            </h1>
        </div>
        {/* Logo Section */}
        <div className="sm:flex-shrink-0 lg:w-1/2 p-5 flex lg:justify-center">
            <img className="w-[100px] sm:w-[80px] lg:w-[150px] h-auto lg:p-5 sm:p-0" src={logo} alt="logo" />
        </div>
    </div>
    )
}

export default NavBar