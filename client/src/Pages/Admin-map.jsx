import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxVisualization = ({ catchData }) => {
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Map
      initialViewState={{
        latitude: 18.455,
        longitude: 84.431,
        zoom: 7,
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken="pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA" // Replace with your token
    >
      {catchData.map((data) =>
        data.catches.map((catchDetail) => (
          <Marker
            key={catchDetail._id}
            longitude={catchDetail.longitude}
            latitude={catchDetail.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation(); // Prevent click from bubbling
              setPopupInfo(catchDetail);
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                border: "2px solid white",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
                cursor: "pointer",
              }}
            ></div>
          </Marker>
        ))
      )}

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="top"
          onClose={() => setPopupInfo(null)}
          style={{
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            maxWidth: "300px", // Limit popup width
          }}
        >
          <div style={{ fontFamily: "'Roboto', sans-serif" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Details</h3>
            <p style={{ margin: "0 0 5px 0", color: "#555" }}>
              <strong>Latitude:</strong> {popupInfo.latitude.toFixed(6)}
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#555" }}>
              <strong>Longitude:</strong> {popupInfo.longitude.toFixed(6)}
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#555" }}>
              <strong>Depth:</strong> {popupInfo.depth} meters
            </p>
            <div
              style={{
                maxHeight: "150px", // Set max height
                overflowY: "auto", // Enable scrolling
                padding: "5px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ul
                style={{
                  padding: "0",
                  margin: "0",
                  listStyleType: "none",
                  color: "#555",
                }}
              >
                {popupInfo.species.map((s) => (
                  <li
                    key={s.name}
                    style={{
                      margin: "5px 0",
                      padding: "5px",
                      backgroundColor: "#ffffff",
                      borderRadius: "5px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {s.name}: {s.catch_weight} kg
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapboxVisualization;
