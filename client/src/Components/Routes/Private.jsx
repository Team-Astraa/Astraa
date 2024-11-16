
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token"); // Fetch token
  const isAuthenticated = Boolean(token); // Check for token existence

  // Debug logs
  console.log("Token in localStorage:", token);
  console.log("isAuthenticated:", isAuthenticated);

  return isAuthenticated ? Component : <Navigate to="/signup" replace />;
};

export default PrivateRoute;
