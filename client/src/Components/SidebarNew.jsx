// //
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import astraaLogo from "../assets/astraa_logo.jpg";
// import profImage from "../assets/prof_img.png";
// import {
//   FaTachometerAlt,
//   FaCloudUploadAlt,
//   FaInfoCircle,
//   FaSignInAlt,
//   FaBars,
// } from "react-icons/fa";

// const SidebarNew = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [login, setLogin] = useState(false);
//   const [loggedUser, setLoggedUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("aquaUser");
//     if (user) {
//       const token = JSON.parse(user)?.token; // Extract token
//       if (token) {
//         try {
//           const base64Payload = token.split(".")[1]; // Get the payload part
//           const decodedPayload = JSON.parse(atob(base64Payload)); // Decode and parse JSON
//           setLoggedUser({
//             username: decodedPayload?.username || "Guest",
//             userType: decodedPayload?.userType || "N/A",
//           });
//           setLogin(true);
//         } catch (error) {
//           console.error("Failed to decode token:", error);
//         }
//       }
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("aquaUser");
//     setLogin(false);
//     setLoggedUser(null);
//     navigate("/signin");
//   };

//   const defaultNavLinks = [
//     {
//       to: "/dashboard",
//       icon: <FaTachometerAlt size={20} />,
//       label: "Dashboard",
//     },
//     {
//       to: "/data-upload",
//       icon: <FaCloudUploadAlt size={20} />,
//       label: "Upload",
//     },
//     { to: "/about", icon: <FaInfoCircle size={20} />, label: "About" },
//     { to: "/profile", icon: <FaSignInAlt size={20} />, label: "Profile" },
//   ];

//   const scientistNavLinks = [
//     {
//       to: "/dashboard",
//       icon: <FaTachometerAlt size={20} />,
//       label: "Dashboard",
//     },
//     { to: "/feed", icon: <FaCloudUploadAlt size={20} />, label: "Feed" },
//     { to: "/filter", icon: <FaCloudUploadAlt size={20} />, label: "Filter" },
//     {
//       to: "/infographics",
//       icon: <FaInfoCircle size={20} />,
//       label: "Infographics",
//     },
//     { to: "/trends", icon: <FaInfoCircle size={20} />, label: "Trends" },
//     {
//       to: "/scientist/community",
//       icon: <FaInfoCircle size={20} />,
//       label: "Community",
//     },
//     {
//       to: "/datasets",
//       icon: <FaCloudUploadAlt size={20} />,
//       label: "Datasets",
//     },
//   ];

//   const navLinks =
//     loggedUser?.userType === "scientist" ? scientistNavLinks : defaultNavLinks;

//   return (
//     <>
//       {!isOpen && (
//         <button
//           className="fixed top-5 left-4 z-50 p-2 text-white rounded-md lg:hidden"
//           onClick={() => setIsOpen(true)}
//         >
//           <FaBars size={24} />
//         </button>
//       )}

//       <div
//         className={`fixed top-0 left-0 p-5 h-full text-white flex flex-col border-[#436ec6] transform transition-transform duration-300 z-30 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 lg:w-48 w-64`}
//         style={{ backgroundColor: "#141720" }}
//       >
//         <div className="flex items-center mb-8">
//           <div className="w-12 mr-3">
//             <img
//               src={astraaLogo}
//               className="w-full rounded-full"
//               alt="astraa_logo"
//             />
//           </div>
//           <h1 className="text-3xl font-bold">Astraa</h1>
//         </div>

//         <div className="bg-white h-[1px] w-full opacity-10"></div>

//         <div className="flex items-center my-4">
//           <div className="w-10 mr-3">
//             <img
//               src={profImage}
//               className="w-full rounded-full"
//               alt="prof_img"
//             />
//           </div>
//           <div className="flex flex-col" style={{ maxWidth: "50%" }}>
//             <h1 className="text-xl font-semibold">
//               {loggedUser?.username || "Guest"}
//             </h1>
//             <p className="text-md font-large text-opacity-50">
//               {loggedUser?.userType || "N/A"}
//             </p>
//           </div>
//         </div>

//         <div className="bg-white h-[1px] w-full mb-8 opacity-10"></div>

