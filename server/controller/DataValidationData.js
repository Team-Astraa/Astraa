//validation code for both abundance and occurence
import CatchData from "../models/FishcatchDataNew.js";
const validateFishingData = (data, dataType = "abundance") => {
  let errors = [];

  data.forEach((entry, index) => {
    // General validation for all fields: handle missing, undefined, and null values.

    // 1. Date Validation (Not future, not older than 6 months)
    const fishingDate = entry.date;
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setMonth(currentDate.getMonth() - 6); // 6 months age

    console.log("entry", entry);
    return;

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
      } else if (dateObj < thresholdDate) {
        errors.push({
          row: index,
          column: "date",
          message: "Date cannot be older than 6 months.",
        });
      }
    }

    // 2. Latitude and Longitude Validation
    const latitude = entry.latitude;
    const longitude = entry.longitude;

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
      errors.push({
        row: index,
        column: "latitude",
        message: "Latitude must be a number between -90 and 90.",
      });
    }

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
      errors.push({
        row: index,
        column: "longitude",
        message: "Longitude must be a number between -180 and 180.",
      });
    }

    // 3. Species Validation
    const speciesNames = new Set(); // Use Set for unique species tracking
    const species = entry.species || [];

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

        // Check for invalid species format (e.g., Salmon(15.5))
        const speciesMatch = /(.+)\((\d+(\.\d+)?)\)/.exec(speciesItem.name);
        if (!speciesMatch) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Invalid species format. Expected 'name(weight)'.",
          });
        }

        // Check if the species name is duplicated
        if (speciesNames.has(speciesName)) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Duplicate species found in the same entry.",
          });
        } else {
          speciesNames.add(speciesName); // Track species name for duplicates
        }

        // Validate catch weight
        if (isNaN(catchWeight) || catchWeight <= 0) {
          errors.push({
            row: index,
            column: `species[${speciesIndex}]`,
            message: "Catch weight must be a positive number.",
          });
        }
      });
    }

    // 4. Total Weight Validation
    const totalWeight = entry.total_weight;

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
      // Validate if depth is provided
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

  return errors;
};

export const autoCheckData = async (req, res) => {
  try {
    // const data = req.body;
    const { data, dataType } = req.body;
    // Array of data objects coming from frontend
    const errors = validateFishingData(data, dataType);

    if (errors.length > 0) {
      return res.status(400).json({ errors }); // Return errors if validation fails
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
