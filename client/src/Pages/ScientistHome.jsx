import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DataDisplay from '../Components/Scientist/ScientistDataDisplay';
import * as XLSX from 'xlsx';
import AnimationWrapper from './Animation-page';
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

mapboxgl.accessToken = 'pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA';

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
  const [data, setData] = useState([]);
  const [showMapAndFilters, setShowMapAndFilters] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]); // Store map markers for cleanup

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
    const requestData = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value || (typeof value === 'boolean' && value === true)) {
        if (key === 'depthMin' || key === 'depthMax') {
          if (filters.depthMin && filters.depthMax) {
            requestData.depth = {
              min: parseFloat(filters.depthMin),
              max: parseFloat(filters.depthMax),
            };
          }
        } else if (key === 'totalWeightMin' || key === 'totalWeightMax') {
          if (filters.totalWeightMin && filters.totalWeightMax) {
            requestData.total_weight = {
              min: parseFloat(filters.totalWeightMin),
              max: parseFloat(filters.totalWeightMax),
            };
          }
        } else {
          requestData[key] = key.includes('lat') || key.includes('long') || key.includes('radius')
            ? parseFloat(value)
            : value;
        }
      }
    }

    setLoading(true); // Show loader while fetching data
    try {
      const response = await axios.post('http://localhost:5000/scientist/filter-data', requestData);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };



  const navigate = useNavigate();
  useEffect(() => {

    const user = localStorage.getItem('aquaUser');
    const userInSession = JSON.parse(user);
    if (userInSession && userInSession.userType !== 'scientist') {
      toast.error('You cannot access this page');
      navigate('/signin');
    }

  }, []);

  const toggleMapAndFilters = () => {
    setShowMapAndFilters(!showMapAndFilters);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
    XLSX.writeFile(workbook, 'filtered_data.xlsx');
  };

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Centered over India
        zoom: 4,
      });
    }

    // Clear old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    data.forEach((point) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3>${point.species.map((s) => s.name).join(', ')}</h3>
            <p><strong>Sea:</strong> ${point.sea}</p>
            <p><strong>State:</strong> ${point.state}</p>
            <p><strong>Date:</strong> ${new Date(point.date).toLocaleDateString()}</p>
            <p><strong>Total Weight:</strong> ${point.total_weight} kg</p>
          `)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });

    // Adjust map bounds to fit all points
    if (data.length) {
      const bounds = new mapboxgl.LngLatBounds();
      data.forEach((point) => bounds.extend([point.longitude, point.latitude]));
      map.current.fitBounds(bounds, { padding: 50 });
    }


  }, [data]);

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setLoading(true); // Show loader while fetching data
    try {
      const response = await axios.post('http://localhost:5000/scientist/filter-data');
      setData(response.data);

    } catch (error) {
      console.error('Error fetching filtered data:', error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  }

  const calculateSpeciesStats = () => {
    const speciesMap = new Map();
    data.forEach((catchDetail) => {
        catchDetail.species.forEach((s) => {
          if (s.name && s.catch_weight) {
            speciesMap.set(
              s.name,
              (speciesMap.get(s.name) || 0) + s.catch_weight
            );
          }
      });
    });
    const speciesCounts = Array.from(speciesMap.entries());

    const mostCommonSpecies = speciesCounts.length
      ? speciesCounts.reduce((mostCommon, current) =>
          current[1] > mostCommon[1] ? current : mostCommon
        )
      : ["No species", 0];

    const averageWeight =
      speciesCounts.length > 0
        ? speciesCounts.reduce((sum, [, weight]) => sum + weight, 0) /
          speciesCounts.length
        : 0;

    return { speciesCounts, mostCommonSpecies, averageWeight };
  };

  const { speciesCounts, mostCommonSpecies, averageWeight } = calculateSpeciesStats();

  const speciesNames = speciesCounts.map(([species]) => species);
  const speciesWeights = speciesCounts.map(([, weight]) => weight);

  const barData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Distribution",
        data: speciesWeights,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <AnimationWrapper className="md:flex-row h-screen rounded-[3xl]">
      <div style={{borderRadius: "2rem 0 0 2rem"}} className='bg-[#f4f7fc] p-6'>
      {/* Toggle Button */}
        <div className="flex justify-between items-center mb-8">

          <h1 className='text-4xl font-bold'>Dashboard / Overview</h1>

          <div className='flex'>
            <div className='flex items-center'>
            <button
              onClick={downloadExcel}
              className="text-[green] text-xl">
                <i class="fas fa-file-csv mx-3"></i>Download CSV
            </button>
            <span className='text-black text-xl mx-6' >/</span>
            <button
              className="text-[red] text-xl">
                <i class="fas fa-file-pdf mx-3"></i>Download PDF
            </button>
            </div>

            
            <div class="flex items-center mx-10 w-[30vw]">   
              
                <div className="relative w-full">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
                        </svg>
                    </div>
                    <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search fish record..." required style={{borderRadius: "3rem", padding: "1rem 2rem 1rem 2.5rem", width: "100%"}}/>
                </div>
                <button type="submit" class="p-4 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{borderRadius: "3rem"}}>
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </button>
            </div>


            <div style={{borderRadius: "50%", height: "3rem", width: "3rem", backgroundImage: "url(../../public/prof_img.png)", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
          </div>
        </div>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}

      {/* Left Side: Map and Filters */}
        <div className="flex gap-6 w-full h-auto">
          <div className="w-[60vw] rounded-lg flex gap-6">

            <div className='h-full w-1/3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300' style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
              backgroundImage: "url(../../public/sea5_bg.jpg)", backgroundSize: "cover", backgroundRepeat: "no-repeat"
            }}>
                <div className="h-auto rounded-lg shadow-md p-4 flex flex-col" >
                <Typography variant="h6" color="white">
                    Filters
                  </Typography>
                <form onSubmit={handleSubmit} className='flex flex-col justify-between h-full mt-2'>
                  {/* Compact Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Latitude */}
                    <div>
                      <label className="text-sm font-medium text-white">Latitude</label>
                      <input
                        type="number"
                        name="lat"
                        value={filters.lat}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Longitude */}
                    <div>
                      <label className="text-sm font-medium text-white">Longitude</label>
                      <input
                        type="number"
                        name="long"
                        value={filters.long}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Radius */}
                    <div>
                      <label className="text-sm font-medium text-white">Radius (km)</label>
                      <input
                        type="number"
                        name="radius"
                        value={filters.radius}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Species Name */}
                    <div>
                      <label className="text-sm font-medium text-white">Species Name</label>
                      <input
                        type="text"
                        name="speciesName"
                        value={filters.speciesName}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Depth Min */}
                    <div>
                      <label className="text-sm font-medium text-white">Depth Min</label>
                      <input
                        type="number"
                        name="depthMin"
                        value={filters.depthMin}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Depth Max */}
                    <div>
                      <label className="text-sm font-medium text-white">Depth Max</label>
                      <input
                        type="number"
                        name="depthMax"
                        value={filters.depthMax}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* From Date */}
                    <div>
                      <label className="text-sm font-medium text-white">From Date</label>
                      <input
                        type="date"
                        name="from"
                        value={filters.from}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* To Date */}
                    <div>
                      <label className="text-sm font-medium text-white">To Date</label>
                      <input
                        type="date"
                        name="to"
                        value={filters.to}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Sea */}
                    <div>
                      <label className="text-sm font-medium text-white">Sea</label>
                      <input
                        type="text"
                        name="sea"
                        value={filters.sea}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* State */}
                    <div>
                      <label className="text-sm font-medium text-white">State</label>
                      <input
                        type="text"
                        name="state"
                        value={filters.state}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Weight Min */}
                    <div>
                      <label className="text-sm font-medium text-white">Wt. Min (kg)</label>
                      <input
                        type="number"
                        name="totalWeightMin"
                        value={filters.totalWeightMin}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                    {/* Weight Max */}
                    <div>
                      <label className="text-sm font-medium text-white">Wt. Max (kg)</label>
                      <input
                        type="number"
                        name="totalWeightMax"
                        value={filters.totalWeightMax}
                        onChange={handleChange}
                        className="mt-1 p-1 border border-white bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </form>
                </div>
            </div>

            <div className='w-2/3 bg-white rounded-2xl' style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"}}>
              {/* <div className='flex justify-between mb-2'>
              </div> */}
              <div ref={mapContainer} className="w-full h-full bg-gray-700 rounded-2xl p-3 py-6">
                <span className='relative p-3 rounded-xl text-xl font-medium bg-white text-black' style={{zIndex: 9}}>Data Distribution </span>
              </div>
            </div>

            
          </div>

          <div className="w-[40vw] rounded-lg flex flex-col gap-6">
              <div className='grid grid-cols-3 gap-6 h-1/3' >

                <div className="bg-white rounded-xl p-4"  style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"
                }}>
                  <Typography variant="h4" color="textSecondary" style={{fontSize: "1rem"}}>Average Depth</Typography>
                  <p className='text-4xl text-black font-bold mb-3'>1505.70 meters</p>
                  <Typography variant="h4" color="textSecondary" style={{fontSize: "1rem"}}>Min: 0 <br />Max: 110120m</Typography>
                </div>

                <div className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300" style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                  backgroundImage: "url(../../public/sea3_bg.jpg)", backgroundSize: "cover", backgroundRepeat: "no-repeat"
                }}><Typography variant="h4" color="white" style={{fontSize: "1rem"}}>Total Fish Catch</Typography>
                  <p className='text-4xl text-white font-bold'>16535 Kg <br />(In Total) </p></div>

                <div className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300" style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                  backgroundImage: "url(../../public/sea3_bg.jpg)", backgroundSize: "cover", backgroundRepeat: "no-repeat"
                }}><Typography variant="h4" color="white" style={{fontSize: "1rem"}}>Most Common Species</Typography>
                  <p className='text-4xl text-white font-bold'>Mackeral (1950 kg)</p></div>
              </div>

              <div className='bg-white rounded-xl p-4' style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"}}>
                {/* Pie Chart */}
                  <Typography variant="h6" color="textSecondary">
                    Species Weight Distribution
                  </Typography>
                  <Bar data={barData} />
                  {/* <Grid item xs={4} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="textSecondary">
                        Species Distribution
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid> */}
              </div>
          </div>

        </div>      


      {/* Bottom: Data Table */}
      <div className="w-full bg-white mt-5 p-4 pb-6 rounded-lg overflow-y-auto" style={{boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"}}>
                  <Typography variant="h6" color="textSecondary">
                    Data Table
                  </Typography>
        <DataDisplay data={data} />
      </div>
      </div>
    </AnimationWrapper>
  );
};

export default ScientistHome;
