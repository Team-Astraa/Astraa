import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DataDisplay from '../Components/Scientist/ScientistDataDisplay';
import * as XLSX from 'xlsx';
import AnimationWrapper from './Animation-page';

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
  const [showMapAndFilters, setShowMapAndFilters] = useState(true);
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
        style: 'mapbox://styles/mapbox/streets-v11',
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
  return (
    <AnimationWrapper className="md:flex-row h-screen p-4">
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-4">

        <button
          onClick={toggleMapAndFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showMapAndFilters ? 'Hide Map and Filters' : 'Show Map and Filters'}
        </button>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download Data
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}

      {/* Left Side: Map and Filters */}
      {showMapAndFilters && (
        <div className="flex gap-4 w-full h-auto border p-3">
          <div className="w-1/2 bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Map</h2>
            <div ref={mapContainer} className="w-full h-96 bg-gray-700 rounded-lg"></div>
          </div>

          <div className="w-1/2 bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Filters</h2>
            <form onSubmit={handleSubmit}>
              {/* Compact Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Latitude */}
                <div>
                  <label className="text-sm text-gray-300">Latitude</label>
                  <input
                    type="number"
                    name="lat"
                    value={filters.lat}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Longitude */}
                <div>
                  <label className="text-sm text-gray-300">Longitude</label>
                  <input
                    type="number"
                    name="long"
                    value={filters.long}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Radius */}
                <div>
                  <label className="text-sm text-gray-300">Radius (km)</label>
                  <input
                    type="number"
                    name="radius"
                    value={filters.radius}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Species Name */}
                <div>
                  <label className="text-sm text-gray-300">Species Name</label>
                  <input
                    type="text"
                    name="speciesName"
                    value={filters.speciesName}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Depth Min */}
                <div>
                  <label className="text-sm text-gray-300">Depth Min</label>
                  <input
                    type="number"
                    name="depthMin"
                    value={filters.depthMin}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Depth Max */}
                <div>
                  <label className="text-sm text-gray-300">Depth Max</label>
                  <input
                    type="number"
                    name="depthMax"
                    value={filters.depthMax}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* From Date */}
                <div>
                  <label className="text-sm text-gray-300">From Date</label>
                  <input
                    type="date"
                    name="from"
                    value={filters.from}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* To Date */}
                <div>
                  <label className="text-sm text-gray-300">To Date</label>
                  <input
                    type="date"
                    name="to"
                    value={filters.to}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Sea */}
                <div>
                  <label className="text-sm text-gray-300">Sea</label>
                  <input
                    type="text"
                    name="sea"
                    value={filters.sea}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* State */}
                <div>
                  <label className="text-sm text-gray-300">State</label>
                  <input
                    type="text"
                    name="state"
                    value={filters.state}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Weight Min */}
                <div>
                  <label className="text-sm text-gray-300">Weight Min (kg)</label>
                  <input
                    type="number"
                    name="totalWeightMin"
                    value={filters.totalWeightMin}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
                {/* Weight Max */}
                <div>
                  <label className="text-sm text-gray-300">Weight Max (kg)</label>
                  <input
                    type="number"
                    name="totalWeightMax"
                    value={filters.totalWeightMax}
                    onChange={handleChange}
                    className="mt-1 p-1 border border-gray-700 bg-gray-800 text-white rounded-md w-full"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Bottom: Data Table */}
      <div className="w-full bg-gray-900 mt-4 p-4 rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold text-green-400 mb-4">Data Table</h2>
        <DataDisplay data={data} />
      </div>
    </AnimationWrapper>
  );
};

export default ScientistHome;
