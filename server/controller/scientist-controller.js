import Catch from "../models/FishCatchData.js";
import geolib from "geolib"; // Import geolib for distance calculation
import Community from "../models/community.js";
import Scientist from "../models/Scientist.js";
import Invitation from "../models/invitation.js";
import User from "../models/User.js";
import CommunityData from "../models/CommunityData.js";

export const getUnique = async (req, res) => {
  try {
    const documents = await Catch.find({}, { species: 1, _id: 0 });

    // Extract all species
    const allSpecies = documents.flatMap((doc) => doc.species);

    // Extract unique species names
    const uniqueSpecies = Array.from(
      new Set(allSpecies.map((species) => species.name))
    );

    res.status(200).json({ species: uniqueSpecies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getFilteredCatches = async (req, res) => {
  try {
    const {
      lat,
      long,
      radius,
      from,
      to,
      speciesName,
      depth, // Can be an exact value or a range (min and max)
      sea,
      state,
      total_weight,
    } = req.body;
    console.log(req.body);

    // Build the query object dynamically
    const query = {};

    // Date range filter
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from); // From date
      if (to) query.date.$lte = new Date(to); // To date
    }

    // Depth filter
    if (depth) {
      if (typeof depth === "object") {
        // Depth range
        query.depth = {};
        if (depth.min !== undefined) query.depth.$gte = depth.min; // Minimum depth
        if (depth.max !== undefined) query.depth.$lte = depth.max; // Maximum depth
      } else {
        // Exact depth
        query.depth = depth;
      }
    }

    // Sea filter
    if (sea) {
      query.sea = { $regex: new RegExp(sea, "i") }; // Case-insensitive match
    }

    // State filter
    if (state) {
      query.state = { $regex: new RegExp(state, "i") }; // Case-insensitive match
    }

    // Total weight filter
    if (total_weight) {
      if (typeof total_weight === "object") {
        query.total_weight = {};
        if (total_weight.min !== undefined)
          query.total_weight.$gte = total_weight.min; // Minimum weight
        if (total_weight.max !== undefined)
          query.total_weight.$lte = total_weight.max; // Maximum weight
      } else {
        query.total_weight = total_weight; // Exact weight if no range is provided
      }
    }

    // Fetch and sort catches matching the query
    const catches = await Catch.find(query).sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Apply additional filters in-memory if required
    const filteredCatches = catches.filter((catchItem) => {
      // Species filter
      if (speciesName) {
        // Create a case-insensitive regex pattern for the species name
        const speciesRegex = new RegExp(`^${speciesName}$`, "i");

        // Filter the species array to only include those that match the regex
        catchItem.species = catchItem.species.filter((species) =>
          species.name.match(speciesRegex)
        );

        // If after filtering, species array is empty, you can handle it if needed
        if (catchItem.species.length === 0) {
          return false; // Optionally exclude this item if no species match
        }
      }

      // Geographical filter
      if (lat && long && radius) {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: long },
          { latitude: catchItem.latitude, longitude: catchItem.longitude }
        );

        // Convert radius from km to meters for geolib
        const radiusInMeters = radius * 1000;
        if (distance > radiusInMeters) {
          return false; // Outside the radius
        }
      }

      return true; // Keep this catch if all filters passed
    });

    console.log(`Filtered Catches Count: ${filteredCatches.length}`);

    // Return the filtered catches
    return res.status(200).json(filteredCatches);
  } catch (error) {
    console.error("Error filtering catches:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while filtering the catches." });
  }
};

