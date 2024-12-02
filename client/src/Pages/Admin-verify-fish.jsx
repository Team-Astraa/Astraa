import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MapboxVisualization from "./Admin-map";
import { toast } from "react-hot-toast";
import AnimationWrapper from "./Animation-page"

const Adminverifyfish = () => {
  const [catchData, setCatchData] = useState([]);
  const [selectedCatchIds, setSelectedCatchIds] = useState([]);
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [modifiedData, setModifiedData] = useState([]); // Track modified data
  const [viewMode, setViewMode] = useState("table"); // State to manage view mode (card or table)
  let { userId } = useParams();
  // console.log("USER ID in frontend", userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/get-fish-data",
        { userId: userId }
      );
      console.log("CATCH DATA",response.data.data)
      // return;
      setCatchData(response.data.data);
    } catch (error) {
      console.error("Error fetching catch data:", error);
    }
  };

  useEffect(() => {
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
          catches: userData.catches.filter(
            (catchItem) => catchItem._id !== catchId
          ),
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
          catchItem._id === catchId
            ? { ...catchItem, ...editedCatchData }
            : catchItem
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
        updatedData[dataIndex] = {
          ...updatedData[dataIndex],
          ...editedCatchData,
        };
        return updatedData;
      } else {
        return [
          ...prevModifiedData,
          { _id: catchId, ...editedCatchData }, // New modified item
        ];
      }
    });
  };

  // console.log("MODIFIED DATA", modifiedData);

  // Handle saving the changes to the database
  const handleSaveChanges = async () => {
    console.log("Calling handle save changes");

    try {
      setIsLoading(true); // Start loading

      const response = await axios.put(
        `http://localhost:5000/admin/update-catch-data/${userId}`, // Template literal for dynamic URL
        modifiedData // Data payload, assuming it's a properly formatted object
    );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        toast.success("Catch data updated successfully!"); // Notify success
        fetchCatchData();
        // Update the state with the new data
        setModifiedData([]); // Clear modified data after saving
      } else {
        toast.error("Failed to update catch data. Please try again.");
      }
    } catch (error) {
      console.error("Error updating catch data:", error);
      setError("Failed to update catch data.");
      toast.error(
        "Error saving catch data. Please check the console for details."
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle validation of catch data
  const handleValidateCatch = async () => {
    console.log("handleValidateCatch Reaching Here");
    const loadingToast = toast.loading("Validating catch data..."); // Show loading toast
    try {
      const verifierId = "673af7b569f9684ec0d4784d"; // Get the verifier ID
      console.log("Catch Data before validation:", catchData);

      const validatedData = catchData.map((userData) =>
        userData.catches.map((fishData) => ({
          _id: fishData?._id,
          date: fishData?.date, // Extracting date, default to null if missing
          latitude: fishData?.latitude, // Extract latitude
          longitude: fishData?.longitude, // Extract longitude
          depth: fishData?.depth, // Extract depth
          species: Array.isArray(fishData.species) // Safely map species
            ? fishData.species.map((speciesItem) => ({
                name: speciesItem?.name, // Default name
                catch_weight: speciesItem?.catch_weight, // Default weight
              }))
            : [], // Default to empty array if species is undefined
          total_weight: fishData.total_weight, // Extract total weight
        }))
      );

      console.log("Valiadted data in Frontend", validatedData);
      // Sending data for validation
      const response = await axios.post(
        "http://localhost:5000/admin/validate-catch",
        {
          validatedData: validatedData,
          verifierId: verifierId,
        }
      );

      // Dismiss loading toast once request is complete
      toast.dismiss(loadingToast);

      if (response.status === 201) {
        toast.success("Catch data validated successfully!"); // Success toast
      } else if (response.status === 200) {
        toast.success("Data Already Validated");
      } else {
        toast.error("Validation failed. Please try again."); // Error toast for non-200 responses
      }

      console.log("Validation Response:", response.data);
    } catch (error) {
      // Dismiss loading toast in case of error

      console.error("Error validating catch data:", error);
      toast.error(
        "Error validating catch data. Please check the console for details."
      ); // Error toast
      toast.dismiss(loadingToast);
    }
  };

  const toggleViewMode = () => {
    setViewMode((preMode) => (preMode === "card" ? "table" : "card"));
  };

  return (
    <>
      <MapboxVisualization catchData={catchData} />

      <AnimationWrapper className="text-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto">
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
        <button
          onClick={handleValidateCatch} // Validate button
          className="bg-orange-600 text-white px-4 py-2 rounded-md mb-6 ml-4"
        >
          Validate Catch Data
        </button>
        <button
          onClick={toggleViewMode}
          className="bg-red-600 text-white px-4 py-2 rounded-md mb-6 ml-4"
        >
          {viewMode === "table"
            ? "Switch to Card View"
            : "Switch to Table View"}
        </button>

        {viewMode === "card" ? (
          // <div className="space-y-4">
          //   {catchData.map((data) => (
          //     <div key={data._id} className="border-b border-gray-700 py-4">
          //       <h2 className="text-lg font-semibold text-indigo-400 mb-2">
          //         User ID: {data._id}
          //       </h2>

          //       {data.catches.map((catchItem) => (
          //         <div
          //           key={catchItem._id}
          //           className="border bg-gray-900 border-gray-700 p-4 rounded-lg mb-4"
          //         >
          //           <div className="flex justify-between items-center mb-2">
          //             <h3 className="text-sm font-semibold text-gray-400">
          //               Catch ID: {catchItem._id}
          //             </h3>
          //             {editMode && (
          //               <button
          //                 className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
          //                 onClick={() => handleDeleteRow(catchItem._id)}
          //               >
          //                 Delete
          //               </button>
          //             )}
          //           </div>

          //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          //             <div>
          //               <label className="text-xs text-gray-400">Date:</label>
          //               <input
          //                 type="date"
          //                 value={
          //                   new Date(catchItem.date).toISOString().split("T")[0]
          //                 }
          //                 onChange={(e) =>
          //                   handleEditCatch(catchItem._id, {
          //                     date: e.target.value,
          //                   })
          //                 }
          //                 readOnly={!editMode}
          //                 className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
          //               />
          //             </div>

          //             <div>
          //               <label className="text-xs text-gray-400">
          //                 Latitude:(Float)
          //               </label>
          //               <input
          //                 type="number"
          //                 value={catchItem.latitude}
          //                 onChange={(e) =>
          //                   handleEditCatch(catchItem._id, {
          //                     latitude: parseFloat(e.target.value),
          //                   })
          //                 }
          //                 readOnly={!editMode}
          //                 className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
          //               />
          //             </div>

          //             <div>
          //               <label className="text-xs text-gray-400">
          //                 Longitude:(Float)
          //               </label>
          //               <input
          //                 type="number"
          //                 value={catchItem.longitude}
          //                 onChange={(e) =>
          //                   handleEditCatch(catchItem._id, {
          //                     longitude: parseFloat(e.target.value),
          //                   })
          //                 }
          //                 readOnly={!editMode}
          //                 className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
          //               />
          //             </div>
          //             <div>
          //               <label className="text-xs text-gray-400">sea:</label>
          //               <input
          //                 type="number"
          //                 value={catchItem.sea}
          //                 onChange={(e) =>
          //                   handleEditCatch(catchItem._id, {
          //                     longitude: parseFloat(e.target.value),
          //                   })
          //                 }
          //                 readOnly={!editMode}
          //                 className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
          //               />
          //             </div>

          //             <div>
          //               <label className="text-xs text-gray-400">Depth:</label>
          //               <input
          //                 type="number"
          //                 value={catchItem.depth || ""}
          //                 onChange={(e) =>
          //                   handleEditCatch(catchItem._id, {
          //                     depth: parseInt(e.target.value),
          //                   })
          //                 }
          //                 readOnly={!editMode}
          //                 className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
          //               />
          //             </div>
          //           </div>

          //           <div className="space-y-2 mt-4">
          //             <label className="text-xs text-gray-400">Species:</label>
          //             <div className="flex gap-8 flex-wrap">
          //               {catchItem.species.map((species) => (
          //                 <div
          //                   key={species._id}
          //                   className="flex justify-between items-center text-sm gap-2"
          //                 >
          //                   <span>{species.name}</span>
          //                   <input
          //                     type="number"
          //                     value={species.catch_weight}
          //                     onChange={(e) =>
          //                       handleEditCatch(catchItem._id, {
          //                         species: catchItem.species.map((s) =>
          //                           s._id === species._id
          //                             ? {
          //                                 ...s,
          //                                 catch_weight: parseInt(
          //                                   e.target.value
          //                                 ),
          //                               }
          //                             : s
          //                         ),
          //                       })
          //                     }
          //                     readOnly={!editMode}
          //                     className="bg-gray-700 text-white p-2 rounded-md w-16 text-xs"
          //                   />
          //                 </div>
          //               ))}
          //             </div>
          //           </div>

          //           <div className="mt-4">
          //             <label className="text-xs text-gray-400">
          //               Total Weight:
          //             </label>
          //             <input
          //               type="number"
          //               value={catchItem.total_weight}
          //               onChange={(e) =>
          //                 handleEditCatch(catchItem._id, {
          //                   total_weight: parseInt(e.target.value),
          //                 })
          //               }
          //               readOnly={!editMode}
          //               className="bg-gray-700 text-white p-2 rounded-md w-full text-xs"
          //             />
          //           </div>

          //           {editMode && (
          //             <button
          //               onClick={() => {
          //                 handleEditCatch(catchItem._id, {
          //                   species: catchItem.species,
          //                   total_weight: catchItem.total_weight,
          //                 });
          //                 handleSaveChanges();
          //                 setEditMode(!editMode); // Invoke handleSaveChanges here
          //               }}
          //               className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 text-xs"
          //             >
          //               Save Changes
          //             </button>
          //           )}
          //         </div>
          //       ))}
          //     </div>
          //   ))}
          // </div>
          <div className="space-y-4">
            {catchData.map((data) => (
              <div key={data._id} className="border-b border-gray-700 py-4">
                <h2 className="text-lg font-semibold text-indigo-400 mb-2">
                  User ID: {data._id}
                </h2>

                {data.catches.map((catchItem) => (
                  <div
                    key={catchItem._id}
                    className="border bg-gray-900 border-gray-700 p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-400">
                        Catch ID: {catchItem._id}
                      </h3>
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
                          value={
                            new Date(catchItem.date).toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              date: e.target.value,
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400">
                          Latitude:
                        </label>
                        <input
                          type="number"
                          value={catchItem.latitude}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              latitude: parseFloat(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400">
                          Longitude:
                        </label>
                        <input
                          type="number"
                          value={catchItem.longitude}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              longitude: parseFloat(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400">Sea:</label>
                        <input
                          type="number"
                          value={catchItem.sea || ""}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              sea: parseFloat(e.target.value),
                            })
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
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              depth: parseInt(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-xs text-gray-400">Species:</label>
                      <div className="flex gap-8 flex-wrap">
                        {catchItem.species.map((species) => (
                          <div
                            key={species._id}
                            className="flex justify-between items-center text-sm gap-2"
                          >
                            <span>{species.name}</span>
                            <input
                              type="number"
                              value={species.catch_weight}
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  species: catchItem.species.map((s) =>
                                    s._id === species._id
                                      ? {
                                          ...s,
                                          catch_weight: parseInt(
                                            e.target.value
                                          ),
                                        }
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
                      <label className="text-xs text-gray-400">
                        Total Weight:
                      </label>
                      <input
                        type="number"
                        value={catchItem.total_weight}
                        onChange={(e) =>
                          handleEditCatch(catchItem._id, {
                            total_weight: parseInt(e.target.value),
                          })
                        }
                        readOnly={!editMode}
                        className="bg-gray-700 text-white p-2 rounded-md w-full text-xs"
                      />
                    </div>

                    {editMode && (
                      <button
                        onClick={() => {
                          handleSaveChanges();
                          setEditMode(false);
                        }}
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse border border-gray-700 lg:table-fixed">
              {/* check the table css lg:table fixed */}
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Catch ID
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Date
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Latitude
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Longitude
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Depth
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Species
                  </th>
                  <th className="p-2 text-xs text-gray-400 border border-gray-500">
                    Total Weight
                  </th>
                  {editMode && (
                    <th className="p-2 text-xs text-gray-400 border border-gray-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {catchData.map((data) =>
                  data.catches.map((catchItem) => (
                    <tr
                      key={catchItem._id}
                      className="border-b border-gray-700"
                    >
                      <td className="p-2 text-xs text-gray-400 border border-gray-500">
                        {catchItem._id}
                      </td>
                      <td className="p-2 text-xs text-gray-400 border border-gray-500">
                        <input
                          type="date"
                          value={
                            new Date(catchItem.date).toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              date: e.target.value,
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </td>
                      <td className="p-2 text-xs text-gray-400 border-b border border-gray-500">
                        <input
                          type="number"
                          value={catchItem.latitude}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              latitude: parseFloat(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </td>
                      <td className="p-2 text-xs text-gray-400 border-b border border-gray-500">
                        <input
                          type="number"
                          value={catchItem.longitude}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              longitude: parseFloat(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </td>
                      <td className="p-2 text-xs text-gray-400 border-b border border-gray-500">
                        <input
                          type="number"
                          value={catchItem.depth || ""}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              depth: parseInt(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-300 border-b border border-gray-500">
                        <select
                          value={
                            catchItem.species.find((s) => s.selected)?._id || ""
                          }
                          onChange={(e) => {
                            const selectedSpeciesId = e.target.value;
                            const updatedSpecies = catchItem.species.map(
                              (species) =>
                                species._id === selectedSpeciesId
                                  ? { ...species, selected: true }
                                  : { ...species, selected: false }
                            );
                            handleEditCatch(catchItem._id, {
                              species: updatedSpecies,
                            });
                          }}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        >
                          <option value="" disabled>
                            Name
                          </option>
                          {catchItem.species.map((species) => (
                            <option key={species._id} value={species._id}>
                              {species.name} ({species.catch_weight})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-2 text-xs text-gray-400 border-b border border-gray-500">
                        <input
                          type="number"
                          value={catchItem.total_weight}
                          onChange={(e) =>
                            handleEditCatch(catchItem._id, {
                              total_weight: parseInt(e.target.value),
                            })
                          }
                          readOnly={!editMode}
                          className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                        />
                      </td>
                      {/* Actions column with border (Delete button) */}
                      {editMode && (
                        <td className="px-4 py-2 text-sm text-gray-300 border border-gray-500">
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                            onClick={() => handleDeleteRow(catchItem._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AnimationWrapper>
    </>
  );
};

export default Adminverifyfish;