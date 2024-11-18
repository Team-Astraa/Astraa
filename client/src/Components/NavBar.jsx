import React from 'react'
import logo from '../assets/navlogo.png'

const NavBar = () => {
    return (
    <div className="fixed top-0 w-full flex items-center bg-[#0f123f] justify-between h-[10vh] border-b-2 border-[#436ec677] z-50">
        {/* Title Section (Centered) */}
        <div className="flex-grow flex justify-center ml-14 lg:ml-40">
            <h1 className="text-2xl lg:text-3xl  font-bold text-white">
                Fish Catch repo
            </h1>
        </div>
        {/* Logo Section */}
        <div className="flex-shrink-0 mx-4">
            <img className="w-[100px] sm:w-[80px] lg:w-[150px] lg:p-5 sm:p-0" src={logo} alt="logo" />
        </div>
    </div>
    )
}

export default NavBar