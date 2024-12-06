// import React, { useState } from "react";
// import axios from "axios";

// const ScientistCharts = () => {
//   const [chartType, setChartType] = useState("");
//   const [filter, setFilter] = useState({});
//   const [chartUrl, setChartUrl] = useState("");

//   const fetchChart = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/scientist/get-chart-url",
//         {
//           chartType,
//           filter,
//         }
//       );

//       console.log("response.data.chartUrl", response.data.chartUrl);
//       setChartUrl(response.data.chartUrl);
//     } catch (error) {
//       console.error("Error fetching chart URL:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Fishing Data Visualizations
//       </h1>

//       <div className="mb-4">
//         <label className="block font-semibold mb-2">Select Chart Type</label>
//         <select
//           className="w-full border p-2 rounded"
//           value={chartType}
//           onChange={(e) => setChartType(e.target.value)}
//         >
//           <option value="">Choose a Chart</option>
//           <option value="speciesWeight">Catch Weight by Species</option>
//           <option value="totalWeightOverTime">
//             Fishing Activity Over Time
//           </option>
//           <option value="fishingLocation">Fishing Locations</option>
//           <option value="depthDistribution">Depth Distribution</option>
//           <option value="tagAnalysis">Tag Analysis</option>
//           <option value="totalWeightBySea">Total Weight by Sea</option>
//           <option value="speciesTrends">
//             Species-Specific Trends Over Time
//           </option>
//           <option value="diversityIndex">Catch Diversity Index</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-2">
//           Enter Filters (JSON Format)
//         </label>
//         <textarea
//           className="w-full border p-2 rounded"
//           rows="5"
//           placeholder='e.g., {"species.name": "Tuna", "tag": "abundance"}'
//           onChange={(e) => setFilter(JSON.parse(e.target.value))}
//         ></textarea>
//       </div>

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         onClick={fetchChart}
//       >
//         Generate Chart
//       </button>

//       {/* {chartUrl && (
//         <div className="mt-6">
//           <iframe
//             src={chartUrl}
//             width="100%"
//             height="600px"
//             style={{ border: "none" }}
//             title="Fishing Data Chart"
//           ></iframe>
//         </div>
//       )} */}

//       {chartUrl && (
//         <div style={{ textAlign: "center" }}>
//           <h1>MongoDB Chart</h1>
//           <iframe
//             style={{
//               background: "#FFFFFF",
//               border: "none",
//               borderRadius: "2px",
//               boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
//             }}
//             width="640"
//             height="480"
//             src={chartUrl}
//           ></iframe>
//         </div>
//       )}
//     </div>
//   );
// };

// import axios from "axios";

// const ScientistCharts = () => {
//   const [filters, setFilters] = useState({
//     sea: "",
//     state: "",
//     species: [],
//     depth: [0, 100],
//     dateRange: ["2023-01-01", "2023-12-31"],
//   });

//   const [dashboardURL, setDashboardURL] = useState(
//     "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/d897f82a-2cd3-46af-930f-b3d1f9987d58"
//   );

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const applyFilters = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/scientist/get-chart-url",
//         filters
//       );
//       setDashboardURL(response.data.dashboardURL);
//     } catch (error) {
//       console.error("Error generating dashboard URL", error);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1>Scientific Dashboard</h1>
//       <div>
//         {/* Filter Inputs */}
//         <div>
//           <label>Sea:</label>
//           <input
//             type="text"
//             value={filters.sea}
//             onChange={(e) => handleFilterChange("sea", e.target.value)}
//           />
//         </div>
//         <div>
//           <label>State:</label>
//           <input
//             type="text"
//             value={filters.state}
//             onChange={(e) => handleFilterChange("state", e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Species:</label>
//           <input
//             type="text"
//             value={filters.species.join(",")}
//             onChange={(e) =>
//               handleFilterChange("species", e.target.value.split(","))
//             }
//           />
//         </div>
//         <div>
//           <label>Depth Range:</label>
//           <input
//             type="number"
//             placeholder="Min Depth"
//             onChange={(e) =>
//               handleFilterChange("depth", [
//                 parseInt(e.target.value),
//                 filters.depth[1],
//               ])
//             }
//           />
//           <input
//             type="number"
//             placeholder="Max Depth"
//             onChange={(e) =>
//               handleFilterChange("depth", [
//                 filters.depth[0],
//                 parseInt(e.target.value),
//               ])
//             }
//           />
//         </div>
//         <div>
//           <label>Date Range:</label>
//           <input
//             type="date"
//             onChange={(e) =>
//               handleFilterChange("dateRange", [
//                 e.target.value,
//                 filters.dateRange[1],
//               ])
//             }
//           />
//           <input
//             type="date"
//             onChange={(e) =>
//               handleFilterChange("dateRange", [
//                 filters.dateRange[0],
//                 e.target.value,
//               ])
//             }
//           />
//         </div>
//         <button onClick={applyFilters}>Apply Filters</button>
//       </div>

//       {/* Render Dashboard */}
//       <iframe
//         src={dashboardURL}
//         title="Scientific Dashboard"
//         width="100%"
//         height="600px"
//       />
//     </div>
//   );
// };

// export default ScientistCharts;// export default ScientistCharts;

// import React, { useState } from "react";

import React, { useState } from "react";
import axios from "axios";

const ScientistCharts = () => {
  const [filters, setFilters] = useState({
    depth: [0, 100],
    dateRange: ["2023-01-01", "2023-12-31"],
    tags: [],
  });

  const [dashboardURL, setDashboardURL] = useState(
    "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/d897f82a-2cd3-46af-930f-b3d1f9987d58"
  );

  const [chartData, setChartData] = useState(null); // State to hold filtered data

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/scientist/get-chart-url",
        filters
      );
      setChartData(response.data); // Store the filtered data
      setDashboardURL(response.data.dashboardURL); // Optionally, update dashboard URL
    } catch (error) {
      console.error("Error fetching filtered data", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Scientific Dashboard
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Depth Range Filter */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Depth Range:</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Depth"
                value={filters.depth[0]}
                onChange={(e) =>
                  handleFilterChange("depth", [
                    parseInt(e.target.value) || 0,
                    filters.depth[1],
                  ])
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max Depth"
                value={filters.depth[1]}
                onChange={(e) =>
                  handleFilterChange("depth", [
                    filters.depth[0],
                    parseInt(e.target.value) || 100,
                  ])
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Date Range:</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange[0]}
                onChange={(e) =>
                  handleFilterChange("dateRange", [
                    e.target.value,
                    filters.dateRange[1],
                  ])
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={filters.dateRange[1]}
                onChange={(e) =>
                  handleFilterChange("dateRange", [
                    filters.dateRange[0],
                    e.target.value,
                  ])
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">
              Tags (comma-separated):
            </label>
            <input
              type="text"
              placeholder="Enter Tags"
              value={filters.tags.join(",")}
              onChange={(e) =>
                handleFilterChange("tags", e.target.value.split(","))
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>

      {/* Render Dashboard or Charts */}
      <div className="mt-6">
        {/* Render the updated data from the backend */}
        {chartData && chartData.chart && (
          <ChartComponent data={chartData.chart} /> // Pass the updated filtered data to the chart component
        )}
      </div>
    </div>
  );
};

const ChartComponent = ({ data }) => {
  // Here, you can render your charts using the passed data
  return (
    <div>
      {/* This is just an example */}
      <h2 className="text-xl font-bold">Your Chart Goes Here</h2>
      {/* Use a chart library like Chart.js, D3.js, or others to display the data */}
    </div>
  );
};

export default ScientistCharts;
