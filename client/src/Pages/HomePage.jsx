// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import AnimationWrapper from "./Animation-page";

// const HomePage = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [login, setLogin] = useState(false);
//   const user = localStorage.getItem("aquaUser");
//   if (user) {
//     setLogin(true);
//   }
//   const logout = () => {
//     localStorage.removeItem("aquaUser");
//     setLogin(false); // Reset login state
//     navigate("/");
//   };
//   return (
//     <AnimationWrapper className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8">Home Page</h1>
//       <h1 className="text-center text-2xl font-bold">WELCOME TO OUR APP</h1>

//       {showWelcome && (
//         <div className="mt-8 text-center">
//           <p className="text-2xl font-bold text-green-700">
//             Welcome to Home Page!
//           </p>
//           {!login && (
//             <div className="mt-4 space-x-4">
//               <Link
//                 to="/signin"
//                 state={{ userType: "Admin" }}
//                 className="text-xl text-blue-600 hover:underline"
//               >
//                 ADMIN
//               </Link>
//               <Link
//                 to="/signup"
//                 className="text-xl text-blue-600 hover:underline"
//               >
//                 User
//               </Link>
//             </div>
//           )}

//           {login && (
//             <button
//               onClick={logout}
//               className="text-xl text-white hover:underline bg-green-900 p-5"
//             >
//               LogOut
//             </button>
//           )}
//         </div>
//       )}
//     </AnimationWrapper>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AnimationWrapper from "./Animation-page";
// import toast from "react-hot-toast";

// const HomePage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check login status on component mount
//     const user = localStorage.getItem("aquaUser");
//     setIsLoggedIn(!!user); // Set true if user exists, otherwise false
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("aquaUser");
//     setIsLoggedIn(false); // Reset login state
//     navigate("/"); // Redirect to the home page
//     toast.success("Loggd Out");
//   };

//   return (
//     <AnimationWrapper className="home-page flex flex-col items-center justify-center h-screen bg-gray-100">

//       <h1 className="text-4xl font-bold mb-8">Home Page</h1>
//       <h2 className="text-2xl font-bold text-center">WELCOME TO OUR APP</h2>

//       <div className="mt-8 text-center">
//         <p className="text-2xl font-bold text-green-700 mb-4">
//           Welcome to Home Page!
//         </p>
//         {isLoggedIn ? (
//           <button
//             onClick={handleLogout}
//             className="text-xl text-white bg-green-900 px-4 py-2 rounded hover:bg-green-700"
//           >
//             Log Out
//           </button>
//         ) : (
//           <div className="space-x-4">
//             <Link
//               to="/signin"
//               state={{ userType: "Admin" }}
//               className="text-xl text-blue-600 hover:underline"
//             >
//               ADMIN
//             </Link>
//             <Link
//               to="/signup"
//               className="text-xl text-blue-600 hover:underline"
//             >
//               User
//             </Link>
//           </div>
//         )}
//       </div>
//     </AnimationWrapper>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import aquadb_logo from "../assets/AquaDB.png";
import sea_bg from "../assets/sea_bg.jpg";
import { Button } from "flowbite-react";


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on component mount
    const user = localStorage.getItem("aquaUser");
    setIsLoggedIn(!!user); // Set true if user exists, otherwise false
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("aquaUser");
    setIsLoggedIn(false); // Reset login state
    navigate("/"); // Redirect to the home page
    toast.success("Logged Out");
  };
return(
<AnimationWrapper className="flex text-left justify-center items-center h-screen bg-black" >
  <div className="relative w-full h-screen text-center">
  <img
      src={sea_bg}
      className="absolute w-screen h-screen z-0 opacity-50"
      alt="AquaDB"
    />
  {/* Middle: First Lottie Animation */}
  <DotLottieReact
    src="https://lottie.host/013d4466-ea7c-493a-bb8e-38b1cc6d9754/z9Sg4QJMM8.lottie"
    loop
    autoplay
    speed={0.5}
    className="absolute inset-0 w-full h-full z-1"
  />
<h1 className="text-3xl absolute top-10 left-10 font-extrabold text-white mb-4">
      ASTRAA
      </h1>
{/* Top: Logo and Text */}
<div className="absolute inset-0 flex flex-col items-center justify-center z-2">
    {/* Text Content */}
    <div className="flex flex-col gap-4 text-center w-full items-center">
      <h1 className="text-7xl font-extrabold text-white mb-4">
        Welcome to AquaDB
      </h1>
      <p className="text-lg text-white mt-2 text-center w-2/5">
        A Centralized Geo-referenced Fish Catch Database 
      </p>
    </div>

    {isLoggedIn ? (
      <div className="w-full my-10">
        <button
        variant="danger"
          onClick={handleLogout}
          className="rounded-lg h-fit border-4 px-5 font-bold text-2xl text-white"
        >
          Log Out
        </button>
      </div>
    ) : (
      <div className="w-full h-fit  flex flex-col gap-10 items-center white justify-center">
        <div className="flex gap-10 mt-10">
        <button
          variant="primary"
          onClick={() => navigate("/signin", { state: { userType: "Admin" } })}
          className="rounded-lg h-fit border-4 px-5 font-bold text-2xl text-white"
        >
          Login as Admin
        </button>
        <button
          variant="secondary"
          onClick={() => navigate("/signup")}
          className="rounded-lg h-fit border-4 px-5 font-bold text-2xl text-white"
        >
          Login as User
        </button>
        </div>
      </div>
    )}
  </div>
</div>

    </AnimationWrapper>
  );
};

export default HomePage;
