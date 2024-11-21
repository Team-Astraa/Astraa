// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ element: Component }) => {
//   const aquaUser = localStorage.getItem("aquaUser"); // Fetch token
//   console.log("aquaUser",aquaUser);
//   let isAuthenticated;
//   if (aquaUser && aquaUser.token) {
//     isAuthenticated = Boolean(aquaUser.token);
//   }
//   // Check for token existence

//   // Debug logs
//   console.log("Token in localStorage:", token);
//   console.log("isAuthenticated:", isAuthenticated);

//   return isAuthenticated ? Component : <Navigate to="/signup" replace />;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  // Fetch and parse the stored user object
  const aquaUser = JSON.parse(localStorage.getItem("aquaUser"));

  // Check if the user is authenticated
  const isAuthenticated = aquaUser && aquaUser.token ? true : false;

  // Debug logs
  console.log("aquaUser:", aquaUser);
  console.log("Token in localStorage:", aquaUser?.token);
  console.log("isAuthenticated:", isAuthenticated);

  // Return the component or redirect to signup
  return isAuthenticated ? Component : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
