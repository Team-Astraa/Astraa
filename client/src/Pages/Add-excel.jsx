import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

const Addexcel = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const getUserId = () => {
        const user = localStorage.getItem("aquaUser");
        if (user) {
            const { userId } = JSON.parse(user);
            return userId;
        }
        return null;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            toast.error("User not found. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", userId);

        setIsLoading(true);
        const uploadToastId = toast.loading("Uploading...");
        

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
           
            toast.success("File uploaded successfully", { id: uploadToastId });
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            toast.error("Error while uploading file", { id: uploadToastId });
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".xlsx,.csv",
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-2xl p-12 w-[700px] flex flex-col items-center justify-center border-2 border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Upload Your File</h1>
        <p className="text-gray-500 text-md text-center mb-10">
            Drag and drop an Excel or CSV file here, or click to select one.
        </p>
        <div
            {...getRootProps()}
            className={`w-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all 
            ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50 hover:shadow-md"}`}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-blue-500 font-medium">Drop the file here...</p>
            ) : (
                <p className="text-gray-500 font-medium">
                    Drag & drop your file, or <span className="text-blue-500 underline cursor-pointer">browse files</span>
                </p>
            )}
        </div>
        {selectedFile && (
            <div className="mt-6 text-gray-700 text-center">
                <p>
                    Selected File: <strong>{selectedFile.name}</strong>
                </p>
            </div>
        )}
        <button
            onClick={handleUpload}
            className={`mt-6 px-6 py-2 text-white font-semibold rounded-lg shadow-md transition-all 
            ${isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={isLoading}
        >
            {isLoading ? "Uploading..." : "Upload File"}
        </button>
    </div>
</div>

    );
};

export default Addexcel;
