// adminRoutes.js

import User from "../models/User.js";
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchCruise.js";
import ResearchInstitute from "../models/ResearchInstitute.js";
import ValidatedCatch from "../models/ValidatedCatchData.js";
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
          catches: { $push: "$$ROOT" }, // Group catches by userId
        },
      },
    ]);

    if (catchData.length === 0) {
      return res
        .status(404)
        .json({ message: "No catch data found for this user" });
    }

    return res.status(200).json(catchData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
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

// correct code
export const updateCatchData = async (req, res) => {
  const { modifiedData } = req.body; // Extract modified data from the request body
  const { id: userId } = req.params; // Extract userId from the route parameters

  console.log("Received request to update catch data.");
  console.log("USER ID:", userId);
  console.log(
    "Modified Data in backend:",
    JSON.stringify(modifiedData, null, 2)
  );

  try {
    // Validate inputs
    if (!userId || !modifiedData || !Array.isArray(modifiedData)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid input. userId and an array of modifiedData are required.",
      });
    }

    // Find all catch documents for the given userId
    const catchDocuments = await Catch.find({ userId });
    if (catchDocuments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `No catch data found for user ID: ${userId}`,
      });
    }

    // Process updates for each document in modifiedData
    const updatedDocuments = [];
    for (const modifiedObj of modifiedData) {
      const documentId = modifiedObj.id || modifiedObj._id; // Handle both `id` and `_id`
      const { species, ...fieldsToUpdate } = modifiedObj;
      console.log("DOCUMENT ID", documentId);
      if (!documentId) {
        console.warn("Skipped modifiedData object without an ID:", modifiedObj);
        continue; // Skip if document ID is missing
      }

      // Find the catch document by ID
      const catchDocument = catchDocuments.find(
        (doc) => doc._id.toString() === documentId.toString()
      );
      console.log("catchDocument", catchDocument);
      if (!catchDocument) {
        console.warn(
          `Catch document with ID ${documentId} not found for user ${userId}.`
        );
        continue; // Skip if the document doesn't exist in the user's data
      }

      // Update species if provided
      // let updatedSpecies = catchDocument.species;
      // console.log("updatedSpecies above", updatedSpecies);
      // if (species && Array.isArray(species)) {
      //   console.log("SPECIES", species);
      //   updatedSpecies = updatedSpecies.map((existingSpec) => {
      //     const modifiedSpec = species.find(
      //       (modSpec) => modSpec.id === existingSpec._id.toString()
      //     );
      //     console.log("modifiedSpec", modifiedSpec);
      //     return modifiedSpec
      //       ? { ...existingSpec.toObject(), ...modifiedSpec }
      //       : existingSpec;

      //   });

      // }

      // console.log("updatedSpecies below", updatedSpecies);

      // // Prepare the updated fields
      // const updatedFields = {
      //   ...fieldsToUpdate,
      //   species: updatedSpecies,
      // };

      // // Update the document in the database
      // const updatedCatch = await Catch.findOneAndUpdate(
      //   { _id: documentId },
      //   { $set: updatedFields },
      //   { new: true }
      // );

      let updatedSpecies = catchDocument.species; // Initial species array from the document
      console.log(
        "Initial Updated Species (from catchDocument):",
        updatedSpecies
      );

      if (species && Array.isArray(species)) {
        console.log("Input Species Array (from modifiedData):", species);

        updatedSpecies = updatedSpecies.map((existingSpec) => {
          // Match species based on `_id` field
          const modifiedSpec = species.find(
            (modSpec) => modSpec._id === existingSpec._id.toString()
          );

          console.log("Existing Spec:", existingSpec);
          console.log("Matching Modified Spec:", modifiedSpec);

          return modifiedSpec
            ? { ...existingSpec.toObject(), ...modifiedSpec }
            : existingSpec; // Update or retain the existing spec
        });

        console.log("Final Updated Species Array:", updatedSpecies);
      }

      // Update the database document with the new species array
      const updatedCatch = await Catch.findOneAndUpdate(
        { _id: catchDocument._id }, // Match by document ID
        { $set: { species: updatedSpecies, ...fieldsToUpdate } }, // Include species and other fields
        { new: true } // Return the updated document
      );

      console.log("Updated Catch Document:", updatedCatch);

      if (updatedCatch) {
        console.log(`Successfully updated document ID: ${documentId}`);
        updatedDocuments.push(updatedCatch);
      } else {
        console.error(`Failed to update document ID: ${documentId}`);
      }
    }

    // Send the response with all updated documents
    return res.status(200).json({
      status: "success",
      message: "Catch data updated successfully.",
      data: updatedDocuments,
    });
  } catch (error) {
    console.error("Error during catch data update:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
  }
};

export const validatedCatchData = async (req, res) => {
  try {
    const { catchData, verifier_id } = req.body; // Destructure data from request body
    console.log("CATCH DATA in BACKEND", catchData);
    console.log("verifier_id in BACKEND", verifier_id);
    if (!catchData || catchData.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided for validation." });
    }

    if (!verifier_id) {
      return res
        .status(400)
        .json({ error: "Verifier ID is required for validation." });
    }

    // Optional: Verify if the verifier exists in the User collection
    const verifier = await User.findById(verifier_id);
    if (!verifier) {
      return res.status(404).json({ error: "Verifier not found." });
    }

    // Transform and prepare the data for storage in ValidatedCatch
    const validatedData = catchData.map((item) => ({
      date: item.date,
      latitude: item.latitude,
      longitude: item.longitude,
      depth: item.depth,
      species: item.species.map((species) => ({
        name: species.name,
        catch_weight: species.catch_weight,
      })),
      total_weight: item.total_weight,
      verified_date: new Date(), // Current date for validation
      verifier_id: new mongoose.Types.ObjectId(verifier_id), // Ensure proper ObjectId format
    }));
    console.log("validatedData", validatedData);
    // Insert the validated data into the ValidatedCatch collection
    const result = await ValidatedCatch.insertMany(validatedData);

    // Optional: If needed, update original Catch records to reflect their validation status
    const catchIds = catchData.map((item) => item._id);
    await Catch.updateMany(
      { _id: { $in: catchIds } },
      { $set: { verified: true } }
    );

    return res
      .status(201)
      .json({ message: "Data validated and stored successfully.", result });
  } catch (error) {
    console.error("Error validating and clustering catch data:", error);
    return res.status(500).json({
      message: "An error occurred while validating and storing the data.",
      error: error,
    });
  }
};
