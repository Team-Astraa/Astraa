import React, { useState } from "react";
import AnimationWrapper from "./Animation-page"
const HomePage = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  return (
    <AnimationWrapper className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Home Page</h1>
      <h1 className="text-center text-2xl font-bold ">WELCOME TO OUR APP</h1>
      {showWelcome && (
        <p className="mt-8 text-2xl font-bold text-green-700">
          Welcome to Home Page!
        </p>
      )}
    </AnimationWrapper>
  );
};

export default HomePage;
