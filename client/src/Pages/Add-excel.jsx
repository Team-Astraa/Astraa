import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import AnimationWrapper from "./Animation-page";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const Addexcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [downloadType, setDownloadType] = useState(""); // To keep track of the download type

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  // Handle rejected file types
  const onDropRejected = (rejectedFiles) => {
    toast.error("Invalid file type. Only .xlsx and .csv files are allowed.");
  };

  // Upload file to backend, which handles Cloudinary and MongoDB
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const user = localStorage.getItem("aquaUser");
    if (!user) {
      toast.error("User data not found");
      return;
    }

    const { userId } = JSON.parse(user);
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }
    console.log(userId);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId); // Pass the user ID along with the file

    setIsLoading(true);
    const uploadToastId = toast.loading("Uploading...");
    try {
      // Send the file to the backend
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);
      toast.success("File uploaded successfully", { id: uploadToastId });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file", { id: uploadToastId });
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ".xlsx,.csv",
  });

  // Handle download
  const handleDownload = (type) => {
    setDownloadType(type); // Set the download type (either "abundance" or "occurrence")
    setOpenModal(true); // Open the modal with instructions
  };

  // Confirm download and trigger the actual download
  const initiateDownload = async () => {
    // console.log(first)
    try {
      const response = await axios.get(
        `http://localhost:5000/download/${downloadType}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${downloadType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setModalText(
        `You have downloaded the ${downloadType} file successfully.`
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <AnimationWrapper className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Title moved outside the card */}
      <h1 className="text-4xl font-bold text-gray-800 mb-12">
        Upload Your File
      </h1>

      {/* Card Container */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-[500px] flex flex-col items-center justify-center border-2">
        <p className="text-gray-500 text-md text-center mb-8">
          Drag and drop an Excel or CSV file here, or click to select one.
        </p>
        <div
          {...getRootProps()}
          className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all 
            ${
              isDragActive
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-gray-50 hover:shadow-xl hover:border-blue-500"
            }`}
        >
          <input {...getInputProps()} disabled={isLoading} />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the file here...</p>
          ) : (
            <p className="text-gray-600 font-medium">
              Drag & drop your file, or{" "}
              <span className="text-blue-600 underline cursor-pointer">
                browse files
              </span>
            </p>
          )}
        </div>
        {selectedFile && (
          <div className="mt-4 text-gray-700 text-center">
            <p>
              Selected File: <strong>{selectedFile.name}</strong>
            </p>
          </div>
        )}
        <button
          onClick={handleUpload}
          className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all 
            ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload File"}
        </button>

        {/* Buttons for Download */}
        <div className="mt-8 space-x-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownload("abundance")}
          >
            Download Abundance
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDownload("occurrence")}
          >
            Download Occurrence
          </Button>
        </div>
      </div>

      {/* Modal for Download Instructions */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          className="p-6 bg-white rounded-md shadow-lg"
          style={{
            width: "400px",
            margin: "100px auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <Close />
          </IconButton>
           <Typography variant="h6">Instructions for {downloadType}</Typography>
          <Typography variant="body1" className=" mt-4 text-gray-700">
           
            {downloadType === "abundance" ? (
              <div>
                <p className="text-lg font-semibold">1. Abundance Data</p>
                <p className="mt-2">
                  The Abundance file contains data regarding abundance
                  measurements. This file is essential for ecological analysis.
                </p>
                <p className="mt-2">
                  <strong>Tip:</strong> Ensure that you have the correct
                  software to open this file (e.g., Excel).
                </p>
                <p className="mt-2">
                  This file includes various species data and their abundances,
                  which are crucial for biodiversity studies.
                </p>
                <p className="mt-2">
                  <strong>Note:</strong> You can use this data to generate
                  reports or graphs for ecological studies.
                </p>
                <p className="mt-4 text-center font-semibold text-blue-600">
                  Click the download button below to retrieve the file.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold">1. Occurrence Data</p>
                <p className="mt-2">
                  The Occurrence file contains data regarding species occurrence
                  records, valuable for biodiversity monitoring.
                </p>
                <p className="mt-2">
                  <strong>Tip:</strong> Ensure that the occurrence data is ready
                  for analysis before downloading.
                </p>
                <p className="mt-2">
                  This file is formatted for easy import into analysis tools,
                  ensuring smooth integration with your existing systems.
                </p>
                <p className="mt-4 text-center font-semibold text-blue-600">
                  Click the download button below to retrieve the file.
                </p>
              </div>
            )}
          </Typography> 

          <Button
            variant="contained"
            color="primary"
            onClick={initiateDownload}
            className="mt-6"
          >
            Download{" "}
            {downloadType.charAt(0).toUpperCase() + downloadType.slice(1)}
          </Button>
        </Box>
      </Modal>
    </AnimationWrapper>
  );
};

export default Addexcel;
