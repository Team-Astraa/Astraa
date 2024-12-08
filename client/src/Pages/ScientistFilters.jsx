import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";

const FilterForm = () => {
  const [filters, setFilters] = useState({
    lat: "",
    long: "",
    radius: "",
    from: "",
    to: "",
    speciesName: "",
    depthMin: "",
    depthMax: "",
    sea: "",
    state: "",
    userId: "",
    totalWeightMin: "",
    totalWeightMax: "",
    dataType: null,
    zoneType: null,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: prevFilters[type] === value ? null : value,
    }));
  };

  const submit = async () => {
    const requestData = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "depthMin" || key === "depthMax") {
          if (filters.depthMin && filters.depthMax) {
            requestData.depth = {
              min: parseFloat(filters.depthMin),
              max: parseFloat(filters.depthMax),
            };
          }
        } else if (key === "totalWeightMin" || key === "totalWeightMax") {
          if (filters.totalWeightMin && filters.totalWeightMax) {
            requestData.total_weight = {
              min: parseFloat(filters.totalWeightMin),
              max: parseFloat(filters.totalWeightMax),
            };
          }
        } else if (key === "dataType" || key === "zoneType") {
          requestData[key] = value;
        } else {
          requestData[key] = key.includes("lat") || key.includes("long") || key.includes("radius")
            ? parseFloat(value)
            : value;
        }
      }
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/scientist/filter-data", requestData);
      setData(response.data);
      setOpenModal(false)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
      setOpenModal(false)
    }
  };

  const [modalData, setModalData] = useState(null); // Stores data for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal2 = (species) => {
    setModalData(species);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const truncateDecimals = (value, decimals) => {
    return Number(value).toFixed(decimals);
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <nav className="w-full mb-4 px-12 flex items-center justify-between p-4 shadow-lg bg-white">
        <h1 className="text-3xl font-bold ">Apply Filters</h1>
        <Button onClick={() => setOpenModal(true)}>Apply Filters</Button>

      </nav>

      <div className="min-h-screen flex gap-4">
      <div className="w-[10%] h-fit ml-2 shadow-lg bg-white p-4 rounded-lg">
  <div><h1 className="text-lg font-bold mb-2">Your Filters</h1></div>
  <div>
    <ul className="list-disc list-inside space-y-1">
      {Object.entries(filters).map(([key, value], index) => {
        // Check if the value exists (is not empty, null, or undefined)
        if (value) {
          return (
            <li key={index} className="text-sm text-gray-700">
              {key} : {value}
            </li>
          );
        }
        return null; // Skip rendering if value doesn't exist
      })}
    </ul>
  </div>
</div>


        <div className="w-[60%] h-auto shadow-lg bg-white rounded-md">
          {data ? (
            <>
              <div className="flex items-center justify-between w-full p-4 shadow-md">
                <h1>Your Data</h1>
                <div className="flex gap-3 items-center justify-evenly">
                  <Button>Excel</Button>
                  <Button>CSV</Button>
                  <Button>Save</Button>
                  <Button>Share</Button>
                  <Button>Visualize</Button>
                </div>
              </div>
              <div className="grid grid-cols-9 gap-2 p-4 border-t">
                {[
                  "Species Name",
                  "Latitude",
                  "Longitude",
                  "Depth",
                  "Total Weight (kg)",
                  "Sea",
                  "State",
                  "Zone Type",
                  "Date",
                ].map((header) => (
                  <div
                    key={header}
                    className="font-bold text-sm uppercase bg-gray-200 p-2 border"
                  >
                    {header}
                  </div>
                ))}
              </div>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-9 gap-2 p-4 border-t border-gray-200"
                >
                  <div className="p-2 border">
                    <div
                      className="cursor-pointer flex items-center justify-center h-full text-black"
                      onClick={() => openModal2(item.species)}
                    >
                      <i className="fa-solid fa-eye hover:text-lg transition-all duration-150"></i>
                    </div>
                  </div>
                  <div className="p-2 border">
                    {truncateDecimals(item.latitude, 2)}
                  </div>
                  <div className="p-2 border">
                    {truncateDecimals(item.longitude, 2)}
                  </div>
                  <div className="p-2 border break-words">{item.depth}</div>
                  <div className="p-2 border break-words">{item.total_weight}</div>
                  <div className="p-2 border break-words">{item.sea}</div>
                  <div className="p-2 border break-words">{item.state}</div>
                  <div className="p-2 border break-words">{item.zoneType}</div>
                  <div className="p-2 border break-words">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center mt-24">
              <h1 className="text-3xl font-bold">Please Apply The Filters</h1>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-1/3 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Species Details</h2>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                  >
                    ✖
                  </button>
                </div>
                <div className="space-y-2">
                  {modalData.map((species, idx) => (
                    <div key={idx} className="text-gray-800">
                      {`${species.name} (${species.catch_weight || "N/A"})`}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="w-[30%] h-auto shadow-lg bg-white rounded-md"></div>
      </div>


      <>

        <Modal className="p-4" show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Apply Your Filters</Modal.Header>
          <Modal.Body>
            {/* Input Fields */}
            {/* Checkbox Filters */}
            <div className="flex gap-4 mb-6">
              {[
                { label: "Abundance", type: "dataType", value: "abundance" },
                { label: "Occurrence", type: "dataType", value: "occurrence" },
                { label: "PFZ", type: "zoneType", value: "PFZ" },
                { label: "NON-PFZ", type: "zoneType", value: "NON_PFZ" },
              ].map(({ label, type, value }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters[type] === value}
                    onChange={() => handleCheckboxChange(type, value)}
                    className="accent-blue-600"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Latitude", name: "lat", type: "number" },
                { label: "Longitude", name: "long", type: "number" },
                { label: "Radius (km)", name: "radius", type: "number" },
                { label: "Species Name", name: "speciesName", type: "text" },
                { label: "Depth Min", name: "depthMin", type: "number" },
                { label: "Depth Max", name: "depthMax", type: "number" },
                { label: "From Date", name: "from", type: "date" },
                { label: "To Date", name: "to", type: "date" },
                { label: "Sea", name: "sea", type: "text" },
                { label: "State", name: "state", type: "text" },
                { label: "Wt. Min (kg)", name: "totalWeightMin", type: "number" },
                { label: "Wt. Max (kg)", name: "totalWeightMax", type: "number" },
              ].map(({ label, name, type }, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={filters[name]}
                    onChange={handleChange}
                    className="mt-1 p-2 shadow-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            {/* Submit Button */}



          </Modal.Body>

          <Modal.Footer>

            <Button onClick={submit} disabled={loading}>
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default FilterForm;
