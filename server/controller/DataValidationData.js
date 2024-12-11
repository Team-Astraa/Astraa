import common_names from "../indian_common_fish names.json" assert { type: "json" };
import { ratio } from "fuzzball";
import ValidatedCatchData from "../models/ValidatedCatchData.js"
import CatchData from "../models/FishCatchData.js"
export const validateFishingData = (data, dataType = "abundance") => {
  let errors = []; // To store any validation errors found

  data.forEach((entry, index) => {
    // General validation for all fields: handle missing, undefined, and null values.

    // 1. Date Validation (Not future, not older than 6 months)
    const fishingDate = entry.date;
    const currentDate = new Date();

    // Check for missing or invalid fishing date
    if (
      dataType === "abundance" &&
      (fishingDate === null || fishingDate === undefined || fishingDate === "")
    ) {
      errors.push({
        row: index,
        column: "date",
        message: "Date is required.",
      });
    } else {
      const dateObj = new Date(fishingDate);
      // Check if the date is a valid date and not in the future
      if (isNaN(dateObj)) {
        errors.push({
          row: index,
          column: "date",
          message: "Invalid date format.",
        });
      } else if (dateObj > currentDate) {
        errors.push({
          row: index,
          column: "date",
          message: "Date cannot be a future date.",
        });
      }
    }

    // 2. Latitude and Longitude Validation
    const latitude = entry.latitude;
    const longitude = entry.longitude;

    // Check for missing latitude
    if (
      dataType === "abundance" &&
      (latitude === null || latitude === undefined || latitude === "")
    ) {
      errors.push({
        row: index,
        column: "latitude",
        message: "Latitude is required.",
      });
    } else if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      // Validate latitude range
      errors.push({
        row: index,
        column: "latitude",
        message: "Latitude must be a number between -90 and 90.",
      });
    }

    // Check for missing longitude
    if (
      dataType === "abundance" &&
      (longitude === null || longitude === undefined || longitude === "")
    ) {
      errors.push({
        row: index,
        column: "longitude",
        message: "Longitude is required.",
      });
    } else if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      // Validate longitude range
      errors.push({
        row: index,
        column: "longitude",
        message: "Longitude must be a number between -180 and 180.",
      });
    }

    // 3. Species Validation
    const speciesNames = new Set(); // Use Set for unique species tracking
    const species = entry.species || [];

    // Ensure at least one species is provided
    if (species.length === 0) {
      errors.push({
        row: index,
        column: "species",
        message: "At least one species is required.",
      });
    } else {
      species.forEach((speciesItem, speciesIndex) => {
        const speciesName = speciesItem.name
          ? speciesItem.name.split("(")[0].trim()
          : "";
        const catchWeight = speciesItem.catch_weight;

        // Check for missing species name and catch weight
        if (
          !speciesItem.name ||
          catchWeight === undefined ||
          catchWeight === null
        ) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Species name and catch weight are required.",
          });
        }

        // Check for duplicate species in the same entry
        if (speciesNames.has(speciesName)) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Duplicate species found in the same entry.",
          });
        } else {
          speciesNames.add(speciesName); // Track species name for duplicates
        }

        // Validate catch weight to be a positive number
        if (isNaN(catchWeight) || catchWeight <= 0) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Catch weight must be a positive number.",
          });
        }

        // Species name fuzzy matching
        if (speciesName) {
          const matches = common_names.common_names.map((dictName) => ({
            name: dictName,
            score: ratio(speciesName.toLowerCase(), dictName.toLowerCase()),
          }));
          const bestMatch = matches.reduce(
            (a, b) => (a.score > b.score ? a : b),
            {}
          );

          // If the match is close (but not perfect), suggest a correction
          if (bestMatch.score >= 80 && bestMatch.score < 100) {
            errors.push({
              row: index,
              column: `species[${speciesIndex}]`,
              message: `Species name '${speciesName}' is similar to '${bestMatch.name}'. Did you mean '${bestMatch.name}'?`,
            });
          } else if (bestMatch.score < 70) {
            // If the match is poor, flag as invalid
            errors.push({
              row: index,
              column: `species[${speciesIndex}]`,
              message: `Species name '${speciesName}' is invalid. Please check the spelling.`,
            });
          }
        }
      });
    }

    // 4. Total Weight Validation
    const totalWeight = entry.total_weight;

    // Check for missing total weight
    if (
      dataType === "abundance" &&
      (totalWeight === null || totalWeight === undefined || totalWeight === "")
    ) {
      errors.push({
        row: index,
        column: "total_weight",
        message: "Total weight is required.",
      });
    } else {
      // Ensure total weight matches the sum of individual species weights
      const totalSpeciesWeight = species.reduce(
        (sum, speciesItem) => sum + speciesItem.catch_weight,
        0
      );

      if (totalWeight !== totalSpeciesWeight) {
        errors.push({
          row: index,
          column: "total_weight",
          message: "Total weight does not match the sum of species weights.",
        });
      }
    }

    // 5. Handle Optional Depth Field (if present)
    const depth = entry.depth;
    if (depth !== null && depth !== undefined && depth !== "") {
      let depthValue = depth.trim();
      if (depthValue.includes("-")) {
        // Depth range (e.g., "10-20")
        const depthRange = depthValue.split("-").map(Number);
        if (
          depthRange.length === 2 &&
          !isNaN(depthRange[0]) &&
          !isNaN(depthRange[1])
        ) {
          entry.depth = (depthRange[0] + depthRange[1]) / 2; // Use average depth
        } else {
          errors.push({
            row: index,
            column: "depth",
            message: "Invalid depth range format. Expected 'min-max'.",
          });
        }
      } else {
        // Single depth value
        const depthNumber = parseFloat(depthValue);
        if (isNaN(depthNumber) || depthNumber <= 0) {
          errors.push({
            row: index,
            column: "depth",
            message: "Depth must be a positive number.",
          });
        } else {
          entry.depth = depthNumber; // Set the valid depth value
        }
      }
    }
  });

  return errors; // Return the accumulated validation errors
};

