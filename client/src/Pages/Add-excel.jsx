import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import AnimationWrapper from "./Animation-page";

const Addexcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const user = localStorage.getItem("aquaUser");
    let { userId } = JSON.parse(user);
    console.log(userId);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    setIsLoading(true);
    const uploadToastId = toast.loading("Uploading...");
    try {
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
    accept: ".xlsx,.csv",
  });

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
          <input {...getInputProps()} />
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
      </div>
    </AnimationWrapper>
  );
};

export default Addexcel;
