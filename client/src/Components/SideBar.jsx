// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import astraaLogo from "../assets/astraa_logo.jpg";

// import {
//   FaTachometerAlt,
//   FaBell,
//   FaHome,
//   FaPhoneAlt,
//   FaSignInAlt,
//   FaInfoCircle,
//   FaCloudUploadAlt,
//   FaBars,
// } from "react-icons/fa";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [login, setLogin] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("aquaUser");
//   if (token.token) {
//     setLogin(true);
//   }
//   const [loggedUser, setLoggedUser] = useState("");

//   const navLinks = [
//     {
//       to: "/data-upload",
//       icon: <FaCloudUploadAlt size={30} />,
//       label: "Home",
//       key: "home",
//     },
//     {
//       to: "/dashboard",
//       icon: <FaBell size={30} />,
//       label: "Bell",
//       key: "notifications",
//     },
//     {
//       to: "/dashboard",
//       icon: <FaTachometerAlt size={30} />,
//       label: "Dashboard",
//       key: "dashboard",
//     },
//     {
//       to: "/dashboard",
//       icon: <FaPhoneAlt size={30} />,
//       label: "Contact",
//       key: "contact",
//     },
//     {
//       to: "/signup",
//       icon: <FaSignInAlt size={30} />,
//       label: "Login",
//       key: "login",
//     },
//     {
//       to: "/dashboard",
//       icon: <FaInfoCircle size={30} />,
//       label: "About",
//       key: "about",
//     },
//   ];

//   const handleLinkClick = (to) => {
//     navigate(to);
//     setIsOpen(false); // Close sidebar
//   };

//   useEffect(() => {
//     let user = localStorage.getItem("aquaUser");
//     if (user) {
//       setLoggedUser(JSON.parse(user));
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("aquaUser");
//     setLoggedUser(null); // Clear loggedUser state
//     navigate("/signin");
//   };

//   return (
//     <>
//       {/* Toggle Button */}
//       {!isOpen && (
//         <button
//           className="fixed top-5 left-4 z-50 p-2 text-white rounded-md lg:hidden"
//           onClick={() => setIsOpen(true)}
//         >
//           <FaBars size={24} />
//         </button>
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed mt-20 lg:mt-0 top-0 left-0 h-full text-white flex flex-col items-center p-5 border-[#436ec6] transform transition-transform duration-300 z-30 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 lg:w-48 w-64`}
//         style={{
//           backgroundImage: "url(../../public/nav_bg.jpg)",
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "right",
//         }}
//       >
//         <div className="w-24">
//           <img
//             src={astraaLogo}
//             className="w-full rounded-full"
//             alt="astraa_logo"
//           />
//         </div>
//         {/* Profile Section */}
//         <div className="flex flex-col items-center mt-4 mb-14">
//           {/* <div className="w-20 h-20 bg-white rounded-full mb-4"></div> */}
//           <h1 className="text-lg font-bold">
//             {loggedUser && loggedUser.userType}
//           </h1>
//         </div>

//         {/* Navigation Links */}
//         <ul className="flex flex-col items-center gap-12 w-full">
//           {navLinks.map(({ to, icon, label, key }) => (
//             <li key={key} className="relative group">
//               <Link
//                 to={to}
//                 className="flex items-center gap-3 text-white no-underline transition-transform duration-800 group-hover:translate-x-[-20px]"
//                 onClick={() => handleLinkClick(to)}
//               >
//                 <div className="relative z-10">{icon}</div>
//                 <span className="absolute left-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity text-sm">
//                   {label}
//                 </span>
//               </Link>
//             </li>
//           ))}
//           <li>
//             {loggedUser && (
//               <button
//                 className="border-none py-3 px-5 rounded-md bg-green-600 font-bold text-lg hover:bg-green-700"
//                 onClick={logout}
//               >
//                 Sign Out
//               </button>
//             )}
//           </li>
//         </ul>
//       </div>

//       {/* Content Wrapper */}
//       <div
//         className={`transition-all duration-300 ${
//           isOpen ? "lg:ml-0 fixed overflow-hidden" : "relative"
//         } lg:relative`}
//       ></div>
//     </>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import astraaLogo from "../assets/astraa_logo.jpg";

import {
  FaTachometerAlt,
  FaBell,
  FaHome,
  FaPhoneAlt,
  FaSignInAlt,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("aquaUser");
    if (user) {
      setLogin(true);
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("aquaUser");
    setLogin(false); // Reset login state
    setLoggedUser(null); // Clear loggedUser state
    navigate("/signin");
  };

  const navLinks = [
    {
      to: "/data-upload",
      icon: <FaCloudUploadAlt size={30} />,
      label: "Home",
      key: "home",
    },
    {
      to: "/dashboard",
      icon: <FaBell size={30} />,
      label: "Bell",
      key: "notifications",
    },
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={30} />,
      label: "Dashboard",
      key: "dashboard",
    },
    {
      to: "/dashboard",
      icon: <FaPhoneAlt size={30} />,
      label: "Contact",
      key: "contact",
    },
    {
      to: "/signup",
      icon: <FaSignInAlt size={30} />,
      label: "Login",
      key: "login",
    },
    {
      to: "/dashboard",
      icon: <FaInfoCircle size={30} />,
      label: "About",
      key: "about",
    },
  ];

  // Filter navLinks based on login state
  const filteredNavLinks = login
    ? navLinks.filter((link) => link.key !== "login")
    : navLinks;

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-5 left-4 z-50 p-2 text-white rounded-md lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={24} />
        </button>
      )}

      <div
        className={`fixed mt-20 lg:mt-0 top-0 left-0 h-full text-white flex flex-col items-center p-5 border-[#436ec6] transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-48 w-64`}
        style={{
          backgroundImage: "url(../../public/nav_bg.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
        }}
      >
        <div className="w-24">
          <img
            src={astraaLogo}
            className="w-full rounded-full"
            alt="astraa_logo"
          />
        </div>

        <div className="flex flex-col items-center mt-4 mb-14">
          <h1 className="text-lg font-bold">
            {loggedUser && loggedUser.userType}
          </h1>
        </div>

        <ul className="flex flex-col items-center gap-12 w-full">
          {filteredNavLinks.map(({ to, icon, label, key }) => (
            <li key={key} className="relative group">
              <Link
                to={to}
                className="flex items-center gap-3 text-white no-underline transition-transform duration-800 group-hover:translate-x-[-20px]"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative z-10">{icon}</div>
                <span className="absolute left-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity text-sm">
                  {label}
                </span>
              </Link>
            </li>
          ))}
          <li>
            {loggedUser && (
              <button
                className="border-none py-3 px-5 rounded-md bg-green-600 font-bold text-lg hover:bg-green-700"
                onClick={logout}
              >
                Sign Out
              </button>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
