import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";


const MapboxVisualization = ({catchData}) => {
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
                backgroundColor: "red",
                borderRadius: "50%",
                width: "10px",
                height: "10px",
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
        >
          <div>
            <h3>Details</h3>
            <p><strong>Depth:</strong> {popupInfo.depth} meters</p>
            <ul>
              {popupInfo.species.map((s) => (
                <li key={s.name}>
                  {s.name}: {s.catch_weight} kg
                </li>
              ))}
            </ul>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapboxVisualization;
