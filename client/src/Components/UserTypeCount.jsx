// components/UserTypeCount.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserTypeCount = () => {
  const [userTypeData, setUserTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user type data from the API
  useEffect(() => {
    const fetchUserTypeCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/get-userType-Count');
        setUserTypeData(response.data);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypeCount();
  }, []);

  return (
    <div className="container mx-auto my-8 px-4 text-white border border-gray-600 p-4 rounded-md m-4 ">
      <h2 className="text-2xl font-semibold mb-4">User Type Count</h2>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="">
                <th className="px-6 py-3 border-b text-left text-sm font-medium ">User Type</th>
                <th className="px-6 py-3 border-b text-left text-sm font-medium ">Total Users</th>
              </tr>
            </thead>
            <tbody>
              {userTypeData.map((item) => (
                <tr key={item.userType} className="hover:bg-gray-700 ">
                  <td className="px-6 py-4 border-b text-sm ">{item.userType}</td>
                  <td className="px-6 py-4 border-b text-sm ">{item.totalUsers}</td>
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
