import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admindatauploadusers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate()
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

    if (error) return <div>{error}</div>;
    return (
        <div className="user-details text-white">
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user._id} className="user-info">
                        <h2>User Information</h2>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User Type:</strong> {user.userType}</p>
                        <button onClick={()=>navigate(`/admin/unverify-fish-data/${user._id}`)}>see data </button>
                    </div>
                ))
            ) : (
                <p>No users found.</p>
            )}
        </div>
    )
}

export default Admindatauploadusers