export const createCommunity = async (req, res) => {
  try {
    const { name, purpose, userId } = req.body;

    const scientist = await User.findById(userId);

    if (!scientist) {
      return res.status(404).send("Scientist not found");
    }

    const community = new Community({
      name,
      purpose,
      creator: scientist._id,
      members: [scientist._id],
    });

    await community.save();
    console.log(community._id);

    // Add the community to the scientist's profile
    scientist.communities.push(community._id);
    await scientist.save();

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunitiesByCreator = async (req, res) => {
  const { creatorId } = req.body; // Get the creator's ID from the request body

  try {
    // Fetch communities where the creatorId is either the creator or a member
    const communities = await Community.find({
      $or: [
        { creator: creatorId }, // Creator is the owner
        { members: creatorId }, // Creator is a member
      ],
    })
      .populate("creator", "name") // Populate creator's name for convenience
      .populate("members", "name"); // Populate members' names for convenience

    // Process each community to check the role of creatorId (owner or member)
    const communitiesWithRoles = communities.map((community) => {
      // Check if creatorId is the creator (owner)
      const isCreatorOwner =
        community.creator._id.toString() === creatorId.toString();

      // Check if creatorId is in the members array
      const isCreatorMember = community.members.some(
        (member) => member._id.toString() === creatorId.toString()
      );

      // Add role information based on whether creatorId is the owner or a member
      return {
        ...community.toObject(),
        role: isCreatorOwner ? "owner" : isCreatorMember ? "member" : "none", // Set role as 'owner' or 'member'
      };
    });

    res.status(200).json(communitiesWithRoles); // Send the communities with roles
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching communities" });
  }
};

export const fetchAllScientists = async (req, res) => {
  try {
    // Find all users with role "scientist"
    const scientists = await User.find({ role: "scientist" });

    // Return the list of scientists
    res.status(200).json(scientists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendInvitation = async (req, res) => {
  try {
    const { communityId, receiverId, userId } = req.body;
    console.log(req.body);

    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    const community = await Community.findById(communityId);

    if (!sender || !receiver || !community) {
      return res
        .status(404)
        .json({ message: "Sender, receiver, or community not found" });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      sender: sender._id,
      receiver: receiver._id,
      community: community._id,
    });
    if (existingInvitation) {
      return res.status(400).json({ message: "Invitation already sent" });
    }

    const invitation = new Invitation({
      sender: sender._id,
      receiver: receiver._id,
      community: community._id,
    });

    console.log(invitation);

    await invitation.save();
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/invitationController.js
export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId, action, userId } = req.body;

    const invitation = await Invitation.findById(invitationId);

    if (!invitation || invitation.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Invalid or already responded invitation" });
    }

    invitation.status = action;
    invitation.respondedAt = Date.now();
    await invitation.save();

    if (action === "rejected") {
      // Send notification to sender
      res.status(400).json({ message: "Invitation rejected" });
      return;
    }

    // Add the scientist to the community
    const community = await Community.findById(invitation.community);
    const scientist = await User.findById(userId);

    community.members.push(scientist._id);
    await community.save();

    // Add the community to the scientist's profile
    scientist.communities.push(community._id);
    await scientist.save();

    res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchInvitation = async (req, res) => {
  const { receiverId } = req.body;
  console.log(req.body);

  try {
    const invitations = await Invitation.find({ receiver: receiverId })
      .populate("sender", "username , email")
      .populate("community", "name purpose");

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invitations", error });
  }
};

export const addCommunityData = async (req, res) => {
  try {
    const { communityId, uploadedBy, dataArray } = req.body;

    // Validate input
    if (!communityId) {
      return res.status(400).json({
        success: false,
        message: "Community ID is required.",
      });
    }

    if (!uploadedBy) {
      return res.status(400).json({
        success: false,
        message: "UploadedBy (User ID) is required.",
      });
    }

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "DataArray must be a non-empty array.",
      });
    }

    // Validate each entry in dataArray
    for (const data of dataArray) {
      if (
        !data.date ||
        !data.latitude ||
        !data.longitude ||
        !data.species ||
        !data.dataId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each data entry must include date, latitude, longitude, species, and dataId.",
        });
      }
    }

    // Check if community exists
    const communityExists = await Community.exists({ _id: communityId });
    if (!communityExists) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    // Check if user exists
    const userExists = await User.exists({ _id: uploadedBy });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Add a unique dataId to each entry in dataArray if missing
    const enrichedDataArray = dataArray.map((data) => ({
      ...data,
      dataId:
        data.dataId || `ID-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    }));

    // Create a new CommunityData entry with attached communityId and uploadedBy
    const newCommunityData = new CommunityData({
      community: communityId,
      uploadedBy,
      data: enrichedDataArray,
    });

    // Save the entry
    const savedCommunityData = await newCommunityData.save();

    return res.status(200).json({
      success: true,
      message: "Data added successfully.",
      savedCommunityData,
    });
  } catch (error) {
    console.error("Error adding community data:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding community data.",
      error: error.message,
    });
  }
};

// Fetch communities for a creator or member with associated data

export const fetchCommunityWithData = async (req, res) => {
  const { communityId } = req.body;

  if (!communityId) {
    return res.status(400).json({ message: "Community ID is required." });
  }

  try {
    console.log("Fetching communities for communityId:", communityId);

    // Find communities where the creatorId matches the provided communityId
    const communities = await CommunityData.find({ community: communityId })
      .populate("uploadedBy", "username email") // Populate uploader details
      .populate("community", "name"); // Populate commenter details

    console.log("Communities found:", communities);

    if (!communities.length) {
      return res
        .status(404)
        .json({ message: "No communities found for the given ID." });
    }

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error.message);
    console.error("Error cause:", error.cause); // This may give more details
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const fetchCommunityShareData = async (req, res) => {
  const communityId = req.body.communityDataId;

  if (!communityId) {
    return res.status(400).json({ message: "Community ID is required." });
  }

  try {
    console.log("Fetching community for communityId:", communityId);

    // Find the community by ID (assuming only one community per ID)
    const community = await CommunityData.findById(communityId)
      .populate("uploadedBy", "username email") // Populate uploader details
      .populate("community", "name"); // Populate community details

    if (!community) {
      return res
        .status(404)
        .json({ message: "No community found for the given ID." });
    }

    console.log("Community found:", community);

    res.status(200).json(community);
  } catch (error) {
    console.error("Error fetching community:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

