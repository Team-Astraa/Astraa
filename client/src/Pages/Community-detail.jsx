import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CatchItemDetail from "../Components/Scientist/Community-data";

const Communitydetail = () => {
  const [data, setData] = useState([]); // To store the community data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showComments, setShowComments] = useState({}); // State to track visibility of comments for each community
  const { communityId } = useParams(); // Get the communityId from the URL params

  useEffect(() => {
    // Fetch community data
    const fetchCommunityData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/scientist/fetch-community-with-data",
          { communityId }
        );
        setData(response.data); // Set the fetched community data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching community data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  const toggleCommentVisibility = (communityId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [communityId]: !prevState[communityId], // Toggle visibility for this community's data
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Community Details</h1>
      {data.length > 0 ? (
        data.map((community, i) => (
          <div key={i} className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold text-white">
              Community Name: {community.community.name}
            </h2>
            <h3 className="text-lg text-gray-400">
              Uploaded By: {community.uploadedBy.username}
            </h3>

            {/* Button to show data for the specific community */}
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
              onClick={() => toggleCommentVisibility(community.community._id)} // Toggle visibility for this community
            >
              {showComments[community.community._id] ? "Hide Details" : "Show Details"}
            </button>

            {/* Toggle to show catch item data for this specific community */}
            {showComments[community.community._id] && community.data.length > 0 ? (
              community.data.map((catchItem) => (
                <CatchItemDetail key={catchItem._id} catchItem={catchItem} />
              ))
            ) : (
              <div>No data available for this community.</div>
            )}

            {/* Button to add a comment */}
            <button
              className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md"
              onClick={() => alert("Open comment section!")}
            >
              Add Comment
            </button>
          </div>
        ))
      ) : (
        <div>No communities found.</div>
      )}
    </div>
  );
};

export default Communitydetail;
