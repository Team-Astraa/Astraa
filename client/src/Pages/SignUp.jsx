import React, { useState } from "react";
import FishermanForm from "../Components/SignUpForms/Fisherman";
import IndustryCollaboratorForm from "../Components/SignUpForms/IndustryCollaborators";
import ResearchCruiseForm from "../Components/SignUpForms/ResearchCruise";
import ResearchInstituteForm from "../Components/SignUpForms/ResearchInstitute";

const SignupForm = () => {
  const [email, setEmail] = useState(""); // Maintain email state
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
    setClickedButton(userType);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className=" signup-form bg-white">
      <h2>Signup Form</h2>

      {/* Email Input */}

      <div className="email-input w-[50%]   flex flex-col justify-start mx-auto">
        <label
          htmlFor="input-group-1"
          className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your Email
        </label>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </div>
          <input
            type="text"
            value={email}
            onChange={handleEmail} // Update email state
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="email@gmail.com"
          />
        </div>
      </div>

      {/* User Type Buttons */}

      <div
        className="inline-flex shadow-sm mt-6 mb-8 "
        role="group"
        style={{
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
          gap:"30px"
        }}
      >
        <button
          type="button"
          className="inline-flex rounded-md items-center px-6 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:border-black hover:border-2 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => handleUserTypeClick("fishermen")}
        >
          Fishermen
        </button>
        <button
          type="button"
          className="inline-flex rounded-md items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:border-black hover:border-2 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => handleUserTypeClick("industryCollaborators")}
        >
          Collaborators
        </button>
        <button
          type="button"
          className="inline-flex rounded-md items-center px-6 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:border-black hover:border-2 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => handleUserTypeClick("researchCruise")}
        >
          Cruisers
        </button>
        <button
          type="button"
          className="inline-flex rounded-md items-center px-8 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:border-black hover:border-2 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => handleUserTypeClick("researchInstitute")}
        >
          Institute
        </button>
      </div>

      {/* Render form based on selected user type */}
      <div className="form-rendering ">
        {selectedUserType === null && (
          <div className="text-xl text-center font-semibold">
            Please select a user type to begin the signup process.
          </div>
        )}
        {selectedUserType === "fishermen" && <FishermanForm email={email} />}
        {selectedUserType === "industryCollaborators" && (
          <IndustryCollaboratorForm email={email} />
        )}
        {selectedUserType === "researchCruise" && (
          <ResearchCruiseForm email={email} />
        )}
        {selectedUserType === "researchInstitute" && (
          <ResearchInstituteForm email={email} />
        )}
      </div>
    </div>
  );
};

export default SignupForm;
