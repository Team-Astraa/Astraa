import React, { useState } from "react";
import FishermanForm from "../Components/SignUpForms/Fisherman";
import ResearchCruiseForm from "../Components/SignUpForms/ResearchCruise";
import ResearchInstituteForm from "../Components/SignUpForms/ResearchInstitute";
import IndustryCollaboratorForm from "../Components/SignUpForms/IndustryCollaborators";
const SignupformT = () => {
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
    <div className="h-screen flex bg-blue-200">
      <div className="relative w-full lg:w-[35%] h-1/4 lg:h-full  lg:rounded-r-3xl bg-blue-950 flex flex-col justify-center items-center gap-3">
        <h1 className="text-4xl text-start text-white font-bold absolute top-10">
          SIGN UP?
        </h1>
        <p className="w-1/2  text-base text-white font-thin">
          Enter Your personal Details and Start Your journey
        </p>
        <div className="email-input w-[50%]   flex flex-col justify-start mx-auto ">
          <label
            htmlFor="input-group-1"
            className="block text-xl mb-2 font-semibold text-white text-start dark:text-white"
          >
            Your Email?
          </label>

          <div className="relative mb-6 ">
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
              className="bg-transparent  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-orange-400"
              placeholder="email@gmail.com"
            />
          </div>
        </div>

        {/* <div
          className="inline-flex rounded-md shadow-sm mt-6 mb-8"
          role="group"
        >
          <button
            type="button"
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => handleUserTypeClick("fishermen")}
          >
            Fishermen
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => handleUserTypeClick("industryCollaborators")}
          >
            Collaborators
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => handleUserTypeClick("researchCruise")}
          >
            Cruisers
          </button>
          <button
            type="button"
            className="inline-flex items-center px-8 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => handleUserTypeClick("researchInstitute")}
          >
            Institute
          </button>
        </div> */}

        <h4 className="text-base  mr-20 font-thin text-orange-400">
          Select Type of User?
        </h4>
        <button
          className="w-1/2 text-lg px-3 py-2 bg-transparent border-2 border-orange-400 rounded-full text-white"
          onClick={() => handleUserTypeClick("fishermen")}
        >
          Fishermen
        </button>
        <button
          className="w-1/2 text-lg px-3 py-2 bg-transparent border-2 border-orange-400 rounded-full text-white"
          onClick={() => handleUserTypeClick("industryCollaborators")}
        >
          Industry Collaborators
        </button>
        <button
          className="w-1/2 text-lg px-3 py-2 bg-transparent border-2 border-orange-400 rounded-full text-white"
          onClick={() => handleUserTypeClick("researchCruise")}
        >
          Research Cruise
        </button>
        <button
          className="w-1/2 text-lg px-3 py-2 bg-transparent border-2 border-orange-400 rounded-full text-white"
          onClick={() => handleUserTypeClick("researchInstitute")}
        >
          Research Institute
        </button>

        {/* 
        <div className="absolute bottom-5 w-[70%] flex  justify-center  gap-2">
          <p>Already Have an Account?</p>
          <button className="w-1/2 px-2 text-lg py-2 bg-transparent border-2 border-orange-400 rounded-full text-white ">Sign In</button>
        </div> */}
      </div>

      <div className="w-[65%] flex justify-center items-center">
        <div className="form-rendering w-[80%] ">
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
    </div>
  );
};

export default SignupformT;
