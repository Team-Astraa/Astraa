import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import * as XLSX from "xlsx";

const ScientistSavedDataSets = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null); // Stores the selected dataset
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

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
            // Flatten nested array structure
            const fetchedData = response.data.flat();
            setData(fetchedData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to download data as Excel or CSV
    const handleDownload = (format) => {
        if (!selectedData) return;

        const dataToExport = [
            {
                "Created At": new Date(selectedData.createdAt).toLocaleString(),
                "User ID": selectedData.userId,
                Sea: selectedData.sea,
                "Total Weight": `${selectedData.total_weight} kg`,
                "Zone Type": selectedData.zoneType,
                State: selectedData.state,
                Species: selectedData.species
                    .map((species) => `${species.name} (${species.catch_weight} kg)`)
                    .join(", "),
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dataset Details");

        // Download as Excel or CSV based on format
        if (format === "excel") {
            XLSX.writeFile(workbook, "dataset_details.xlsx");
        } else if (format === "csv") {
            XLSX.writeFile(workbook, "dataset_details.csv", { bookType: "csv" });
        }
    };

    return (
        <div className="w-full h-full bg-gray-200 p-5 items-center">
            <h1 className="text-black text-3xl w-full text-center font-bold mb-4">Scientist Datasets</h1>

            {error && <p className="text-red-500">{error}</p>}

            {/* Modal for viewing dataset */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg">
                <Modal.Header>Dataset Details</Modal.Header>
                <Modal.Body>
                    {selectedData ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">Created At</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(selectedData.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">User ID</td>
                                    <td className="border border-gray-300 px-4 py-2">{selectedData.userId}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">Sea</td>
                                    <td className="border border-gray-300 px-4 py-2">{selectedData.sea}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">Total Weight</td>
                                    <td className="border border-gray-300 px-4 py-2">{selectedData.total_weight} kg</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">Zone Type</td>
                                    <td className="border border-gray-300 px-4 py-2">{selectedData.zoneType}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">State</td>
                                    <td className="border border-gray-300 px-4 py-2">{selectedData.state}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-bold">Species</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <ul>
                                            {selectedData.species.map((species) => (
                                                <li key={species._id}>
                                                    {species.name} ({species.catch_weight} kg)
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No data to display.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="green"
                        onClick={() => handleDownload("excel")}
                    >
                        Download Excel
                    </Button>
                    <Button
                        color="blue"
                        onClick={() => handleDownload("csv")}
                    >
                        Download CSV
                    </Button>
                </Modal.Footer>
            </Modal>

            {data.length > 0 ? (
                <div className="flex flex-col items-center gap-4 w-full">
                    {/* Card header */}
                    <div className="w-4/5 bg-gray-100 text-black font-bold text-lg p-4 rounded-md shadow-md">
                        <div className="flex w-max">
                            <span className="">Created At</span>
                            <span className="">User ID</span>
                            <span className="">Sea</span>
                            <span className="">Total Weight</span>
                            <span className="">Actions</span>
                        </div>
                    </div>

                    {/* Data cards */}
                    {data.map((item) => (
                        <div
                            key={item._id}
                            className="w-4/5 bg-white text-black p-4 rounded-md shadow-md flex justify-between w-max items-center"
                        >
                            <div>{new Date(item.createdAt).toLocaleString()}</div>
                            <div>{item.userId}</div>
                            <div>{item.sea}</div>
                            <div>{item.total_weight} kg</div>
                            <button
                                onClick={() => {
                                    setSelectedData(item);
                                    setOpenModal(true);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                <i className="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                !error && <p className="text-gray-500">No data available.</p>
            )}
        </div>
    );
};

export default ScientistSavedDataSets;
