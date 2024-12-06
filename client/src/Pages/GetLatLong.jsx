import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import Modal from 'react-modal';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Initialize the map
  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: 'map', // The ID of the div to attach the map
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Default center
      zoom: 2, // Default zoom level
    });

    // Add navigation controls to the map
    mapInstance.addControl(new mapboxgl.NavigationControl());

    // Set the map instance in state
    setMap(mapInstance);

    // Cleanup map instance on unmount
    return () => mapInstance.remove();
  }, []);

  // Handle map click event
  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    console.log('Map clicked at:', lat, lng);

    // Set the selected location in state
    setSelectedLocation({ lat, lng });

    // Open the modal to ask for radius
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Handle radius input change
  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedLocation && radius) {
      const output = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: parseInt(radius),
      };
      console.log('Output:', output);
      closeModal();
    } else {
      alert('Please enter a valid radius.');
    }
  };

  // Set up the map click event listener
  useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
    }

    // Cleanup on component unmount
    return () => {
      if (map) {
        map.off('click', handleMapClick); // Remove click event listener
      }
    };
  }, [map]);

  return (
    <div className="relative">
      {/* Map container */}
      <div id="map" style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-xl mb-6"></div>

      {/* Modal to input radius */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Enter Radius"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3 max-w-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Enter Radius</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Radius (in meters)</label>
            <input
              type="number"
              value={radius}
              onChange={handleRadiusChange}
              className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter radius"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Display selected location with radius */}
      {selectedLocation && radius && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h3>
          <p><strong className="text-gray-700">Latitude:</strong> {selectedLocation.lat}</p>
          <p><strong className="text-gray-700">Longitude:</strong> {selectedLocation.lng}</p>
          <p><strong className="text-gray-700">Radius (meters):</strong> {radius}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
