import React, { useState } from 'react';

const SignupForm = () => {
  const [selectedUserType, setSelectedUserType] = useState(null);  // Default is null
  const [clickedButton, setClickedButton] = useState(null);         // Keep track of clicked button

  // Handle button click to set the user type and change the button color
  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
    setClickedButton(userType);
  };

  const buttonClasses = "text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2";
  const clickedButtonClasses = "bg-black text-white"; // Temporarily set bg to black and text to white on click

  return (
    <div className="signup-form">
      <h2>Signup Form</h2>

      {/* Email Input */}
      <div className="email-input">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          className="w-full p-3 rounded-md border-2 border-gray-300"
        />
      </div>

      {/* User Type Buttons */}
      <div className="user-type-buttons flex justify-start">
        <button
          type="button"
          className={`${buttonClasses} ${clickedButton === 'fishermen' ? clickedButtonClasses : ''}`}
          onClick={() => handleUserTypeClick('fishermen')}
        >
          <svg className="w-4 h-4 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="paypal" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134..."></path>
          </svg>
          Fishermen
        </button>
        <button
          type="button"
          className={`${buttonClasses} ${clickedButton === 'industryCollaborators' ? clickedButtonClasses : ''}`}
          onClick={() => handleUserTypeClick('industryCollaborators')}
        >
          Industry Collaborators
        </button>
        <button
          type="button"
          className={`${buttonClasses} ${clickedButton === 'researchCruise' ? clickedButtonClasses : ''}`}
          onClick={() => handleUserTypeClick('researchCruise')}
        >
          Research Cruise
        </button>
        <button
          type="button"
          className={`${buttonClasses} ${clickedButton === 'researchInstitute' ? clickedButtonClasses : ''}`}
          onClick={() => handleUserTypeClick('researchInstitute')}
        >
          Research Institute
        </button>
      </div>

      {/* Render form based on selected user type */}
      <div className="form-rendering">
        {selectedUserType === null && <div>Please select a user type to begin the signup process.</div>}
        {selectedUserType === 'fishermen' && <div>Fishermen Signup Form</div>}
        {selectedUserType === 'industryCollaborators' && <div>Industry Collaborators Signup Form</div>}
        {selectedUserType === 'researchCruise' && <div>Research Cruise Signup Form</div>}
        {selectedUserType === 'researchInstitute' && <div>Research Institute Signup Form</div>}
      </div>
    </div>
  );
};

export default SignupForm;
