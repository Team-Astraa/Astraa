import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimationWrapper from "./Animation-page";
import AdminUpperStrip from "../Components/AdminUpperStrip";
import UserTypeCount from "../Components/UserTypeCount";
import Logs from "../Components/Admin-user-logs";

const AdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("aquaUser");
    let userInsession = JSON.parse(user);
    if (userInsession && userInsession.userType !== "admin") {
      toast.error("You cannot access this page");
      navigate("/signin");
      return;
    }
  }, [navigate]);

  return (
    <AnimationWrapper className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Manage users and monitor activity</p>
      </div>

      {/* Admin Upper Strip */}
      <div className="mb-8">
        <AdminUpperStrip />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Logs Section */}
        <div className="flex-grow lg:w-2/3">
          <Logs />

          {/* Verify Users Button */}
          <div className="mt-6 flex justify-center">
            <button
              className="py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-950 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              onClick={() => navigate("/admin/unverify-user")}
            >
              <span className="text-xl">Verify Users</span>
            </button>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:w-1/3 space-y-6">
          {/* User Type Count */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <UserTypeCount />
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default AdminHome;
