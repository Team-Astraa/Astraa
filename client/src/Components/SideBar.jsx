import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBell,
  FaHome,
  FaPhoneAlt,
  FaSignInAlt,
  FaInfoCircle,
} from 'react-icons/fa';

const Sidebar = () => {
  const navLinks = [
    { to: '/dashboard', icon: <FaHome size={30} />, label: 'Home', key: 'home' },
    { to: '/dashboard', icon: <FaBell size={30} />, label: 'Bell', key: 'notifications' },
    { to: '/dashboard', icon: <FaTachometerAlt size={30} />, label: 'Dashboard', key: 'dashboard' },
    { to: '/dashboard', icon: <FaPhoneAlt size={30} />, label: 'Contact', key: 'contact' },
    { to: '/signup', icon: <FaSignInAlt size={30} />, label: 'Login', key: 'login' },
    { to: '/dashboard', icon: <FaInfoCircle size={30} />, label: 'About', key: 'about' },
  ];

  return (
    <div className="w-[200px] h-screen fixed bg-[#0f123f] text-white p-5 flex flex-col items-center border-r-2 border-[#436ec677]">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-white rounded-full h-20 w-20 mb-4"></div>
        <h1 className="font-bold text-lg">Farhaan</h1>
        <h4 className="font-thin text-sm">Developer</h4>
      </div>

      <ul className="flex flex-col items-center gap-12 mt-8">
        {navLinks.map(({ to, icon, label, key }) => (
          <li
            key={key}
            className="relative group"
          >
            <Link
              to={to}
              className="flex items-center gap-3 text-white no-underline transition-transform group-hover:translate-x-[-20px]"
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
  );
};

export default Sidebar;
