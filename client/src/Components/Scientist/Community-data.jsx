import React from "react";

const CatchItemDetail = ({ catchItem }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">
          Catch ID: {catchItem._id}
        </h3>
        <span className="text-xs text-gray-500">
          {new Date(catchItem.date).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-300">
        <div className="flex justify-between">
          <span>Latitude:</span>
          <span>{catchItem.latitude}</span>
        </div>
        <div className="flex justify-between">
          <span>Longitude:</span>
          <span>{catchItem.longitude}</span>
        </div>
        <div className="flex justify-between">
          <span>Sea:</span>
          <span>{catchItem.sea || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Depth:</span>
          <span>{catchItem.depth || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Weight:</span>
          <span>{catchItem.total_weight}</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-gray-400">Species:</h4>
        <div className="space-y-1">
          {catchItem.species.map((species) => (
            <div key={species._id} className="flex justify-between text-xs">
              <span>{species.name}</span>
              <span>{species.catch_weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatchItemDetail;
