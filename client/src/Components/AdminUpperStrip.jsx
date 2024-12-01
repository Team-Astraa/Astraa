import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminUpperStrip = () => {
  const [speciesCount, setSpeciesCount] = useState(0); // To store the count
  const [loading, setLoading] = useState(true); // To control the loader visibility
  const [currentCount, setCurrentCount] = useState(0); // To animate the count

  useEffect(() => {
    fetchSpeciesCount();
  }, []);

  const fetchSpeciesCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/get-unique-fish-count"
      );
      if (response.data.success) {
        setSpeciesCount(response.data.uniqueSpeciesCount); // Set the total species count
        setLoading(false); // Hide the loader after data comes
      }
    } catch (error) {
      console.error("Error fetching species count:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        if (currentCount < speciesCount) {
          setCurrentCount((prevCount) => prevCount + 1);
        } else {
          clearInterval(interval); // Stop once the count reaches the species count
        }
      }, 10); // Adjust speed of increment
      return () => clearInterval(interval);
    }
  }, [loading, speciesCount, currentCount]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Unique Species Box */}
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg text-center">
        {loading ? (
          <div className="text-lg font-semibold text-gray-200">Loading...</div>
        ) : (
          <>
            <h3 className="text-xl font-semiboldmb-2">Total Unique Species</h3>
            <div className="text-4xl font-bold">{currentCount}</div>
          </>
        )}
      </div>

      {/* Dummy Box for New Datasets */}
      <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semiboldmb-2">New Datasets</h3>
        <div className="text-4xl font-bold">56</div>
      </div>

      {/* Dummy Box for Active Users */}
      <div className="bg-pink-500 text-white p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semiboldmb-2">Active Users</h3>
        <div className="text-4xl font-bold">89</div>
      </div>

      {/* Dummy Box for System Health */}
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semiboldmb-2">System Health</h3>
        <div className="text-4xl font-bold">Good</div>
      </div>
    </div>
  );
};

export default AdminUpperStrip;
