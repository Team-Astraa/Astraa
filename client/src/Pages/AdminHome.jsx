import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimationWrapper from "./Animation-page";
import AdminUpperStrip from "../Components/AdminUpperStrip";
import UserTypeCount from "../Components/UserTypeCount";
import Logs from "../Components/Admin-user-logs";
import OtherLogs from "../Components/OtherLogs";
import { Typography } from "@mui/material";
import { useState } from "react";  
import axios from "axios";


const AdminHome = () => {  
  const abundanceTable = ["Actions", "Date", "Latitude: (Float)", "Longitude: (Float)", "Depth (Integer)", "Species", "Total Weight"];
  const occurrence = abundanceTable;
  const geoTable = ["Species name", "Date", "Catch (kg)", "LANDINGNAM", "Gear type"];
  const pfzTable = ["Date", "Status", "Data Id", "Username", "Species"];

  const navigate = useNavigate();
  const [selectedTab, setselectedTab] = useState("PFZ/NON-PFZ");
  const [selectedTable, setselectedTable] = useState(pfzTable);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let user = localStorage.getItem("aquaUser");
    let userInsession = JSON.parse(user);
    if (userInsession && userInsession.userType !== "admin") {
      toast.error("You cannot access this page");
      navigate("/signin");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLogsData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/admin/get-other-log",
          {dataType: selectedTab}
        );
        setTableData(response.data.logs);
        console.log(response.data.logs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLogsData();
  }, [tableData]);
  

  const handleTab = (type) => {
    console.log(type);
    
    setselectedTab(type);
  }

  const handleTable = (table) => {
    setselectedTable(table);
  }

  const handleNavigate = (id, dataId) => {
    navigate(`/admin/unverify-fish-data/${id}/${dataId}`);
  };  

  return (
    // <AnimationWrapper className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
    //   <div className="text-center mb-12">
    //     <h1 className="text-4xl font-extrabold text-blue-800">
    //       Admin Dashboard
    //     </h1>
    //     <p className="text-gray-500 mt-2">Manage users and monitor activity</p>
    //   </div>


    //   <div className="flex flex-col lg:flex-row gap-10">
    //     <div className="flex-grow flex gap-2 lg:w-2/3">
          // <Logs />
    //       <OtherLogs />


    //     </div>
    //     <div className="mt-6 flex justify-center">
         
    //     </div>
    //     <button
    //         className="py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-950 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
    //         onClick={() => navigate("/admin/unverify-user")}
    //       >
    //         <span className="text-xl">Verify Users</span>
    //       </button>

        
    //     <div className="lg:w-1/3 space-y-6">
          
    //       <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
    //         <UserTypeCount />
    //       </div>
    //     </div>
    //   </div> 



    // </AnimationWrapper>

        <AnimationWrapper style={{ borderRadius: "2rem 0 0 2rem" }} className="h-screen bg-blue-100 py-4 px-8">

          <div>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            {/* <p className="text-gray-500 mt-2">Manage users and monitor activity</p> */}
          </div>

          <div className="mb-5">
            <AdminUpperStrip />
          </div>

          <div className="flex gap-8 justify-between">
            <div className="w-[70%]">
              
              <Typography variant="h6" gutterBottom>
                  Logs Data
              </Typography>
              <ul class="flex flex-wrap justify-between text-md font-medium text-center text-gray-500 border-b border-gray-300 dark:border-gray-700 dark:text-gray-400 w-full ">
                  <li className="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "PFZ/NON-PFZ" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("PFZ/NON-PFZ")}>PFZ/NON PFZ</button>
                  </li>
                  <li class="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "Landing-Village" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("landing-village")}>Landing Village</button>
                  </li>
                  <li class="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "GEO-REF" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("GEO-REF")}>Geo Referenced Data</button>
                  </li>
                  {/* <li class="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "abundance" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("abundance")}>Abundance</button>
                  </li> */}
                  {/* <li class="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "occurrence" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("occurrence")}>Occurrence</button>
                  </li>
                  <li class="">
                      <button className={`inline-block p-4 rounded-t-lg ${selectedTab == "other" ? "bg-blue-300 text-blue-600" : ""}`}
                      onClick={() => handleTab("other")}>Others</button>
                  </li> */}
              </ul>


              {selectedTab === "PFZ/NON-PFZ" && (
                <table className="w-full shadow-lg rounded-2xl">
                  <thead className="">
                    <tr className="bg-blue-400 text-white font-medium">
                      <th className="p-2 text-md">Fishing Date</th>
                      <th className="p-2 text-md">Status</th>
                      <th className="p-2 text-md">Data Id</th>
                      <th className="p-2 text-md">Username</th>
                      <th className="p-2 text-md">Major Species</th>
                      <th className="p-2 text-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
                        <td className="px-6 py-2">{(new Date(item.createdAt)).toLocaleString().split(",")[0]}</td>
                        <td className="px-6 py-2">{item.dataStatus}</td>
                        <td className="px-6 py-2">{item.dataId}</td>
                        <td className="px-6 py-2">{item.userId.username}</td>
                        <td className="px-6 py-2">{new Date(item.uploadTimestamp).toLocaleString()}</td>
                        <td className="px-6 py-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          onClick={() => handleNavigate(item.userId._id, item.dataId)} >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTab === "landing-village" && (
                <table className="w-full shadow-lg rounded-2xl">
                  <thead className="">
                    <tr className="bg-blue-400 text-white font-medium">
                      <th className="p-2 text-md">Fishing Date</th>
                      <th className="p-2 text-md">Status</th>
                      <th className="p-2 text-md">Data Id</th>
                      <th className="p-2 text-md">Username</th>
                      <th className="p-2 text-md">Major Species</th>
                      <th className="p-2 text-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
                        <td className="px-6 py-2">{(new Date(item.createdAt)).toLocaleString().split(",")[0]}</td>
                        <td className="px-6 py-2">{item.dataStatus}</td>
                        <td className="px-6 py-2">{item.dataId}</td>
                        <td className="px-6 py-2">{item.userId.username}</td>
                        <td className="px-6 py-2">{new Date(item.uploadTimestamp).toLocaleString()}</td>
                        <td className="px-6 py-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          onClick={() => handleNavigate(item.userId._id, item.dataId)} >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTab === "GEO-REF" && (
                <table className="w-full shadow-lg rounded-2xl">
                  <thead className="">
                    <tr className="bg-blue-400 text-white font-medium">
                      <th className="p-2 text-md">Fishing Date</th>
                      <th className="p-2 text-md">Status</th>
                      <th className="p-2 text-md">Data Id</th>
                      <th className="p-2 text-md">Username</th>
                      <th className="p-2 text-md">Major Species</th>
                      <th className="p-2 text-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
                        <td className="px-6 py-2">{(new Date(item.createdAt)).toLocaleString().split(",")[0]}</td>
                        <td className="px-6 py-2">{item.dataStatus}</td>
                        <td className="px-6 py-2">{item.dataId}</td>
                        <td className="px-6 py-2">{item.userId.username}</td>
                        <td className="px-6 py-2">{new Date(item.uploadTimestamp).toLocaleString()}</td>
                        <td className="px-6 py-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          onClick={() => handleNavigate(item.userId._id, item.dataId)} >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTab === "abundance" && (
                <table className="w-full shadow-lg rounded-2xl">
                  <thead className="">
                    <tr className="bg-blue-400 text-white font-medium">
                      <th className="p-2 text-md">Fishing Date</th>
                      <th className="p-2 text-md">Status</th>
                      <th className="p-2 text-md">Data Id</th>
                      <th className="p-2 text-md">Username</th>
                      <th className="p-2 text-md">Major Species</th>
                      <th className="p-2 text-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
                        <td className="px-6 py-2">{(new Date(item.createdAt)).toLocaleString().split(",")[0]}</td>
                        <td className="px-6 py-2">{item.dataStatus}</td>
                        <td className="px-6 py-2">{item.dataId}</td>
                        <td className="px-6 py-2">{item.userId.username}</td>
                        <td className="px-6 py-2">{new Date(item.uploadTimestamp).toLocaleString()}</td>
                        <td className="px-6 py-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          onClick={() => handleNavigate(item.userId._id, item.dataId)} >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTab === "occurrence" && (
                <table className="w-full shadow-lg rounded-2xl">
                  <thead className="">
                    <tr className="bg-blue-400 text-white font-medium">
                      <th className="p-2 text-md">Fishing Date</th>
                      <th className="p-2 text-md">Status</th>
                      <th className="p-2 text-md">Data Id</th>
                      <th className="p-2 text-md">Username</th>
                      <th className="p-2 text-md">Major Species</th>
                      <th className="p-2 text-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
                        <td className="px-6 py-2">{(new Date(item.createdAt)).toLocaleString().split(",")[0]}</td>
                        <td className="px-6 py-2">{item.dataStatus}</td>
                        <td className="px-6 py-2">{item.dataId}</td>
                        <td className="px-6 py-2">{item.userId.username}</td>
                        <td className="px-6 py-2">{new Date(item.uploadTimestamp).toLocaleString()}</td>
                        <td className="px-6 py-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          onClick={() => handleNavigate(item.userId._id, item.dataId)} >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

                <button
                  onClick={() => handleLoadMore()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-3 text-md">
                  Load more
                </button>

                <button
                  onClick={() => handleShowLess()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md ml-3 text-md"
                >
                  Show less
                </button>



              

              <div className="lg:flex-row gap-10 mt-5">
                {/* <div className="flex flex-grow gap-2 w-full">
                  <Logs />
                  
                </div> */}

                {/* <div className="mt-6 flex justify-center">
                
                </div> */}
                  {/* <button
                    className="py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-950 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    onClick={() => navigate("/admin/unverify-user")}
                    
                  >
                    <span className="text-xl">Verify Users</span>
                  </button> */}

                
                {/* <div className="lg:w-1/3 space-y-6">
                  
                  <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
                    <UserTypeCount />
                  </div>
                </div> */}
              </div>

            </div>

            <div className="w-[30%]">
          
          
              <div className="">
                <UserTypeCount />
              </div>
          
            </div>

          </div>
      </AnimationWrapper>
  );
};

export default AdminHome;
