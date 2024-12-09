import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import MapboxVisualization2 from "../Components/Scientist/ScientistMap";
import ExcelJS from "exceljs";
import Chart from "chart.js/auto";
import ConfirmationModal from "../Components/ConfirmationModal";
import ScientistFileDownload from "../Components/Scientist/ScientistFileDownload";
import Loader from "../Components/Loader";
import ScientistLoader from "../Components/Scientist/ScientistLoader";
import toast from "react-hot-toast";


const FilterForm = () => {

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);
  let [fileLoader, setfileLoader] = useState(false)
  const [isModalOpen3, setIsModalOpen3] = useState(false);
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

  let [msg, setMsg] = useState("confirm please")
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  let [message, setMessage] = useState("")
  let [Visualize , setVisualize] = useState(false);

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
    setMessage("Loading Data.. Please Wait")
    setOpenModal(false)
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
      toast.success("Data Loaded Successfully");
    } catch (error) {
      toast.error("Error Occured")
      toast.error("Error Occured")
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


  const downloadExcelWithCharts = async (fileType) => {
    setfileLoader(true)
    try {
      // Check if data is valid
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No valid data available for export.");
        return;
      }

      // Prepare data for charts
      const stateNames = [...new Set(data.map((item) => item.state))];
      const seaNames = [...new Set(data.map((item) => item.sea))];

      const speciesCounts = {};
      const seaSpeciesCounts = {};
      const stateSpeciesCounts = {};

      data.forEach((item) => {
        item.species.forEach(({ name, catch_weight }) => {
          speciesCounts[name] = (speciesCounts[name] || 0) + catch_weight;
          seaSpeciesCounts[item.sea] = seaSpeciesCounts[item.sea] || {};
          seaSpeciesCounts[item.sea][name] = (seaSpeciesCounts[item.sea][name] || 0) + catch_weight;

          stateSpeciesCounts[item.state] = stateSpeciesCounts[item.state] || {};
          stateSpeciesCounts[item.state][name] = (stateSpeciesCounts[item.state][name] || 0) + catch_weight;
        });
      });

      // Flatten species counts for charts
      const speciesLabels = Object.keys(speciesCounts);
      const speciesData = Object.values(speciesCounts);

      // Workbook and Worksheet
      const workbook = new ExcelJS.Workbook();
      const dataSheet = workbook.addWorksheet("Filtered Data");
      const chartSheet = workbook.addWorksheet("Chart Sheet");

      // Populate Data Sheet
      const flattenedData = data.map((item) => {
        const speciesNames = item.species.map((s) => s.name).join(", ");
        const speciesWeights = item.species.map((s) => s.catch_weight).join(", ");
        return {
          ...item,
          species_names: speciesNames,
          species_weights: speciesWeights,
        };
      });

      const columns = Object.keys(flattenedData[0] || {}).map((key) => ({
        header: key,
        key: key,
      }));
      dataSheet.columns = columns;
      flattenedData.forEach((row) => {
        dataSheet.addRow(row);
      });

      // Generate Charts
      const generateChart = async (type, labels, dataset, chartTitle, colors) => {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = 800;
        chartCanvas.height = 400;

        const ctx = chartCanvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

        const chart = new Chart(ctx, {
          type,
          data: {
            labels,
            datasets: [
              {
                label: chartTitle,
                data: dataset,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: chartTitle },
            },
            scales: type !== "pie" ? { y: { beginAtZero: true } } : undefined,
          },
        });

        return new Promise((resolve) => {
          chart.update();
          setTimeout(() => resolve(chartCanvas), 1000);
        });
      };

      // Define color schemes
      const colorSchemes = [
        { background: "#FF6384", border: "#FF6384" },
        { background: "#36A2EB", border: "#36A2EB" },
        { background: "#FFCE56", border: "#FFCE56" },
        { background: "#4BC0C0", border: "#4BC0C0" },
        { background: "#9966FF", border: "#9966FF" },
        { background: "#FF9F40", border: "#FF9F40" },
      ];

      const chartCanvases = [
        await generateChart(
          "pie",
          speciesLabels,
          speciesData,
          "Total Species Distribution",
          colorSchemes[0]
        ),
        await generateChart(
          "bar",
          stateNames,
          stateNames.map((state) => Object.values(stateSpeciesCounts[state] || {}).reduce((a, b) => a + b, 0)),
          "Total Weight by State",
          colorSchemes[1]
        ),
        await generateChart(
          "bar",
          seaNames,
          seaNames.map((sea) => Object.values(seaSpeciesCounts[sea] || {}).reduce((a, b) => a + b, 0)),
          "Total Weight by Sea",
          colorSchemes[2]
        ),
        await generateChart(
          "line",
          speciesLabels,
          speciesLabels.map((label) => speciesCounts[label] || 0),
          "Species Catch Trends",
          colorSchemes[3]
        ),
        await generateChart(
          "doughnut",
          speciesLabels,
          speciesData,
          "Species Distribution Doughnut",
          colorSchemes[4]
        ),
        await generateChart(
          "radar",
          stateNames,
          stateNames.map((state) => Object.values(stateSpeciesCounts[state] || {}).reduce((a, b) => a + b, 0)),
          "State Comparison Radar",
          colorSchemes[5]
        ),
      ];

      // Style Chart Sheet Header
      chartSheet.getCell("A1").value = "Filtered Data Infographics (Summary)";
      chartSheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF5A5A" } };
      chartSheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
      chartSheet.mergeCells("A1:M2");

      // Add Charts in Grid Layout
      const CHART_WIDTH = 600;
      const CHART_HEIGHT = 400;
      const CHARTS_PER_ROW = 2;
      const startRow = 4;

      for (let i = 0; i < chartCanvases.length; i++) {
        const row = startRow + Math.floor(i / CHARTS_PER_ROW) * 24;
        const col = (i % CHARTS_PER_ROW) * 10;
        const chartBlob = await new Promise((resolve) =>
          chartCanvases[i].toBlob((blob) => resolve(blob), "image/png")
        );
        const imageId = workbook.addImage({
          buffer: await chartBlob.arrayBuffer(),
          extension: "png",
        });
        chartSheet.addImage(imageId, {
          tl: { col, row },
          ext: { width: CHART_WIDTH, height: CHART_HEIGHT },
        });
      }

      // Write and Download
      const excelBuffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `filtered_data_with_multiple_charts.${fileType}`;
      link.click();
      URL.revokeObjectURL(link.href);
      setfileLoader(false)
    } catch (error) {
      setfileLoader(false)
      console.error("Error generating Excel file:", error);
    }
  };


  const handleModalClose = () => {
    setIsModalOpen3(false);
  };




  const handleSaveData = async () => {


    let userInSession = localStorage.getItem("aquaUser");
    let { userId } = JSON.parse(userInSession);

    // Show the confirmation modal
    setMsg("Do you really want to save the data?");
    setIsModalOpen3(true);

    const userConfirmed = await new Promise((resolve) => {
      const confirmHandler = (result) => {
        resolve(result); // Resolve the promise with the user's choice
        setIsModalOpen3(false); // Close the modal
      };

      // Pass confirmHandler to the modal
      setOnConfirm(() => confirmHandler);
    });

    if (!userConfirmed) {
      console.log("User canceled the save action.");
      return;
    }


    // Proceed with the API call
    const dataToSend = {
      uploadedBy: userId,
      data: data,
    };

    setMessage("Wait Saving Your Filtered Data")
    setLoading(true);




    setError(null);
    setResponseMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/scientist/saveScientistData",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponseMessage(response.data.message || "Data saved successfully!");
      toast.success(response.data.message)
      setLoading(false);
    } catch (err) {
      console.error("Error saving data:", err);
      setLoading(false);
    } finally {
      setMessage("")

    }
  };


  const [onConfirm, setOnConfirm] = useState(() => () => { });

  let [openModalc , setOpenModalc] = useState(false)
  const [communities, setCommunities] = useState([]);
  let shareToCommunity = async () => {
    console.log("varad");

    try {
      fetchCommunities();
      setOpenModalc(true);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchCommunities = async () => {
    const userInSession = localStorage.getItem("aquaUser");
    const { userId } = JSON.parse(userInSession);
    try {
      const response = await axios.post(
        "http://localhost:5000/scientist/fetch-communities",
        {
          creatorId: userId,
        }
      );
      if (Array.isArray(response.data)) {
        setCommunities(response.data);
      }
    } catch (error) {
      console.log("Error fetching communities");
    }
  };


  const sendDataForCommunity = async (id) => {
    const userInSession = localStorage.getItem("aquaUser");
    const { userId } = JSON.parse(userInSession);

    try {
      const response = await axios.post(
        "http://localhost:5000/scientist/insert-community-data",
        {
          uploadedBy: userId,
          communityId: id,
          dataArray: data,
        }
      );

      if ((response.status = 200)) {
        console.log("Data sent to community successfully");
        setOpenModalc(false);
      }
    } catch (error) {
      console.log("Error fetching communities");
    }
  };


  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <nav className="w-full mb-4 px-12 flex items-center justify-between p-4 shadow-lg bg-white">
        <h1 className="text-3xl font-bold ">Apply Filters</h1>
        <Button onClick={() => setOpenModal(true)}>Apply Filters</Button>

      </nav>

      {
        fileLoader ? <ScientistFileDownload /> : loading ? <ScientistLoader message={message} />
          :
          <>
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
                      <h1 className="text-2xl font-bold">Your Data</h1>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-4 items-center justify-evenly">
                          <div className="flex flex-col items-center justify-center text-green-500">
                            <i onClick={() => downloadExcelWithCharts("xlsx")} className="fa-solid fa-file-excel text-xl"></i>
                            <p className="text-sm text-center">Excel</p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-green-500">
                            <i onClick={() => downloadExcelWithCharts("csv")} className="fa-solid fa-file-csv text-xl"></i>
                            <p className="text-sm text-center">CSV</p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-blue-500">
                            <i onClick={handleSaveData} className="fa-solid fa-floppy-disk text-xl"></i>
                            <p className="text-sm text-center">Save</p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-purple-500">
                            <i onClick={shareToCommunity} className="fa-solid fa-share text-xl"></i>
                            <p className="text-sm text-center">Share</p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-red-500">
                            <i className="fa-solid fa-chart-simple text-xl"></i>
                            <p className="text-sm text-center">Visualize</p>
                          </div>
                        </div>

                        <p className="font-bold text-black flex">total Row:<p className="text-green-600 ml-2">{data.length}</p></p></div>
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


              <div className="w-[30%] h-auto shadow-lg bg-white rounded-md">

                {/* {
            data && <MapboxVisualization2
              catchData={data}
              props={{ type: "markers", showButton: true }}
            />
          } */}

              </div>
            </div>

          </>
      }

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
        <ConfirmationModal
          msg={msg}
          isOpen={isModalOpen3}
          onClose={handleModalClose}
          onConfirm={onConfirm}
        />

<Modal
        show={openModalc}
        onClose={() => setOpenModalc(false)}
        className="bg-gray-900 text-white"
      >
        {/* Modal Header */}
        <Modal.Header className="bg-gray-800 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-500">
            Select a Community
          </h2>
        </Modal.Header>

        {/* Modal Body */}
        <Modal.Body className="bg-gray-900">
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-300">
                Please select the community you want to interact with.
              </h3>
            </div>

            {/* Community List */}
            <div className="max-h-60 overflow-y-auto space-y-4">
              {communities.map((community, index) => (
                <div
                  key={index}
                  onClick={() => sendDataForCommunity(community._id)}
                  className="flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer shadow-md transition duration-300"
                >
                  <span className="text-lg font-medium">{community.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>

        {/* Modal Footer */}
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <Button
            color="gray"
            onClick={() => setOpenModalc(false)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    </div>
  );
};

export default FilterForm;