export const autoCheckData = async (req, res) => {
  try {
    // const data = req.body;
    const { data, dataType } = req.body;
    // Array of data objects coming from frontend
    const errors = validateFishingData(data, dataType);

    if (errors.length > 0) {
      return res.status(202).json({ errors }); // Return errors if validation fails
    }

    return res
      .status(200)
      .json({ message: "Data is valid. Ready for storage." }); // Success
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// export const saveValidatedData = async (req, res) => {
//   try {
//     const { data } = req.body;

//     console.log("Data in save:", data);

//     // Extract data IDs for processing
//     const dataIds = data.map((item) => item.dataId);

//     // Check if the data IDs exist in `ValidatedCatchData`
//     const existingValidatedDataIds = await ValidatedCatchData.find({
//       _id: { $in: dataIds },
//     }).select("_id");

//     const existingValidatedDataSet = new Set(
//       existingValidatedDataIds.map((item) => item._id.toString())
//     );

//     // Filter out data already in `ValidatedCatchData`
//     const newValidatedData = data.filter(
//       (item) => !existingValidatedDataSet.has(item.dataId)
//     );

//     if (newValidatedData.length === 0) {
//       return res.status(202).json({
//         success: false,
//         message: "All data is already saved in ValidatedCatchData.",
//       });
//     }

//     // Check for existing data in `CatchData`
//     const existingDataIds = await CatchData.find({
//       _id: { $in: newValidatedData.map((item) => item.dataId) },
//     }).select("_id");

//     const existingDataIdsSet = new Set(
//       existingDataIds.map((item) => item._id.toString())
//     );

//     // Filter out data already in `CatchData`
//     const newData = newValidatedData.filter((item) =>
//       existingDataIdsSet.has(item.dataId)
//     );

//     if (newData.length === 0) {
//       return res.status(202).json({
//         success: false,
//         message: "All data is already saved in CatchData.",
//       });
//     }

//     // Save the new data to `ValidatedCatchData`
//     const savedData = await ValidatedCatchData.insertMany(newData);
//     console.log("savedData", savedData);

//     // Bulk update `verified` field in `CatchData`
//     const bulkUpdateOperations = savedData.map((item) => ({
//       updateOne: {
//         filter: { _id: item.dataId },
//         update: { $set: { verified: true } },
//       },
//     }));

//     if (bulkUpdateOperations.length > 0) {
//       await CatchData.bulkWrite(bulkUpdateOperations);
//     }

//     // Respond with success
//     res
//       .status(200)
//       .json({ success: true, message: "Data saved and marked as verified." });
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).json({ success: false, error: "Internal server error." });
//   }
// };

export const saveValidatedData = async (req, res) => {
  try {
    const { data } = req.body;

    console.log("Data in save:", data);

    // Extract data IDs for processing
    const dataIds = data.map((item) => item.dataId);

    // Check if the data IDs exist in `ValidatedCatchData` by `dataId` field
    const existingValidatedDataIds = await ValidatedCatchData.find({
      dataId: { $in: dataIds }, // Use `dataId` instead of `_id`
    }).select("dataId");

    const existingValidatedDataSet = new Set(
      existingValidatedDataIds.map((item) => item.dataId)
    );

    // Filter out data already in `ValidatedCatchData`
    const newValidatedData = data.filter(
      (item) => !existingValidatedDataSet.has(item.dataId)
    );

    if (newValidatedData.length === 0) {
      return res.status(202).json({
        success: false,
        message: "All data is already saved in ValidatedCatchData.",
      });
    }

    // Check for existing data in `CatchData` by `dataId` field
    const existingDataIds = await CatchData.find({
      dataId: { $in: newValidatedData.map((item) => item.dataId) }, // Use `dataId`
    }).select("dataId");

    const existingDataIdsSet = new Set(
      existingDataIds.map((item) => item.dataId)
    );

    // Filter out data already in `CatchData`
    const newData = newValidatedData.filter((item) =>
      existingDataIdsSet.has(item.dataId)
    );

    if (newData.length === 0) {
      return res.status(202).json({
        success: false,
        message: "All data is already saved in CatchData.",
      });
    }

    // Save the new data to `ValidatedCatchData`
    const savedData = await ValidatedCatchData.insertMany(newData);
    console.log("savedData", savedData);

    // Bulk update `verified` field in `CatchData`
    const bulkUpdateOperations = savedData.map((item) => ({
      updateOne: {
        filter: { dataId: item.dataId }, // Use `dataId`
        update: { $set: { verified: true } },
      },
    }));

    if (bulkUpdateOperations.length > 0) {
      await CatchData.bulkWrite(bulkUpdateOperations);
    }

    // Respond with success
    res
      .status(200)
      .json({ success: true, message: "Data saved and marked as verified." });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
