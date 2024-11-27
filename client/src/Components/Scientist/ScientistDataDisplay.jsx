import React, { useState } from "react";

const DataDisplay = ({ data }) => {
  const [showResult, setShowResult] = useState(3);
  const limitData = data.slice(0, showResult);
  // console.log(limitData);
  return (
    <div className="px-4 bg-white">
      {/* Header */}
      <div className="grid grid-cols-7 font-bold bg-white border-b border-gray-300 p-2">
        <div>Date</div>
        <div>Latitude</div>
        <div>Longitude</div>
        <div>Depth</div>
        <div>Sea</div>
        <div>State</div>
        <div>Species</div>
      </div>
      {/* Data Rows */}
      {limitData.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-7 border-b border-gray-200 p-2 hover:bg-gray-50"
        >
          <div>{new Date(item.date).toLocaleDateString()}</div>
          <div>{item.latitude}</div>
          <div>{item.longitude}</div>
          <div>{item.depth} m</div>
          <div>{item.sea}</div>
          <div>{item.state}</div>
          <div>
            {item.species
              .map(
                (species) =>
                  `${species.name}${
                    species.catch_weight ? ` (${species.catch_weight} kg)` : ""
                  }`
              )
              .join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataDisplay;