//         <ul className="flex flex-col gap-8 w-full mx-auto">
//           {navLinks.map(({ to, icon, label }) => (
//             <li key={label}>
//               <Link
//                 to={to}
//                 className="flex gap-3 text-white no-underline hover:bg-purple-500 p-2 rounded-lg"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <div>{icon}</div>
//                 <span className="text-sm">{label}</span>
//               </Link>
//             </li>
//           ))}

//           {login && (
//             <li>
//               <button
//                 className="py-1 px-3 rounded-md bg-red-600 font-bold text-lg hover:bg-red-700 w-full flex items-center"
//                 onClick={logout}
//               >
//                 <FaSignInAlt />
//                 <span className="ml-2">Sign Out</span>
//               </button>
//             </li>
//           )}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default SidebarNew;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import astraaLogo from "../assets/astraa_logo.jpg";
import profImage from "../assets/prof_img.png";
import {
  FaTachometerAlt,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";

const SidebarNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("aquaUser");
    if (user) {
      const token = JSON.parse(user)?.token; // Extract token
      if (token) {
        try {
          const base64Payload = token.split(".")[1]; // Get the payload part
          const decodedPayload = JSON.parse(atob(base64Payload)); // Decode and parse JSON
          setLoggedUser({
            username: decodedPayload?.username || "Guest",
            userType: decodedPayload?.userType || "N/A",
          });
          setLogin(true);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("aquaUser");
    setLogin(false);
    setLoggedUser(null);
    navigate("/signin");
  };

  const defaultNavLinks = [
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={20} />,
      label: "Dashboard",
    },
    {
      to: "/data-upload",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Upload",
    },
    { to: "/about", icon: <FaInfoCircle size={20} />, label: "About" },
    { to: "/profile", icon: <FaSignInAlt size={20} />, label: "Profile" },
  ];

  const scientistNavLinks = [
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={20} />,
      label: "Dashboard",
    },
    { to: "/feed", icon: <FaCloudUploadAlt size={20} />, label: "Feed" },
    { to: "/filter", icon: <FaCloudUploadAlt size={20} />, label: "Filter" },
    {
      to: "/infographics",
      icon: <FaInfoCircle size={20} />,
      label: "Infographics",
    },
    { to: "/trends", icon: <FaInfoCircle size={20} />, label: "Trends" },
    {
      to: "/scientist/community",
      icon: <FaInfoCircle size={20} />,
      label: "Community",
    },
    {
      to: "/datasets",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Datasets",
    },
  ];

  const navLinks =
    loggedUser?.userType === "scientist" ? scientistNavLinks : defaultNavLinks;

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
        className={`fixed top-0 left-0 p-5 h-full text-white flex flex-col border-[#436ec6] transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-48 w-64`}
        style={{ backgroundColor: "#141720" }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 mr-3">
            <img
              src={astraaLogo}
              className="w-full rounded-full"
              alt="astraa_logo"
            />
          </div>
          <h1 className="text-3xl font-bold">Astraa</h1>
        </div>

        <div className="bg-white h-[1px] w-full opacity-10"></div>

        <div className="flex items-center my-4">
          <div className="w-10 mr-3">
            <img
              src={profImage}
              className="w-full rounded-full"
              alt="prof_img"
            />
          </div>
          <div className="flex flex-col" style={{ maxWidth: "50%" }}>
            <h1 className="text-xl font-semibold">
              {loggedUser?.username || "Guest"}
            </h1>
            <p className="text-md font-large text-opacity-50">
              {loggedUser?.userType || "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white h-[1px] w-full mb-8 opacity-10"></div>

        <ul className="flex flex-col gap-8 w-full mx-auto">
          {navLinks.map(({ to, icon, label }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex gap-3 text-white no-underline hover:bg-purple-500 p-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <div>{icon}</div>
                <span className="text-sm">{label}</span>
              </Link>
            </li>
          ))}

          {login && (
            <li>
              <button
                className="py-1 px-3 rounded-md bg-red-600 font-bold text-lg hover:bg-red-700 w-full flex items-center"
                onClick={logout}
              >
                <FaSignInAlt />
                <span className="ml-2">Sign Out</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SidebarNew;
