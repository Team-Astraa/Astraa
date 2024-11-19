import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';


const Addexcel = () => {
    const [selectedFile, setSelectedFile] = useState(null);



    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const user = localStorage.getItem("aquaUser")
        let { userId } = JSON.parse(user)
        console.log(userId);



        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: '.xlsx,.csv',
    });

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 h-screen">
            <h1 className="text-2xl font-bold mb-4">Upload Excel or CSV File</h1>
            <div
                {...getRootProps()}
                className={`w-80 p-5 text-center h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer 
          ${isDragActive ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-white'}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-green-600">Drop the file here...</p>
                ) : (
                    <p className="text-gray-600">Drag & drop a file here, or click to select one</p>
                )}
            </div>
            {selectedFile && (
                <div className="mt-4 text-gray-800">
                    <p>Selected File: <strong>{selectedFile.name}</strong></p>
                </div>
            )}
            <button
                onClick={handleUpload}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
                Upload File
            </button>
        </div>
    );
};

export default Addexcel;
