import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import AnimationWrapper from './Animation-page';

const Addexcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  // Handle rejected file types
  const onDropRejected = (rejectedFiles) => {
    toast.error('Invalid file type. Only .xlsx and .csv files are allowed.');
  };

  // Upload file to backend, which handles Cloudinary and MongoDB
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const user = localStorage.getItem('aquaUser');
    if (!user) {
      toast.error('User data not found');
      return;
    }
    
    const { userId } = JSON.parse(user);
    if (!userId) {
      toast.error('User ID is missing');
      return;
    }
    console.log(userId);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId); // Pass the user ID along with the file

    setIsLoading(true);
    const uploadToastId = toast.loading('Uploading...');

    try {
      // Send the file to the backend
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // On success
      console.log('File uploaded successfully:', response.data);
      toast.success('File uploaded successfully', { id: uploadToastId });

      // Display Cloudinary file URL (optional)
      const cloudinaryURL = response.data.fileUrl;
      console.log('Uploaded File URL:', cloudinaryURL);

      setSelectedFile(null); // Reset file after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file', { id: uploadToastId });
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: '.xlsx,.csv',
  });

  return (
    <AnimationWrapper className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[500px] flex flex-col items-center justify-center border-2 border-gray-300 mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Your File</h1>
        <p className="text-gray-500 text-md text-center mb-8">
          Drag and drop an Excel or CSV file here, or click to select one.
        </p>
        <div
          {...getRootProps()}
          className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all 
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:shadow-md'}`}
        >
          <input {...getInputProps()} disabled={isLoading} />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the file here...</p>
          ) : (
            <p className="text-gray-500 font-medium">
              Drag & drop your file, or{' '}
              <span className="text-blue-500 underline cursor-pointer">browse files</span>
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
          className={`mt-6 px-5 py-2 text-white font-semibold rounded-lg shadow-md transition-all 
            ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default Addexcel;

