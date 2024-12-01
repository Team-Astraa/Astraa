import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "./Animation-page";

const HomePage = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <AnimationWrapper className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Home Page</h1>
      <h1 className="text-center text-2xl font-bold">WELCOME TO OUR APP</h1>

      {showWelcome && (
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold text-green-700">
            Welcome to Home Page!
          </p>
          <div className="mt-4 space-x-4">
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
        </div>
      )}
    </AnimationWrapper>
  );
};

export default HomePage;
