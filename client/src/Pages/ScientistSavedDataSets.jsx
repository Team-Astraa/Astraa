import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import * as XLSX from "xlsx";
import { Datepicker } from "flowbite-react";

const ScientistSavedDataSets = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Fetch and group data
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

            // Group data by _id
            const grouped = response?.data?.data?.map((group) => ({
                _id: group._id,
                name: group.name,
                uploadedBy: group.uploadedBy,
                filters: group.filters,
                datasets: group.data,
            }));
            setGroupedData(grouped || []);
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
        if (!selectedGroup) return;

        const dataToExport = selectedGroup.datasets.map((dataset) => ({
            "Created At": new Date(dataset.createdAt).toLocaleString(),
            "User ID": dataset.userId,
            Sea: dataset.sea,
            "Total Weight": `${dataset.total_weight} kg`,
            "Zone Type": dataset.zoneType,
            State: dataset.state,
            Species: dataset.species
                .map((species) => `${species.name} (${species.catch_weight} kg)`)
                .join(", "),
        }));

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
            <Datepicker/>

            {error && <p className="text-red-500">{error}</p>}

            {/* Modal for viewing datasets */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
                <Modal.Header>Dataset Details</Modal.Header>
                <Modal.Body>
                    {selectedGroup ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                            {selectedGroup.datasets.map((dataset, idx) => (
                                <div key={idx} className="p-4 bg-gray-100 rounded-md">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Created At</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {new Date(dataset.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">User ID</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.userId}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Sea</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.sea}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Total Weight</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.total_weight} kg</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Zone Type</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.zoneType}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">State</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.state}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Species</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <ul>
                                                        {dataset.species.map((species) => (
                                                            <li key={species._id}>
                                                                {species.name} ({species.catch_weight} kg)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No data to display.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button color="green" onClick={() => handleDownload("excel")}>
                        Download Excel
                    </Button>
                    <Button color="blue" onClick={() => handleDownload("csv")}>
                        Download CSV
                    </Button>
                </Modal.Footer>
            </Modal>

            {groupedData.length > 0 ? (
                <div className="flex flex-col items-center gap-4 w-full">
                    {groupedData.map((group) => (
                        <div
                            key={group._id}
                            className="w-4/5 bg-white text-black p-4 rounded-md shadow-md flex justify-between items-center"
                        >
                            <div>
                                <strong>Name:</strong> {group.name}
                            </div>
                            <div>
                                <strong>Total Datasets:</strong> {group.datasets.length}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedGroup(group);
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
                !error && <p className="text-gray-500">No datasets available.</p>
            )}
        </div>
    );
};

export default ScientistSavedDataSets;
