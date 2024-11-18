import React, { useState } from "react";
import FishermanForm from "../Components/SignUpForms/Fisherman";
import ResearchCruiseForm from "../Components/SignUpForms/ResearchCruise";
import ResearchInstituteForm from "../Components/SignUpForms/ResearchInstitute";
import IndustryCollaboratorForm from "../Components/SignUpForms/IndustryCollaborators";
import { Link } from "react-router-dom";
import ScientistForm from "../Components/SignUpForms/Scientist";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-900 text-white overflow-y-auto p-8 h-screen">
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="text-5xl font-bold mb-6">Sign Up</h1>
          <p className="text-lg text-center mb-10">
            Enter your personal details to start your journey with us!
          </p>

          {/* Email Input */}
          <div className="email-input w-full lg:w-3/4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="M10.036 8.278L19.294.488A1.979 1.979 0 0018 0H2C1.405 0 .84.236.641.541L10.036 8.278z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 002 2h16a2 2 0 002-2V2.5l-8.759 7.317z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmail}
                className="w-full py-3 px-4 pl-10 rounded-lg border-none text-gray-700 bg-white shadow-lg focus:ring-4 focus:ring-blue-400 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

        {/* User Type Buttons */}
        <div className="mt-8 w-full lg:w-3/4">
          <h4 className="text-lg font-medium mb-4">Select User Type</h4>
          <div className="grid grid-cols-2 gap-4">
            {["Fishermen", "Collaborators", "Cruisers", "Institutes", "Scientist"].map(
              (type, index) => (
                <button
                  key={index}
                  className={`w-fit-content py-3 px-4 text-center rounded-lg text-white font-semibold transition-all duration-300 ${selectedUserType === type.toLowerCase()
                      ? "bg-blue-600 shadow-lg"
                      : "bg-transparent border border-white hover:bg-blue-700 hover:shadow-lg"
                    }`}
                  onClick={() => handleUserTypeClick(type.toLowerCase())}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>
          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <a
                href="/SignIn"
                className="text-blue-300 hover:text-blue-500 underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        className={`${
          selectedUserType === null ? "hidden sm:hidden lg:flex" : "flex"
        } w-full lg:w-1/2 bg-white justify-center items-center p-6`}
      >
        {selectedUserType === null ? (
          <div className="text-center text-blue-700">
            <h1 className="text-4xl font-bold mb-4">Welcome to AquaDB!</h1>
            <p className="text-lg">Please select your user type to continue.</p>
          </div>
        ) : (
          <div className="text-center">
            {selectedUserType === "fishermen" && (
              <FishermanForm email={email} />
            )}
            {selectedUserType === "collaborators" && (
              <IndustryCollaboratorForm email={email} />
            )}
            {selectedUserType === "cruisers" && (
              <ResearchCruiseForm email={email} />
            )}
            {selectedUserType === "institutes" && (
              <ResearchInstituteForm email={email} />
            )}
            {selectedUserType === "scientist" && (
              <ScientistForm email={email} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
