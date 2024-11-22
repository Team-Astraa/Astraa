import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimationWrapper from "./Animation-page"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ScientistHome = () => {
  const [filters, setFilters] = useState({
    lat: '',
    long: '',
    radius: '',
    from: '',
    to: '',
    speciesName: '',
    depthMin: '',
    depthMax: '',
    sea: '',
    state: '',
    userId: '',
    verified: false,
    totalWeightMin: '',
    totalWeightMax: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      verified: !prevFilters.verified,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the request data by excluding empty fields
    const requestData = {};

    // Loop through the filters and add non-empty fields to the requestData object
    for (const [key, value] of Object.entries(filters)) {
      if (value || (typeof value === 'boolean' && value === true)) {
        if (key === 'depthMin' || key === 'depthMax') {
          // Handle depth range
          if (filters.depthMin && filters.depthMax) {
            requestData.depth = {
              min: parseFloat(filters.depthMin),
              max: parseFloat(filters.depthMax),
            };
          }
        } else if (key === 'totalWeightMin' || key === 'totalWeightMax') {
          // Handle total weight range
          if (filters.totalWeightMin && filters.totalWeightMax) {
            requestData.total_weight = {
              min: parseFloat(filters.totalWeightMin),
              max: parseFloat(filters.totalWeightMax),
            };
          }
        } else {
          // Add other fields
          requestData[key] = key.includes('lat') || key.includes('long') || key.includes('radius') 
            ? parseFloat(value) 
            : value;
        }
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/scientist/filter-data', requestData);
      console.log(response.data);
      // Handle the response (e.g., display filtered catches)
    } catch (error) {
      console.error("Error fetching filtered catches:", error);
    }
  };



  const navigate = useNavigate()
  useEffect(() => {
    let user = localStorage.getItem('aquaUser')
    let userInsession = JSON.parse(user)
    if (userInsession && userInsession.userType != 'scientist') {
      toast.error("You cannot access this page")
      navigate('/signin')
      return;

    }
  },[])
  return (
    <AnimationWrapper className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Filter Catches</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              name="lat"
              value={filters.lat}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              name="long"
              value={filters.long}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Radius (in km)</label>
            <input
              type="number"
              name="radius"
              value={filters.radius}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Species Name</label>
            <input
              type="text"
              name="speciesName"
              value={filters.speciesName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Depth Min</label>
            <input
              type="number"
              name="depthMin"
              value={filters.depthMin}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depth Max</label>
            <input
              type="number"
              name="depthMax"
              value={filters.depthMax}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sea</label>
            <input
              type="text"
              name="sea"
              value={filters.sea}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weight Min (kg)</label>
            <input
              type="number"
              name="totalWeightMin"
              value={filters.totalWeightMin}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weight Max (kg)</label>
            <input
              type="number"
              name="totalWeightMax"
              value={filters.totalWeightMax}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ScientistHome;
