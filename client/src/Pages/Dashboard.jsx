import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [fishCount, setFishCount] = useState(null);
  const [commonSpecies, setCommonSpecies] = useState(null);

  useEffect(() => {
    // Fetch the user role from localStorage
    const userInSession = localStorage.getItem("aquaUser");
    if (userInSession) {
      try {
        const { userType } = JSON.parse(userInSession);
        console.log("Fetched user type:", userType); // Debugging log
        setUserRole(userType);

        // Simulate API data fetch or initialize states
        setFishCount(120); // Replace with actual API call
        setCommonSpecies("Tuna, Salmon"); // Replace with actual API call
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/signin");
      }
    } else {
      console.warn("No user session found. Redirecting to sign-in.");
      navigate("/signin");
    }
  }, [navigate]);

  if (!userRole) {
    return <p>Loading...</p>; // Loading message while user type is fetched
  }

  if (
    !["research_cruises", "research_institute", "industry_collaborators", "admin"].includes(
      userRole
    )
  ) {
    return <p>Error: Invalid user type</p>; // Fallback for invalid user roles
  }

  return (
    <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
      {/* Header */}
      <header className="w-full">
        <Typography variant="h4" gutterBottom>
          {userRole === "research_cruises" && "Research Cruises Dashboard"}
          {userRole === "research_institute" && "Research Institute Dashboard"}
          {userRole === "industry_collaborators" && "Industry Collaborators Dashboard"}
          {userRole === "admin" && "Admin Panel"}
        </Typography>
      </header>

      {/* Conditional Rendering Based on User Role */}
      {userRole === "research_cruises" && (
        <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
          {/* Dashboard Sections */}
          <div className="w-full h-full flex flex-wrap gap-4">
            {/* First and Second Sections Side-by-Side */}
            <div className="flex w-full gap-4">
              {/* Section 1: Species Details (4 Cards) */}
              <div className="w-1/2 h-auto grid grid-cols-2 grid-rows-2 gap-4">
                <div className="h-full bg-red-500 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">
                    {fishCount ? fishCount : "Loading Count"}
                  </h2>
                  <h2 className="text-center text-white text-2xl  font-bold">
                    Species Count
                  </h2>
                </div>
                <div className="h-full bg-yellow-400 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">
                    {commonSpecies ? commonSpecies : "Loading species"}
                  </h2>
                </div>
                <div className="h-full bg-purple-300 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">Other 1</h2>
                </div>
                <div className="h-full bg-purple-200 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">Other 2</h2>
                </div>
              </div>

              {/* Section 2: Map Component */}
              <div className="w-1/2 h-auto rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textPrimary">
                  Map Component
                </Typography>
              </div>
            </div>

            {/* Third and Fourth Sections Below */}
            <div className="flex w-full gap-4">
              {/* Section 3: Linear Graph */}
              <div className="w-4/5 rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textSecondary">
                  Linear Graph
                </Typography>
              </div>

              {/* Section 4: Filter Options */}
              <div className="w-1/5 rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textSecondary">
                  Filter Options
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      {userRole === "research_institute" && (
        <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
        {/* Dashboard Sections */}
        <div className="w-full h-full flex flex-wrap gap-4">
          {/* First and Second Sections Side-by-Side */}
          <div className="flex w-full gap-4">
            {/* Section 1: Species Details (4 Cards) */}
            <div className="w-1/2 h-auto grid grid-cols-2 grid-rows-2 gap-4">
              <div className="h-full bg-red-500 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                <h2 className="text-center text-white text-2xl font-bold">
                  {fishCount ? fishCount : "Loading Count"}
                </h2>
                <h2 className="text-center text-white text-2xl  font-bold">
                  Species Count
                </h2>
              </div>
              <div className="h-full bg-yellow-400 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                <h2 className="text-center text-white text-2xl font-bold">
                  {commonSpecies ? commonSpecies : "Loading species"}
                </h2>
              </div>
              <div className="h-full bg-purple-300 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                <h2 className="text-center text-white text-2xl font-bold">Other 1</h2>
              </div>
              <div className="h-full bg-purple-200 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                <h2 className="text-center text-white text-2xl font-bold">Other 2</h2>
              </div>
            </div>

            {/* Section 2: Map Component */}
            <div className="w-1/2 h-auto rounded-xl p-3 border border-purple-500">
              <Typography variant="h6" color="textPrimary">
                Map Component
              </Typography>
            </div>
          </div>

          {/* Third and Fourth Sections Below */}
          <div className="flex w-full gap-4">
            {/* Section 3: Linear Graph */}
            <div className="w-4/5 rounded-xl p-3 border border-purple-500">
              <Typography variant="h6" color="textSecondary">
                Linear Graph
              </Typography>
            </div>

            {/* Section 4: Filter Options */}
            <div className="w-1/5 rounded-xl p-3 border border-purple-500">
              <Typography variant="h6" color="textSecondary">
                Filter Options
              </Typography>
            </div>
          </div>
        </div>
      </div>
      )}

      {userRole === "industry_collaborators" && (
        <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
         <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
          {/* Dashboard Sections */}
          <div className="w-full h-full flex flex-wrap gap-4">
            {/* First and Second Sections Side-by-Side */}
            <div className="flex w-full gap-4">
              {/* Section 1: Species Details (4 Cards) */}
              <div className="w-1/2 h-auto grid grid-cols-2 grid-rows-2 gap-4">
                <div className="h-full bg-red-500 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">
                    {fishCount ? fishCount : "Loading Count"}
                  </h2>
                  <h2 className="text-center text-white text-2xl  font-bold">
                    Species Count
                  </h2>
                </div>
                <div className="h-full bg-yellow-400 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">
                    {commonSpecies ? commonSpecies : "Loading species"}
                  </h2>
                </div>
                <div className="h-full bg-purple-300 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">Other 1</h2>
                </div>
                <div className="h-full bg-purple-200 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                  <h2 className="text-center text-white text-2xl font-bold">Other 2</h2>
                </div>
              </div>

              {/* Section 2: Map Component */}
              <div className="w-1/2 h-auto rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textPrimary">
                  Map Component
                </Typography>
              </div>
            </div>

            {/* Third and Fourth Sections Below */}
            <div className="flex w-full gap-4">
              {/* Section 3: Linear Graph */}
              <div className="w-4/5 rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textSecondary">
                  Linear Graph
                </Typography>
              </div>

              {/* Section 4: Filter Options */}
              <div className="w-1/5 rounded-xl p-3 border border-purple-500">
                <Typography variant="h6" color="textSecondary">
                  Filter Options
                </Typography>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
