import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Import xlsx

const decodeUrlData = (encodedString) => {
    try {
        const decodedString = atob(encodedString);
        const [communityId, type] = decodedString.split("-");
        return { communityId, type };
    } catch (error) {
        console.error("Failed to decode URL data:", error);
        return null;
    }
};

const FishingData = () => {

    let { shareURL } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const encodedString = shareURL;
            const decodedData = decodeUrlData(encodedString);

            if (!decodedData) {
                setError("Invalid encoded string.");
                setLoading(false);
                return;
            }

            const { communityId } = decodedData;

            try {
                const response = await axios.post(
                    "http://localhost:5000/scientist/fetch-community-Share-data",
                    { communityDataId: communityId }
                );
                
                console.log("API Response Data: ", response.data);  // Log the full response to understand its structure
                setData(response.data);  // Assuming response is an array or object that contains data
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shareURL]);

    const downloadExcel = () => {
        // Prepare the data for Excel
        const excelData = data.data.map((entry) => ({
            "Data ID": entry.dataId,
            "Date": new Date(entry.date).toLocaleDateString(),
            "Sea": entry.sea,
            "State": entry.state,
            "Depth (m)": entry.depth,
            "Total Weight (kg)": entry.total_weight,
            "Verified": entry.verified ? "Yes" : "No",
            "Species": entry.species.map((species) => `${species.name}: ${species.catch_weight} kg`).join(", ")
        }));

        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(excelData);
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Fishing Data");

        // Generate the Excel file and download it
        XLSX.writeFile(wb, "Fishing_Data.xlsx");
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-center text-black-700 mb-6">
                Fishing Data
            </h1>
            {!data ? (
                <div className="text-center text-gray-500">No data available.</div>
            ) : (
                <>
                    <button
                        onClick={downloadExcel}
                        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Download Excel
                    </button>
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Community: {data.community.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Uploaded by: {data.uploadedBy.username} ({data.uploadedBy.email})
                        </p>
                        <div className="mt-4">
                            {data.data && data.data.map((entry) => (
                                <div
                                    key={entry._id}
                                    className="p-4 bg-gray-100 rounded-lg mb-4 border border-gray-300"
                                >
                                    <h3 className="font-semibold text-gray-600">Data ID: {entry.dataId}</h3>
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(entry.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Sea: {entry.sea}</p>
                                    <p className="text-sm text-gray-500">State: {entry.state}</p>
                                    <p className="text-sm text-gray-500">Depth: {entry.depth} meters</p>
                                    <p className="text-sm text-gray-500">
                                        Total Weight: {entry.total_weight} kg
                                    </p>
                                    <h4 className="font-medium text-gray-600 mt-2">Species:</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {entry.species && entry.species.map((species) => (
                                            <li
                                                key={species._id}
                                                className="text-sm text-gray-500"
                                            >
                                                {species.name}: {species.catch_weight} kg
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm mt-2 text-gray-500">
                                        Verified: {entry.verified ? "Yes" : "No"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FishingData;
