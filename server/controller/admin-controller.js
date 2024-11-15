// adminRoutes.js

import User from "../models/User.js";
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchInstitute.js";
import ResearchInstitute from "../models/ResearchCruise.js";
import { generateCredentials } from "../helper/helper.js";
import bcrypt from "bcrypt";
import sendmail from "../Config/services.js";

// Get unverified users by userType
export const getUnverifiedUser = async (req, res) => {
  const { userType } = req.body; // Get userType from query parameters

  if (!userType) {
    return res.status(400).json({ message: "User type is required" });
  }

  try {
    // Fetch unverified users by userType
    const users = await User.find({ userType, isVerifed: false });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: `No unverified users found for ${userType}` });
    }

    // Fetch detailed user data based on userType
    let userDetails;
    switch (userType) {
      case "fisherman":
        userDetails = await Fisherman.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "industry-collaborators":
        userDetails = await IndustryCollaborator.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "research_cruises":
        userDetails = await ResearchCruise.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "research_institute":
        userDetails = await ResearchInstitute.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid userType" });
    }

    // Combine user basic data and additional details
    const combinedData = users.map((user) => ({
      ...user.toObject(),
      additionalDetails: userDetails.find(
        (detail) => detail.userId.toString() === user._id.toString()
      ),
    }));

    res.status(200).json({ users: combinedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};



// adminRoutes.js



// API to verify a user by userId
export const verifyUser = async (req, res) => {
    const { id } = req.body; // Expect userId in the request body
  
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      // Generate random credentials
      const { username, password } = generateCredentials();
  
    
  
      // Update the user with the generated credentials and verify them
      const user = await User.findByIdAndUpdate(
        id,
        { isVerifed: true, username, password: password },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await sendmail(user.email , user.username , user.password)
     
  
      res.status(200).json({ message: "User verified successfully and email sent", user });
    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
