import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Adminverifyfish = () => {
    const [catchData, setCatchData] = useState([]);
    const [selectedCatchIds, setSelectedCatchIds] = useState([]);
    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [modifiedData, setModifiedData] = useState([]); // Track modified data
    let { id } = useParams()

    useEffect(() => {
        const fetchCatchData = async () => {
            try {
                const response = await axios.post("http://localhost:5000/admin/get-fish-data", { userId: id });
                setCatchData(response.data);
            } catch (error) {
                console.error("Error fetching catch data:", error);
            }
        };

        fetchCatchData();
    }, []);

    useEffect(() => {
        // Listen for Ctrl + S (save) key press
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault(); // Prevent default browser save
                handleSaveChanges(); // Trigger save action
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    // Handle selecting and deselecting catch items
    const handleSelectCatch = (catchId) => {
        setSelectedCatchIds((prevSelectedIds) =>
            prevSelectedIds.includes(catchId)
                ? prevSelectedIds.filter((id) => id !== catchId)
                : [...prevSelectedIds, catchId]
        );
    };

    // Handle deleting a particular row
    const handleDeleteRow = async (catchId) => {
        try {
            await axios.delete("http://localhost:5000/admin/delete-catch", {
                data: { catchId },
            });
            setCatchData((prevData) =>
                prevData.map((userData) => ({
                    ...userData,
                    catches: userData.catches.filter((catchItem) => catchItem._id !== catchId),
                }))
            );
            alert("Row deleted successfully!");
        } catch (error) {
            console.error("Error deleting catch data:", error);
        }
    };

    // Handle editing the catch data
    const handleEditCatch = (catchId, editedCatchData) => {
        setCatchData((prevData) =>
            prevData.map((userData) => ({
                ...userData,
                catches: userData.catches.map((catchItem) =>
                    catchItem._id === catchId ? { ...catchItem, ...editedCatchData } : catchItem
                ),
            }))
        );

        // Track modified data
        setModifiedData((prevModifiedData) => {
            const dataIndex = prevModifiedData.findIndex(
                (item) => item._id === catchId
            );
            if (dataIndex >= 0) {
                const updatedData = [...prevModifiedData];
                updatedData[dataIndex] = { ...updatedData[dataIndex], ...editedCatchData };
                return updatedData;
            } else {
                return [
                    ...prevModifiedData,
                    { _id: catchId, ...editedCatchData }, // New modified item
                ];
            }
        });
    };

    // Handle saving the changes to the database
    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(
                "http://localhost:5000/admin/update-catch-data",
                { modifiedData }
            );
            if (response.status === 200) {
                alert("Data saved successfully!");
                setModifiedData([]); // Clear modified data after saving
            }
        } catch (error) {
            console.error("Error saving catch data:", error);
        }
    };

    return (
        <div className="text-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
            <button
                onClick={() => setEditMode(!editMode)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6"
            >
                {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </button>
            <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded-md mb-6 ml-4"
            >
                Save Changes
            </button>
            <div className="space-y-4">
                {catchData.map((data) => (
                    <div key={data._id} className="border-b border-gray-700 py-4">
                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">User ID: {data._id}</h2>

                        {data.catches.map((catchItem) => (
                            <div key={catchItem._id} className="border bg-gray-900 border-gray-700 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-semibold text-gray-400">Catch ID: {catchItem._id}</h3>
                                    {editMode && (
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                                            onClick={() => handleDeleteRow(catchItem._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400">Date:</label>
                                        <input
                                            type="date"
                                            value={new Date(catchItem.date).toISOString().split("T")[0]}
                                            onChange={(e) => handleEditCatch(catchItem._id, { date: e.target.value })}
                                            readOnly={!editMode}
                                            className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400">Latitude:</label>
                                        <input
                                            type="number"
                                            value={catchItem.latitude}
                                            onChange={(e) =>
                                                handleEditCatch(catchItem._id, { latitude: parseFloat(e.target.value) })
                                            }
                                            readOnly={!editMode}
                                            className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400">Longitude:</label>
                                        <input
                                            type="number"
                                            value={catchItem.longitude}
                                            onChange={(e) =>
                                                handleEditCatch(catchItem._id, { longitude: parseFloat(e.target.value) })
                                            }
                                            readOnly={!editMode}
                                            className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400">Depth:</label>
                                        <input
                                            type="number"
                                            value={catchItem.depth || ""}
                                            onChange={(e) => handleEditCatch(catchItem._id, { depth: parseInt(e.target.value) })}
                                            readOnly={!editMode}
                                            className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <label className="text-xs text-gray-400">Species:</label>
                                    <div className="flex gap-8 flex-wrap">
                                        {catchItem.species.map((species) => (
                                            <div key={species._id} className="flex justify-between items-center text-sm gap-2">
                                                <span>{species.name}</span>
                                                <input
                                                    type="number"
                                                    value={species.catch_weight}
                                                    onChange={(e) =>
                                                        handleEditCatch(catchItem._id, {
                                                            species: catchItem.species.map((s) =>
                                                                s._id === species._id
                                                                    ? { ...s, catch_weight: parseInt(e.target.value) }
                                                                    : s
                                                            ),
                                                        })
                                                    }
                                                    readOnly={!editMode}
                                                    className="bg-gray-700 text-white p-2 rounded-md w-16 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs text-gray-400">Total Weight:</label>
                                    <input
                                        type="number"
                                        value={catchItem.total_weight}
                                        onChange={(e) =>
                                            handleEditCatch(catchItem._id, { total_weight: parseInt(e.target.value) })
                                        }
                                        readOnly={!editMode}
                                        className="bg-gray-700 text-white p-2 rounded-md w-full text-xs"
                                    />
                                </div>

                                {editMode && (
                                    <button
                                        onClick={() =>
                                            handleEditCatch(catchItem._id, {
                                                species: catchItem.species,
                                                total_weight: catchItem.total_weight,
                                            })
                                        }
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 text-xs"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Adminverifyfish;
