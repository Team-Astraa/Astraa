// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaHourglassStart, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// // import { get } from "mongoose";

// const StatusPanel = ({ userId }) => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const user = localStorage.getItem("aquaUser");

//   // Check if the user object exists and is valid
//   if (user) {
//     const parsedUser = JSON.parse(user); // Parse the JSON string into an object
//     const userId = parsedUser.userId; // Access the userId property
//     console.log(userId); // Log or use the userId as needed
//   } else {
//     console.log("No user found in localStorage");
//   }

//   // Fetch user logs when the component mounts
//   useEffect(() => {
//     const fetchUserLogs = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/user/getUserLogs/${userId}`
//         );
//         setLogs(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch logs");
//         setLoading(false);
//       }
//     };

//     fetchUserLogs();
//   }, [userId]);

//   // Sort logs by status (pending, accepted, rejected)
//   const sortedLogs = logs.sort((a, b) => {
//     const statusOrder = { pending: 1, accepted: 2, rejected: 3 };
//     return statusOrder[a.dataStatus] - statusOrder[b.dataStatus];
//   });

//   // Function to determine icon based on status
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <FaHourglassStart className="text-yellow-500" />;
//       case "accepted":
//         return <FaCheckCircle className="text-green-500" />;
//       case "rejected":
//         return <FaTimesCircle className="text-red-500" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       {loading && <div>Loading...</div>}
//       {error && <div className="text-red-500">{error}</div>}
//       <div className="space-y-4">
//         {sortedLogs.map((log) => (
//           <div
//             key={log.dataId}
//             className="flex items-center p-4 border border-gray-300 rounded-lg shadow-sm space-x-4"
//           >
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold">{log.dataId}</h3>
//               <p className="text-sm text-gray-500">
//                 Uploaded on: {new Date(log.uploadedAt).toLocaleDateString()} at{" "}
//                 {new Date(log.uploadedAt).toLocaleTimeString()}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2">{getStatusIcon(log.dataStatus)}</span>
//               <span
//                 className={`font-semibold ${
//                   log.dataStatus === "pending"
//                     ? "text-yellow-500"
//                     : log.dataStatus === "accepted"
//                     ? "text-green-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {log.dataStatus}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StatusPanel;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHourglassStart, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StatusPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("aquaUser");

  // Retrieve userId from localStorage if user exists
  let userId = null;
  if (user) {
    const parsedUser = JSON.parse(user);
    userId = parsedUser.userId; // Access the userId property
  } else {
    console.log("No user found in localStorage");
  }

  // Fetch user logs when the component mounts
  useEffect(() => {
    const fetchUserLogs = async () => {
      if (!userId) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/user/getUserLogs/6750497185d3aac2d1b94eb0`
        );
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch logs");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserLogs();
    }
  }, [userId]);

  // Sort logs by status (pending, accepted, rejected)
  const sortedLogs = logs.sort((a, b) => {
    const statusOrder = { pending: 1, accepted: 2, rejected: 3 };
    return statusOrder[a.dataStatus] - statusOrder[b.dataStatus];
  });

  // Function to determine icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassStart className="text-yellow-500" />;
      case "accepted":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {sortedLogs.slice(0, Math.ceil(sortedLogs.length / 2)).map((log) => (
            <div
              key={log.dataId}
              className="flex items-center p-4 bg-white border border-gray-300 rounded-xl shadow-md space-x-4 hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {log.dataId}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(log.uploadedAt).toLocaleDateString()}{" "}
                  at {new Date(log.uploadedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span>{getStatusIcon(log.dataStatus)}</span>
                <span
                  className={`font-semibold ${
                    log.dataStatus === "pending"
                      ? "text-yellow-500"
                      : log.dataStatus === "accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {log.dataStatus}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          {sortedLogs.slice(Math.ceil(sortedLogs.length / 2)).map((log) => (
            <div
              key={log.dataId}
              className="flex items-center p-4 bg-white border border-gray-300 rounded-xl shadow-md space-x-4 hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {log.dataId}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(log.uploadedAt).toLocaleDateString()}{" "}
                  at {new Date(log.uploadedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span>{getStatusIcon(log.dataStatus)}</span>
                <span
                  className={`font-semibold ${
                    log.dataStatus === "pending"
                      ? "text-yellow-500"
                      : log.dataStatus === "accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {log.dataStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
