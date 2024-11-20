import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBell,
  FaHome,
  FaPhoneAlt,
  FaSignInAlt,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaBars
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/data-upload', icon: <FaCloudUploadAlt size={30} />, label: 'Home', key: 'home' },
    { to: '/dashboard', icon: <FaBell size={30} />, label: 'Bell', key: 'notifications' },
    { to: '/dashboard', icon: <FaTachometerAlt size={30} />, label: 'Dashboard', key: 'dashboard' },
    { to: '/dashboard', icon: <FaPhoneAlt size={30} />, label: 'Contact', key: 'contact' },
    { to: '/signup', icon: <FaSignInAlt size={30} />, label: 'Login', key: 'login' },
    { to: '/dashboard', icon: <FaInfoCircle size={30} />, label: 'About', key: 'about' },
  ];

  const handleLinkClick = (to) => {
    navigate(to);
    setIsOpen(false); // Close sidebar
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-5 left-4 z-50 p-2 text-white rounded-md lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed mt-20 lg:mt-0 top-0 left-0 h-full bg-[#0f123f] text-white flex flex-col items-center p-5 border-r-2 border-[#436ec6] transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-48 w-64`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-10 mb-14">
          <div className="w-20 h-20 bg-white rounded-full mb-4"></div>
          <h1 className="text-lg font-bold">Farhaan</h1>
          <h4 className="text-sm font-light">Developer</h4>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col items-center gap-12 w-full">
          {navLinks.map(({ to, icon, label, key }) => (
            <li key={key} className="relative group">
              <Link
                to={to}
                className="flex items-center gap-3 text-white no-underline transition-transform duration-800 group-hover:translate-x-[-20px]"
                onClick={() => handleLinkClick(to)}
              >
                <div className="relative z-10">{icon}</div>
                <span className="absolute left-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity text-sm">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Wrapper */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? "lg:ml-0 fixed overflow-hidden" : "relative"
        } lg:relative`}
      >
      </div>
    </>
  );
};

export default Sidebar;
