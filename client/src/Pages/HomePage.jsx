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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page";
import toast from "react-hot-toast";

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
    toast.success("Loggd Out");
  };

  return (
    <AnimationWrapper className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Home Page</h1>
      <h2 className="text-2xl font-bold text-center">WELCOME TO OUR APP</h2>

      <div className="mt-8 text-center">
        <p className="text-2xl font-bold text-green-700 mb-4">
          Welcome to Home Page!
        </p>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-xl text-white bg-green-900 px-4 py-2 rounded hover:bg-green-700"
          >
            Log Out
          </button>
        ) : (
          <div className="space-x-4">
            <Link
              to="/signin"
              state={{ userType: "Admin" }}
              className="text-xl text-blue-600 hover:underline"
            >
              ADMIN
            </Link>
            <Link
              to="/signup"
              className="text-xl text-blue-600 hover:underline"
            >
              User
            </Link>
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default HomePage;
