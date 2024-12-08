//

import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

//   useEffect(() => {
//     // Fetch user data from backend
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(""); // Replace with your API route
//         setUser(response.data);
//         setFormData({
//           name: response.data.name,
//           email: response.data.email,
//           bio: response.data.bio,
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // try {
    //   const response = await axios.put("/api/profile", formData); // Replace with your API route
    //   setUser(response.data);
    //   setIsEditing(false);
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    // }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-card">
        {isEditing ? (
          <>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio || "No bio provided"}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

// const Profile=()=>{
//     return(<>HELLOOO</>)
// }

// export default Profile
