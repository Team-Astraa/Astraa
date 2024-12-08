// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import CatchItemDetail from "../Components/Scientist/Community-data";
// import { Button, Modal } from "flowbite-react";

// const Communitydetail = () => {
//   const [data, setData] = useState([]); // To store the community data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [showComments, setShowComments] = useState({}); // State to track visibility of comments for each community
//   const { communityId } = useParams(); // Get the communityId from the URL params
//   const [openModal, setOpenModal] = useState(false);
//   const [id, setId] = useState(false);

//   useEffect(() => {
//     // Fetch community data
//     const fetchCommunityData = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:5000/scientist/fetch-community-with-data",
//           { communityId }
//         );
//         setData(response.data); // Set the fetched community data
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching community data:", err);
//         setError("Failed to fetch data. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchCommunityData();
//   }, [communityId]);

//   const toggleCommentVisibility = (communityId) => {
//     setShowComments((prevState) => ({
//       ...prevState,
//       [communityId]: !prevState[communityId], // Toggle the visibility of the specific card
//     }));
//   };
//   const handleShareClick = (id) => {
//     setId(id)
//     setOpenModal(true); // Open the modal
//   };

//   const generateUrl = (type) => {
//     const baseUrl = `http://localhost:5173/scientist/community/share`;
//     // Encode the communityId with Base64
//     console.log(id);

//     const encodedId = btoa(`${id}-${type}`);
//     const url = `${baseUrl}/${encodedId}`;

//     // Copy the generated URL to the clipboard
//     navigator.clipboard.writeText(url).then(() => {
//       alert(`URL copied to clipboard: ${url}`);
//     });

//     setOpenModal(false); // Close the modal
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <>
//   <Modal show={openModal} onClose={() => setOpenModal(false)}>
//     <Modal.Header>Share Community</Modal.Header>
//     <Modal.Body>
//       <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//         How do you want to share this community?
//       </p>
//     </Modal.Body>
//     <Modal.Footer>
//       <Button color="green" onClick={() => generateUrl("public")}>
//         Keep as Public
//       </Button>
//       <Button color="blue" onClick={() => generateUrl("private")}>
//         Keep as Private
//       </Button>
//     </Modal.Footer>
//   </Modal>

//   <div className="min-h-screen bg-gray-100 p-4">
//     <h1 className="text-2xl font-bold mb-4">Community Details</h1>
//     {data.length > 0 ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data.map((community, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-lg shadow-md p-4"
//           >
//             <h2 className="text-xl font-semibold text-black">
//               Community Name: {community.community.name}
//             </h2>
//             <h3 className="text-lg text-black-400">
//               Uploaded By: {community.uploadedBy.username}
//             </h3>

//             <button
//               className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
//               onClick={() => toggleCommentVisibility(community.community._id)}
//             >
//               {showComments[community.community._id]
//                 ? "Hide Details"
//                 : "Show Details"}
//             </button>

//             {showComments[community.community._id] && community.data.length > 0 ? (
//               community.data.map((catchItem) => (
//                 <CatchItemDetail key={catchItem._id} catchItem={catchItem} />
//               ))
//             ) : (
//               <div>No data available for this community.</div>
//             )}

//             <button
//               className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md"
//               onClick={() => handleShareClick(community._id)}
//             >
//               Share
//             </button>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div>No communities found.</div>
//     )}
//   </div>
// </>
//   );
// };

// export default Communitydetail;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CatchItemDetail from "../Components/Scientist/Community-data";
import { Button, Modal } from "flowbite-react";

const Communitydetail = () => {
  const [data, setData] = useState([]); // To store the community data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showComments, setShowComments] = useState({}); // State to track visibility of comments for each community
  const { communityId } = useParams(); // Get the communityId from the URL params
  const [openModal, setOpenModal] = useState(false);
  const [openModalTwo, setOpenModalTwo] = useState(false); // Modal visibility state

  const [id, setId] = useState(false);

  useEffect(() => {
    // Fetch community data
    const fetchCommunityData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/scientist/fetch-community-with-data",
          { communityId }
        );
        console.log(response.data);

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

  console.log("DATA ", data);
  const toggleCommentVisibility = (communityIndex) => {
    // Changed parameter from communityId to communityIndex for better context clarity
    setShowComments((prevState) => ({
      ...prevState,
      [communityIndex]: !prevState[communityIndex], // Toggle visibility for this specific community index
    }));
  };

  const handleShareClick = (id) => {
    setId(id);
    setOpenModal(true); // Open the modal
  };

  const generateUrl = (type) => {
    const baseUrl = `http://localhost:5173/scientist/community/share`; // Use backticks for string
    const encodedId = btoa(`${id}-${type}`); // Correctly encoding id combined with type
    const url = `${baseUrl}/${encodedId}`; // Use backticks for string interpolation

    navigator.clipboard.writeText(url).then(() => {
      alert(`URL copied to clipboard: ${url}`); // Use backticks for string interpolation
    });

    setOpenModal(false); // Close the modal
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Share Community</Modal.Header>
        <Modal.Body>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            How do you want to share this community?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="green" onClick={() => generateUrl("public")}>
            Keep as Public
          </Button>
          <Button color="blue" onClick={() => generateUrl("private")}>
            Keep as Private
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Community Details</h1>
        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((community, i) => (
              <div
                key={i}
                className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${
                  showComments[i] ? "h-[600px]" : "h-[300px]" // Change height based on showComments
                }`}
              >
                <h2 className="text-xl font-semibold text-black">
                  Community Name: {community.community.name}
                </h2>
                <h3 className="text-lg text-black-400">
                  Uploaded By: {community.uploadedBy.username}
                </h3>
                <div className="flex flex-col gap-4 mt-4">
                  {/* Toggle Details Button */}
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setOpenModalTwo(true); // Open ModalTwo when this button is clicked
                    }}
                  >
                    Show Details
                  </button>

                  {/* Share Button */}
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleShareClick(community._id)}
                  >
                    Share
                  </button>

                  {/* ModalTwo rendering */}
                  <Modal
                    show={openModalTwo}
                    onClose={() => setOpenModalTwo(false)}
                    size="7xl"
                  >
                    <Modal.Header>Community Details</Modal.Header>
                    <Modal.Body>
                      {showComments[community.community._id] &&
                      Array.isArray(data) ? (
                        data.data.length > 0 ? (
                          data.data.map((catchItem) => (
                            <CatchItemDetail
                              key={catchItem._id}
                              catchItem={catchItem}
                            />
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No catch data available for this community.
                          </p>
                        )
                      ) : null}
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={() => setOpenModalTwo(false)} // Close ModalTwo when this button is clicked
                      >
                        Close
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No communities found.</div>
        )}
      </div>
    </>
  );
};

export default Communitydetail;
