import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Adminmap from "./Admin-map";
import MapboxVisualization from "./Admin-map";
const ResearchMap = () => {
  const [catchData, setCatchData] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    const fetchCatchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/admin/get-fish-data",
          { userId: id }
        );
        setCatchData(response.data);
      } catch (error) {
        console.error("Error fetching catch data:", error);
      }
    };

    fetchCatchData();
  }, []);
  return (
    <div className="text-2xl text-center text-white">
      RESEARCH MAP
      <MapboxVisualization catchData={catchData} />
    </div>
  );
};

export default ResearchMap;
