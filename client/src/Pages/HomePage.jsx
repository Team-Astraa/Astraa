import React, { useState } from "react";
import { Link } from "react-router-dom";
const HomePage = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Home Page</h1>
      <div className="space-x-4">
        <Link to={"/signIn"}>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Login
          </button>
        </Link>
        <Link to={"/signUp"}>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Signup
          </button>
        </Link>
      </div>
      {showWelcome && (
        <p className="mt-8 text-2xl font-bold text-green-700">
          Welcome to Home Page!
        </p>
      )}
    </div>
  );
};

export default HomePage;
