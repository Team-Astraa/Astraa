// adminRoutes.js

import User from "../models/User.js";
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchCruise.js";
import ResearchInstitute from "../models/ResearchInstitute.js";
import { generateCredentials } from "../helper/helper.js";
import mongoose from "mongoose"; // Ensure you have mongoose imported

import bcrypt from "bcrypt";
import sendmail from "../Config/services.js";
import Catch from "../models/FishCatchData.js";

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

    await sendmail(user.email, user.username, user.password);

    res
      .status(200)
      .json({ message: "User verified successfully and email sent", user });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ensure you are getting the correct userId and converting it to ObjectId if needed

export const getDetailsData = async (req, res) => {
  const { userId, userType } = req.body; // Get userId and userType from the request body

  try {
    // Validate if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify userType matches the user's type
    if (user.userType !== userType) {
      return res.status(403).json({ error: "User type mismatch" });
    }

    // Now that we have a valid user, find the associated data
    let detaildata = {};
    console.log(`Fetching data for User ID: ${userId}, User Type: ${userType}`);

    console.log(user);

    if (userType == "research_cruises") {
      detaildata = await ResearchCruise.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else if (userType === "industry-collaborators") {
      detaildata = await IndustryCollaborator.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else if (userType === "research_institute") {
      detaildata = await ResearchInstitute.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    console.log(detaildata); // Log the result

    // Send the fetched data back as response
    return res.status(200).json({ detail: detaildata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getCatchDataGroupedByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
     // Assuming the userId is passed as a URL parameter

    // Use new to instantiate the ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Aggregate query to filter by userId and then group the data
    const catchData = await Catch.aggregate([
      { $match: { userId: objectId } }, // Match the userId passed in the request
      { 
        $group: {
          _id: "$userId",
          catches: { $push: "$$ROOT" } // Group catches by userId
        }
      }
    ]);

    if (catchData.length === 0) {
      return res.status(404).json({ message: "No catch data found for this user" });
    }

    return res.status(200).json(catchData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};



export const getdataUploaduser = async (req, res) => {
  try {
    // Fetch unique userIds from Catch collection
    const uniqueUserIds = await Catch.distinct("userId").exec();

    if (uniqueUserIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found in the Catch collection." });
    }

    // Fetch user details based on unique userIds
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select("userType email username")
      .exec();

    // If no users found
    if (users.length === 0) {
      return res.status(404).json({ message: "No matching users found." });
    }

    // Return the list of users with their information
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
