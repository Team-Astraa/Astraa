import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // For formatting the timestamp
import { Button } from "flowbite-react";

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Replace 'YOUR_API_URL_HERE' with your actual API URL
        axios
            .get("http://localhost:5000/admin/get-latest-logs")
            .then((response) => {
                setLogs(response.data); // Assuming your backend returns an array of logs
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching logs:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center text-xl text-gray-500">Loading logs...</div>;
    }

    const handleNavigate = (id) => {

  

 
        navigate(`/admin/unverify-fish-data/${id}`);
    };

    // Function to determine the file type
    const getFileType = (fileType) => {
        if (fileType.includes("spreadsheetml.sheet")) {
            return "Excel";
        } else if (fileType.includes("csv")) {
            return "CSV";
        }
        return "Unknown";
    };

    return (
        <div className="container mx-auto my-8 px-4 text-white border border-gray-600 p-4 rounded-md backdrop-blur-md bg-gray-800/70">
            <h2 className="text-2xl font-semibold mb-4">Recent Uploads</h2>

            {loading ? (
                <div className="text-center text-xl text-white/80">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-500 text-left text-sm font-medium text-white/80">
                                    Username
                                </th>
                                <th className="px-6 py-3 border-b border-gray-500 text-left text-sm font-medium text-white/80">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 border-b border-gray-500 text-left text-sm font-medium text-white/80">
                                    File Type
                                </th>
                                <th className="px-6 py-3 border-b border-gray-500 text-left text-sm font-medium text-white/80">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.userId} className="hover:bg-gray-700/80 transition-all">
                                    <td className="px-6 py-4 border-b border-gray-500 text-sm text-white/80">
                                        {log.username}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-500 text-sm text-white/80">
                                        {dayjs(log.uploadTimestamp).format("YYYY-MM-DD HH:mm:ss")}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-500 text-sm text-white/80">
                                        {getFileType(log.fileType)}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-500 text-sm text-center">
                                        <button
                                            className="px-4 py-2 bg-blue-600/80 text-white rounded-md hover:bg-blue-700/90 focus:outline-none"
                                            onClick={() => handleNavigate(log.userId)}
                                        >
                                           <i className="fa-solid fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Button className="mt-4" onClick={() => navigate('/admin/get-data-upload-user')}>see All Users</Button>
        </div>


    );
};

export default Logs;
