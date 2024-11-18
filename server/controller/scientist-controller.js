import Catch from "../models/FishCatchData.js";
import geolib from "geolib"; // Import geolib for distance calculation

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

    // Fetch catches matching the query
    const catches = await Catch.find(query);

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
