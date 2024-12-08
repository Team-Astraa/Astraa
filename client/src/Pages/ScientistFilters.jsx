import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import { Button } from "flowbite-react";

const FilterForm = () => {
  const [filters, setFilters] = useState({
    lat: "",
    long: "",
    radius: "",
    from: "",
    to: "",
    speciesName: "",
    depthMin: "",
    depthMax: "",
    sea: "",
    state: "",
    userId: "",
    verified: false,
    totalWeightMin: "",
    totalWeightMax: "",
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // To store the fetched data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };


  let getdataType = (type) => {
    setLoading(true);
    setFilters({...filters, dataType: type});
    submit()

  
  };
  
  let getzoneType = (type) => {
    setLoading(true);
    setFilters({...filters, zoneType: type});
    submit()
  };
  
  

  const submit = async (e) => {
  
    const requestData = {};
  
    // Filter out empty fields and handle depth and weight ranges
    for (const [key, value] of Object.entries(filters)) {
      // Check if value is not empty, false, or undefined (handling boolean and empty string)
      if (
        (value !== "" && value !== false && value !== undefined) ||
        (typeof value === "boolean" && value === false) ||
        (key === "verified" && value === false) // Include verified even if false
      ) {
        if (key === "depthMin" || key === "depthMax") {
          if (filters.depthMin && filters.depthMax) {
            requestData.depth = {
              min: parseFloat(filters.depthMin),
              max: parseFloat(filters.depthMax),
            };
          }
        } else if (key === "totalWeightMin" || key === "totalWeightMax") {
          if (filters.totalWeightMin && filters.totalWeightMax) {
            requestData.total_weight = {
              min: parseFloat(filters.totalWeightMin),
              max: parseFloat(filters.totalWeightMax),
            };
          }
        } else {
          requestData[key] =
            key.includes("lat") ||
            key.includes("long") ||
            key.includes("radius")
              ? parseFloat(value)
              : value;
        }
      }
    }
  
    console.log(requestData);
  
    setLoading(true); // Show loader while fetching data
    try {
      const response = await axios.post(
        "http://localhost:5000/scientist/filter-data", // Replace with your actual API endpoint
        requestData
      );
      setData(response.data); // Store the fetched data
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white text-black" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}>
      <div className="v shadow-md p-4 flex gap-4 items-center justify-center ">
        <Button onClick={()=>getdataType('abundance')}>
          Abundance
        </Button>
        <Button onClick={()=>getdataType('occurence')}>
          Accurance
        </Button>
        <Button onClick={()=>getzoneType('PFZ')}>
          PFZ
        </Button>
        <Button onClick={()=>getzoneType('NON_PFZ')}>
          NON_PFZ
        </Button>

      </div>
      <div className="h-auto rounded-lg shadow-md p-4 flex flex-col">
        <h6 className="text-black">Filters</h6>
        <div  className="flex flex-col justify-between h-full mt-2">
          {/* Compact Fields */}
          <div className="grid grid-cols-4 gap-4 text-black">
            {/* Latitude */}
            <div>
              <label className="text-sm font-medium">Latitude</label>
              <input
                type="number"
                name="lat"
                value={filters.lat}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Longitude */}
            <div>
              <label className="text-sm font-medium">Longitude</label>
              <input
                type="number"
                name="long"
                value={filters.long}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Radius */}
            <div>
              <label className="text-sm font-medium">Radius (km)</label>
              <input
                type="number"
                name="radius"
                value={filters.radius}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Species Name */}
            <div>
              <label className="text-sm font-medium">Species Name</label>
              <input
                type="text"
                name="speciesName"
                value={filters.speciesName}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Depth Min */}
            <div>
              <label className="text-sm font-medium">Depth Min</label>
              <input
                type="number"
                name="depthMin"
                value={filters.depthMin}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Depth Max */}
            <div>
              <label className="text-sm font-medium">Depth Max</label>
              <input
                type="number"
                name="depthMax"
                value={filters.depthMax}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* From Date */}
            <div>
              <label className="text-sm font-medium">From Date</label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* To Date */}
            <div>
              <label className="text-sm font-medium">To Date</label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Sea */}
            <div>
              <label className="text-sm font-medium">Sea</label>
              <input
                type="text"
                name="sea"
                value={filters.sea}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* State */}
            <div>
              <label className="text-sm font-medium">State</label>
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Weight Min */}
            <div>
              <label className="text-sm font-medium">Wt. Min (kg)</label>
              <input
                type="number"
                name="totalWeightMin"
                value={filters.totalWeightMin}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
            {/* Weight Max */}
            <div>
              <label className="text-sm font-medium">Wt. Max (kg)</label>
              <input
                type="number"
                name="totalWeightMax"
                value={filters.totalWeightMax}
                onChange={handleChange}
                className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
              />
            </div>
          </div>
          <button
           onClick={submit}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>
        </div>

        {/* Display table of results */}
        {data && data.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {/* Table headers based on the structure of your data */}
                  <th className="p-2 border-b">Species Name</th>
                  <th className="p-2 border-b">Latitude</th>
                  <th className="p-2 border-b">Longitude</th>
                  <th className="p-2 border-b">Depth</th>
                  <th className="p-2 border-b">Total Weight (kg)</th>
                  <th className="p-2 border-b">Sea</th>
                  <th className="p-2 border-b">State</th>
                  <th className="p-2 border-b">Zone Type</th>
                  <th className="p-2 border-b">Verified</th>
                  <th className="p-2 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {/* Display the data fields in table rows */}
                    <td className="p-2 border-b">
                      {item.species.map((species) => species.name).join(", ")}
                    </td>
                    <td className="p-2 border-b">{item.latitude}</td>
                    <td className="p-2 border-b">{item.longitude}</td>
                    <td className="p-2 border-b">{item.depth}</td>
                    <td className="p-2 border-b">{item.total_weight}</td>
                    <td className="p-2 border-b">{item.sea}</td>
                    <td className="p-2 border-b">{item.state}</td>
                    <td className="p-2 border-b">{item.zoneType}</td>
                    <td className="p-2 border-b">{item.verified ? "Yes" : "No"}</td>
                    <td className="p-2 border-b">{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterForm;
