import React, { useEffect, useState } from "react";
import axios from "axios";

const ScientistSavedDataSets = () => {
    const [data, setData] = useState([]);


    // Fetch data from API
    const fetchData = async () => {
        const userInSession = localStorage.getItem("aquaUser");

        if (!userInSession) {
            setError("User session not found. Please log in again.");
            return;
        }

        const { userId } = JSON.parse(userInSession);
       

        try {
            const response = await axios.post(
                `http://localhost:5000/scientist/getScientistSaveDataByUser`,
                { userId }
            );
            setData(response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
          
        } finally {
            
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  
    return (
        <div className="text-white">{data.toString()}</div>
    );
};

export default ScientistSavedDataSets;
