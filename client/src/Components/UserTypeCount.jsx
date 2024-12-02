import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTypeCount = () => {
  const [userTypeData, setUserTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user type data from the API
  useEffect(() => {
    const fetchUserTypeCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/get-userType-Count"
        );
        setUserTypeData(response.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypeCount();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
        User Type Count 
      </h2>

      {loading ? (
        <div className="text-center text-blue-600 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-lg border-collapse border-b border">
            <thead className="bg-blue-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 border-b">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 border-b">
                  Total Users
                </th>
              </tr>
            </thead>
            <tbody>
              {userTypeData.map((item) => (
                <tr
                  key={item.userType}
                  className=" transition-all"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {item.userType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {item.totalUsers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTypeCount;
