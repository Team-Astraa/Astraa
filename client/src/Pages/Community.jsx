import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Community = () => {
    const [name, setName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [error, setError] = useState("");
    const [communities, setCommunities] = useState([]);
    const [scientists, setScientists] = useState([]);
    const [invitations, setInvitations] = useState([]); // State for invitations
    const [loading, setLoading] = useState(false); // Loading state
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
    const [currentCommunityId, setCurrentCommunityId] = useState(null);
    const [showInvitationModal, setShowInvitationModal] = useState(false); // Invitation modal state
    const [currentInvitation, setCurrentInvitation] = useState(null); // Current invitation being viewed
    let [userId, setUserId] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            const userInSession = localStorage.getItem("aquaUser");
            const { userId } = JSON.parse(userInSession);
            try {
                const response = await axios.post("http://localhost:5000/scientist/fetch-communities", {
                    creatorId: userId,
                });
                if (Array.isArray(response.data)) {
                    setCommunities(response.data);
                } else {
                    setError("Data format is incorrect");
                }
            } catch (error) {
                setError("Error fetching communities");
            }
        };
        fetchCommunities();
    }, []);

    useEffect(() => {
        const fetchScientists = async () => {
            const userInSession = localStorage.getItem("aquaUser");
            const { userId } = JSON.parse(userInSession);
            setUserId(userId);
            try {
                const response = await axios.post("http://localhost:5000/scientist/fetch-scientists");
                if (Array.isArray(response.data)) {
                    setScientists(response.data);
                } else {
                    setError("Error fetching scientists");
                }
            } catch (error) {
                setError("Error fetching scientists");
            }
        };
        fetchScientists();
    }, []);

    useEffect(() => {
        const fetchInvitations = async () => {
            const userInSession = localStorage.getItem("aquaUser");
            const { userId } = JSON.parse(userInSession);
            try {
                setLoading(true); // Start loading
                const response = await axios.post(`http://localhost:5000/scientist/fetch-invitations`, { receiverId: userId });
                setInvitations(response.data);
                setLoading(false); // Stop loading
            } catch (error) {
                setError("Error fetching invitations");
                setLoading(false); // Stop loading
            }
        };
        fetchInvitations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInSession = localStorage.getItem("aquaUser");
        const { userId } = JSON.parse(userInSession);
        try {
            await axios.post("http://localhost:5000/scientist/create-community", {
                name,
                purpose,
                userId,
            });
            setShowCreateCommunityModal(false); // Close the create community modal
        } catch (error) {
            setError("Error creating community");
        }
    };

    const handleCreateCommunityClick = () => {
        setShowCreateCommunityModal(true); // Open the Create Community modal
    };

    const handleAddMember = async (receiverId) => {
        const userInSession = localStorage.getItem("aquaUser");
        const { userId } = JSON.parse(userInSession);
        try {
            await axios.post("http://localhost:5000/scientist/send-invitation", {
                communityId: currentCommunityId,
                receiverId,
                userId
            });
            alert("Invitation sent!");
        } catch (error) {
            alert("Error sending invitation");
        }
    };

    const handleShowAddMemberModal = (communityId) => {
        setCurrentCommunityId(communityId);
        setShowAddMemberModal(true); // Open the Add Member modal
    };

    const handleInvitationAction = async (invitationId, action) => {

        let userInsession = localStorage.getItem("aquaUser")
        let { userId } = JSON.parse(userInsession)
        try {
            await axios.post("http://localhost:5000/scientist/accept-or-reject-invitation", {
                invitationId,
                action,
                userId
            });
            if (action === "accepted") {
                alert("Invitation accepted");
            } else {
                alert("Invitation rejected");
            }
            setShowInvitationModal(false); // Close the modal
            setInvitations(invitations.filter((inv) => inv._id !== invitationId)); // Remove the invitation from the list
        } catch (error) {
            alert("Error processing invitation");
        }
    };

    const handleShowInvitationModal = (invitation) => {
        setCurrentInvitation(invitation);
        setShowInvitationModal(true); // Open the invitation modal
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-green-500 mb-6">Communities</h2>
    
            {/* Error Message */}
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-6">
                    <span>{error}</span>
                </div>
            )}
    
            {/* View Invitations Button */}
            <button
                onClick={() => handleShowInvitationModal(invitations[0])}
                className="w-full md:w-auto bg-green-500 text-white py-2 px-6 rounded-md font-medium shadow-md hover:bg-green-600 transition duration-300 ease-in-out mb-6"
            >
                View Invitations
            </button>
    
            {/* All Communities Section */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-300">All Communities</h3>
                <ul className="space-y-4 mt-4">
                    {communities.length === 0 ? (
                        <li className="text-gray-400">No communities available.</li>
                    ) : (
                        communities.map((community) => (
                            <li key={community._id} className="bg-gray-700 p-6 rounded-xl shadow-md flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-200">{community.name}</h4>
                                    <p className="text-gray-400 mt-2">{community.purpose}</p>
                                </div>
                                <div className="flex space-x-4">
                                    {community.role === 'owner' && (
                                        <button
                                            onClick={() => handleShowAddMemberModal(community._id)}
                                            className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                                        >
                                            Add Member
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate(`/scientist/community/${community._id}`)}
                                        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                                    >
                                        View Data
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
    
            {/* Create New Community Button */}
            <button
                onClick={handleCreateCommunityClick}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
                Create New Community
            </button>
        </div>
    
        {/* Create Community Modal */}
        {showCreateCommunityModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                <div className="bg-gray-800 p-8 rounded-xl max-w-lg w-full">
                    <h3 className="text-2xl font-semibold text-gray-200 mb-6">Create New Community</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Community Name"
                            className="w-full p-4 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                            required
                        />
                        <textarea
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="Community Purpose"
                            className="w-full p-4 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                        >
                            Create Community
                        </button>
                    </form>
                    <button
                        onClick={() => setShowCreateCommunityModal(false)}
                        className="mt-6 w-full text-center bg-gray-600 text-gray-300 py-3 px-6 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    
        {/* Add Member Modal */}
        {showAddMemberModal && currentCommunityId && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                <div className="bg-gray-800 p-8 rounded-xl max-w-lg w-full">
                    <h3 className="text-2xl font-semibold text-gray-200 mb-6">Add Member</h3>
                    {scientists.length === 0 ? (
                        <p className="text-gray-400">No scientists available.</p>
                    ) : (
                        scientists.map((scientist) => (
                            userId !== scientist._id && (
                                <div key={scientist._id} className="flex justify-between items-center bg-gray-700 p-4 mb-4 rounded-md hover:bg-gray-600">
                                    <div>
                                        <span className="text-lg font-semibold text-gray-200">{scientist.username}</span>
                                        <span className="text-sm text-gray-400">{scientist.userType}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAddMember(scientist._id)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        Add
                                    </button>
                                </div>
                            )
                        ))
                    )}
                    <button
                        onClick={() => setShowAddMemberModal(false)}
                        className="mt-6 w-full text-center bg-gray-600 text-gray-300 py-3 px-6 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    
        {/* Invitation Modal */}
        {showInvitationModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                <div className="bg-gray-800 p-8 rounded-xl max-w-2xl w-full">
                    <h3 className="text-2xl font-semibold text-gray-200 mb-6">Invitations</h3>
                    {invitations.length === 0 ? (
                        <p className="text-gray-400">No invitations available.</p>
                    ) : (
                        <table className="w-full table-auto border-collapse text-sm text-gray-300">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-4 py-2 text-left">Sender</th>
                                    <th className="px-4 py-2 text-left">Community Name</th>
                                    <th className="px-4 py-2 text-left">Purpose</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((invitation) => (
                                    <tr key={invitation._id} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="px-4 py-2">{invitation.sender.email}</td>
                                        <td className="px-4 py-2">{invitation.community.name}</td>
                                        <td className="px-4 py-2">{invitation.community.purpose}</td>
                                        <td className="px-4 py-2">{invitation.status}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleInvitationAction(invitation._id, "accepted")}
                                                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 mb-2"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleInvitationAction(invitation._id, "rejected")}
                                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <button
                        onClick={() => setShowInvitationModal(false)}
                        className="mt-6 w-full text-center bg-gray-600 text-gray-300 py-3 px-6 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
    
    
    );
};

export default Community;
