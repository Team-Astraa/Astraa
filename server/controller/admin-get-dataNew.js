// controllers/dataController.js
import CatchData from "../models/FishcatchDataNew.js";

// Fetch distinct users grouped by tag
export const getUsersByTag = async (req, res) => {
  const { tag } = req.params;
  console.log("tag in getUsersByTag", tag);
  try {
    const users = await CatchData.aggregate([
      { $match: { tag: tag } }, // Filter by tag
      {
        $group: {
          _id: "$userId", // Group by userId
          earliestTimestamp: { $min: "$timestamp" }, // Get the earliest timestamp for each user
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Flatten the userDetails array
      },
      {
        $project: {
          userId: "$_id",
          userDetails: 1, // Include all fields in userDetails
          uploadTime: "$earliestTimestamp", // Include the earliest timestamp
        },
      },
      {
        $project: {
          "userDetails.password": 0, // Exclude the password field
          "userDetails.passwordChanged": 0, // Exclude the passwordChanged field
        },
      },
    ]);

    console.log("Populated Users:", users);

    // console.log("Users:", users);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch data by userId and tag
export const getDataByUserAndTag = async (req, res) => {
  const { userId, tag } = req.params;
  try {
    const data = await CatchData.find({ userId, tag });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all users who uploaded data (optional for overview)
export const getAllUsers = async (req, res) => {
  try {
    const users = await CatchData.find()
      .distinct("userId")
      .populate("userId", "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveValidatedData = async (req, res) => {
  try {
    const { data, dataType } = req.body; // Data sent from frontend

    // Step 1: Store data in appropriate clusters
    const abundanceCluster = [];
    const occurrenceCluster = [];
    const insertedIds = []; // Track IDs of newly inserted data

    data.forEach((entry) => {
      if (dataType === "abundance") {
        abundanceCluster.push(entry);
        occurrenceCluster.push(entry); // Store in both clusters for "abundance"
      } else if (dataType === "occurrence") {
        occurrenceCluster.push(entry); // Store only in "occurrence" for "occurrence"
      }
    });

    // Insert data into respective clusters
    if (dataType === "abundance") {
      const abundanceResult = await AbundanceCluster.insertMany(abundanceCluster);
      insertedIds.push(...abundanceResult.map((doc) => doc._id)); // Collect inserted IDs
    }

    const occurrenceResult = await OccurrenceCluster.insertMany(occurrenceCluster);
    insertedIds.push(...occurrenceResult.map((doc) => doc._id)); // Collect inserted IDs

    // Step 2: Update CatchData `verified` field to `true` for matching IDs only
    await CatchData.updateMany(
      { _id: { $in: insertedIds } },
      { $set: { verified: true } }
    );

    // Respond with success
    return res.status(200).json({
      message: "Data validated, stored, and verified successfully.",
      validatedData: data,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      message: "Error saving data.",
      error: error.message,
    });
  }
};
