import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page"

const Admindatauploadusers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch the user data based on unique userIds from the Catch collection
                const response = await axios.get("http://localhost:5000/admin/get-data-upload-users");
                setUsers(response.data);
            } catch (error) {
                setError("Error fetching user data.");
            }
        };

        fetchUserData();
    }, []);

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <AnimationWrapper className="min-h-screen  p-6 text-white">
            <h1 className="text-3xl font-semibold text-center mb-6">User Information</h1>
            {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                            <h2 className="text-xl font-bold text-indigo-400 mb-4">User ID: {user._id}</h2>
                            <p className="text-lg mb-2"><strong>Username:</strong> {user.username}</p>
                            <p className="text-lg mb-2"><strong>Email:</strong> {user.email}</p>
                            <p className="text-lg mb-4"><strong>User Type:</strong> {user.userType}</p>
                            <button
                                onClick={() => navigate(`/admin/unverify-fish-data/${user._id}`)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                            >
                                See Data
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg">No users found.</p>
            )}
        </AnimationWrapper>
    );
};

export default Admindatauploadusers;
