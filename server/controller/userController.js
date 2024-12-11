import xlsx from "xlsx";
import fs from "fs";
import csv from "csv-parser";
import { getDistance } from "geolib";

import Catch from "../models/FishCatchData.js";
import Log from "../models/logSchema.js";
import CatchData from "../models/FishcatchDataNew.js";

import SpeciesData from "../models/Species.js"; // Import the schema

import path from "path"; // To handle file paths
const stateBoundaries = {
  Gujarat: { latitude: 22.2587, longitude: 71.1924 },
  Maharashtra: { latitude: 19.7515, longitude: 75.7139 },
  Goa: { latitude: 15.2993, longitude: 74.124 },
  Karnataka: { latitude: 15.3173, longitude: 75.7139 },
  Kerala: { latitude: 10.8505, longitude: 76.2711 },
  TamilNadu: { latitude: 11.1271, longitude: 78.6569 },
  AndhraPradesh: { latitude: 15.9129, longitude: 79.74 },
  Odisha: { latitude: 20.9517, longitude: 85.0985 },
  WestBengal: { latitude: 22.9868, longitude: 87.855 },
  Lakshadweep: { latitude: 10.5667, longitude: 72.6417 },
};
// Helper function to clean and normalize data
const categorizeLocation = (latitude, longitude) => {
  let sea = "Unknown Region";

  // Determine the sea region
  if (latitude >= 8 && latitude <= 23 && longitude >= 68 && longitude <= 75) {
    sea = "Arabian Sea";
  } else if (
    latitude >= 10 &&
    latitude <= 23 &&
    longitude >= 80 &&
    longitude <= 90
  ) {
    sea = "Bay of Bengal";
  } else if (latitude < 8) {
    sea = "Indian Ocean";
  }

  // Determine the closest state
  let closestState = "Unknown State";
  let shortestDistance = Infinity;

  for (const [state, coordinates] of Object.entries(stateBoundaries)) {
    const distance = getDistance({ latitude, longitude }, coordinates);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestState = state;
    }
  }

  return { sea, state: closestState };
};

// Main cleanData function
// Function to handle Excel date serial numbers
const parseExcelDate = (excelDate) => {
  const excelStartDate = new Date(1900, 0, 1); // January 1, 1900
  const dateOffset = excelDate - 1; // Excel starts from 1, JS starts from 0
  return new Date(
    excelStartDate.setDate(excelStartDate.getDate() + dateOffset)
  );
};

const cleanData = (data, userId, id, dataType) => {
  return data.map((item) => {
    const species = [];

    // Check if MAJOR_SPECIES exists and process it
    if (item.MAJOR_SPECIES) {
      const speciesData = item.MAJOR_SPECIES.split(","); // Split by commas
      speciesData.forEach((s) => {
        const match = s.match(/([A-Za-z\s]+)\((\d+)\)/); // Regex to extract name and weight
        if (match) {
          species.push({
            name: match[1].trim().toLowerCase(),
            catch_weight: parseInt(match[2].trim()),
          });
        } else {
          species.push({
            name: s.trim().toLowerCase(),
            catch_weight: null,
          });
        }
      });
    }

    // Normalize depth values by removing non-numeric characters
    const depth = item.DEPTH
      ? parseFloat(item.DEPTH.split("-")[0].trim()) // Take the first part before the "-"
      : null;

    // Categorize by sea and state
    const latitude = parseFloat(item.SHOOT_LAT);
    const longitude = parseFloat(item.SHOOT_LONG);
    const { sea, state } = categorizeLocation(latitude, longitude);

    // Convert Excel date or handle as string date
    const dateValue = item["FISHING Date"];
    const date =
      typeof dateValue === "number"
        ? parseExcelDate(dateValue) // Excel serial number
        : parseDate(dateValue); // Regular date string

    // Get the zone value or default to an empty string
    const zone = item.TYPE ? item.TYPE.trim() : "";

    return {
      date, // Use the parsed date
      latitude,
      longitude,
      depth,
      species,
      sea,
      state,
      userId,
      dataId: id,
      dataType,
      verified: false,
      total_weight: parseFloat(item.TOTAL_CATCH),
      zoneType: zone, // Include the zone value
    };
  });
};

function generateRandomId() {
  const date = new Date();
  const timestamp = date.getTime(); // Get the current timestamp in milliseconds
  const randomNumber = Math.floor(Math.random() * 100000); // Generate a random number
  const randomId = `ID-${timestamp}-${randomNumber}`; // Combine the timestamp and random number
  return randomId;
}

// Example usage

export const uploadCSV = async (req, res) => {
  try {
    const { userId, dataType } = req.body;
    const file = req.file;

    const filePath = file.path;
    const fileType = file.mimetype; // Capture the file type (mimetype)
    console.log(filePath);
    console.log("dataType", dataType);

    if (!dataType) {
      return res.status(400).json({ message: "data type is required" });
    }
    let data = [];
    let finalData = [];
    let id = generateRandomId();

    const logData = {
      userId,
      dataType,
      fileType,
      dataId: id, // Include fileType here
    };
    // Check file type
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      const sheet = workbook.Sheets[sheetName];
      const rawData = xlsx.utils.sheet_to_json(sheet);
      console.log(rawData);

      // Clean and normalize data
      data = cleanData(rawData, userId, id, dataType);
    } else if (file.mimetype === "text/csv") {
      // Parse CSV file
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          data = cleanData(results, userId, id, dataType);

          // Log data to console
          console.log("Parsed Data:", data);

          // Comment out database insertion for debugging or re-enable as needed
          try {
            await Catch.insertMany(finalData);
            await Log.create(logData);
            return res.status(200).json({
              message:
                "File uploaded successfully. Data logged for verification.",
            });
          } catch (dbError) {
            return res.status(500).json({
              message: "Error inserting data into database",
              error: dbError.message,
            });
          }
        });
      return; // Ensure response is sent inside the CSV processing callback
    } else {
      return res.status(400).json({
        message: "Invalid file type. Please upload an Excel or CSV file.",
      });
    }

    // Comment out database insertion for debugging or re-enable as needed
    try {
      await Catch.insertMany(data);
      await Log.create(logData);
      res.status(200).json({
        message: "File uploaded successfully. Data logged for verification.",
      });
    } catch (dbError) {
      res.status(500).json({
        message: "Error inserting data into database",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

// Controller to handle file upload and data extraction
// export const uploadSpeciesData = async (req, res) => {
//   try {
//     // Get the file from request
//     const file = req.file;

//     // Parse the file based on extension
//     let data;
//     const fileExtension = path.extname(file.originalname);

//     if (fileExtension === ".xlsx") {
//       // Read the xlsx file
//       const workbook = xlsx.readFile(file.path);
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const worksheet = workbook.Sheets[sheetName];
//       data = xlsx.utils.sheet_to_json(worksheet);
//     } else if (fileExtension === ".csv") {
//       // Read the csv file
//       data = xlsx.utils.csv_to_json(file.buffer.toString());
//     } else {
//       return res
//         .status(400)
//         .send("Invalid file type. Please upload an xlsx or csv file.");
//     }

//     // Transform data
//     const transformedData = data.map((row) => {
//       const { Longitude, Latitude, Date, Village, ...speciesData } = row;

//       return {
//         longitude: parseFloat(Longitude),
//         latitude: parseFloat(Latitude),
//         date: new Date(Date),
//         village: Village || null,
//         species: Object.keys(speciesData).reduce((acc, key) => {
//           const weight = parseFloat(speciesData[key]);
//           acc.set(key, isNaN(weight) ? 0 : weight); // Store 0 if the weight is invalid or missing
//           return acc;
//         }, new Map()),
//       };
//     });

//     // Save the transformed data to the database
//     await SpeciesData.insertMany(transformedData);

//     // Send success response
//     return res.status(200).send("File uploaded and data saved successfully.");
//   } catch (error) {
//     console.error("Error uploading species data:", error);
//     return res.status(500).send("Internal server error.");
//   }
// };

const excelDateToJSDate = (serial) => {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date is 1899-12-30
  return new Date(excelEpoch.getTime() + serial * 86400000); // Convert to milliseconds
};

// Function to parse the date format DD-MM-YYYY or YYYY-MM-DD
const parseDate = (dateValue) => {
  // If it's an instance of Date, return it
  console.log("dateValue", dateValue);
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // If it's a number (Excel serial number), convert it
  if (typeof dateValue === "number") {
    const date = excelDateToJSDate(dateValue);
    console.log("date", date);
    return date;
  }

  // If it's a string, check for a valid format 'YYYY-MM-DD'
  if (typeof dateValue === "string") {
    const parts = dateValue.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      if (year.length === 4 && month.length === 2 && day.length === 2) {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date; // Return the Date object if valid
        }
      }
    }
  }

  // Return null if date is invalid
  return null;
};

// export const uploadSpeciesData = async (req, res) => {
//   try {
//     // Get the file from the request
//     const file = req.file;
//     console.log(req.file);

//     // Parse the file based on extension
//     let data;
//     const fileExtension = path.extname(file.originalname);

//     if (fileExtension === ".xlsx") {
//       // Read the xlsx file
//       const workbook = xlsx.read(file.buffer); // Use buffer instead of file.path for multer memoryStorage
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const worksheet = workbook.Sheets[sheetName];
//       data = xlsx.utils.sheet_to_json(worksheet);
//     } else if (fileExtension === ".csv") {
//       // Read the csv file
//       data = xlsx.utils.csv_to_json(file.buffer.toString());
//     } else {
//       return res
//         .status(400)
//         .send("Invalid file type. Please upload an xlsx or csv file.");
//     }

//     // Transform data
//     // const transformedData = data.map((row) => {
//     //   const { Longitude, Latitude, Date, Village, ...speciesData } = row;

//     //   const parsedDate = parseDate(Date); // Parse the date
//     //   if (!parsedDate) {
//     //     console.error("Invalid date format:", Date);
//     //   }

//     //   return {
//     //     longitude: parseFloat(Longitude), // Parse Longitude to float
//     //     latitude: parseFloat(Latitude), // Parse Latitude to float
//     //     date: parsedDate || new Date(), // Use parsed date or current date if invalid
//     //     village: Village || null, // Set to null if Village is missing
//     //     species: Object.keys(speciesData).reduce((acc, key) => {
//     //       const weight = parseFloat(speciesData[key]);
//     //       acc.set(key, isNaN(weight) ? 0 : weight); // Store 0 if the weight is invalid or missing
//     //       return acc;
//     //     }, new Map()),
//     //   };
//     // });

//     // const transformedData = data.map((row) => {
//     //   const { Longitude, Latitude, Date, Village, ...speciesData } = row;

//     //   const parsedDate = parseDate(Date); // Parse the date (now handles Date object or string)
//     //   if (!parsedDate) {
//     //     console.error("Invalid date format:", Date);
//     //   }

//     //   return {
//     //     longitude: parseFloat(Longitude), // Parse Longitude to float
//     //     latitude: parseFloat(Latitude), // Parse Latitude to float
//     //     date: parsedDate || new Date(), // Use parsed date or current date if invalid
//     //     village: Village || null, // Set to null if Village is missing
//     //     species: Object.keys(speciesData).reduce((acc, key) => {
//     //       const weight = parseFloat(speciesData[key]);
//     //       acc.set(key, isNaN(weight) ? 0 : weight); // Store 0 if the weight is invalid or missing
//     //       return acc;
//     //     }, new Map()),
//     //   };
//     // });

//     const transformedData = data.map((row) => {
//       const { Longitude, Latitude, Date, Village, ...speciesData } = row;

//       const parsedDate = parseDate(Date); // Parse the date using the updated function
//       if (!parsedDate) {
//         console.error("Invalid date format:", Date);
//       }

//       return {
//         longitude: parseFloat(Longitude), // Parse Longitude to float
//         latitude: parseFloat(Latitude), // Parse Latitude to float
//         date: parsedDate || new Date(), // Use parsed date or the current date if invalid
//         village: Village || null, // Set to null if Village is missing
//         species: Object.keys(speciesData).reduce((acc, key) => {
//           const weight = parseFloat(speciesData[key]);
//           acc.set(key, isNaN(weight) ? 0 : weight); // Store 0 if weight is invalid or missing
//           return acc;
//         }, new Map()),
//       };
//     });

//     // Save the transformed data to the database
//     await SpeciesData.insertMany(transformedData);

//     // Send success response
//     return res.status(200).send("File uploaded and data saved successfully.");
//   } catch (error) {
//     console.error("Error uploading species data:", error);
//     return res.status(500).send("Internal server error.");
//   }
// };

// export const uploadSpeciesData = async (req, res) => {
//   try {
//     // Get the file from the request
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     // Parse the file based on extension
//     let data;
//     const fileExtension = path.extname(file.originalname);

//     if (fileExtension === ".xlsx") {
//       // Use the buffer directly with xlsx.read
//       const workbook = xlsx.read(file.buffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const worksheet = workbook.Sheets[sheetName];
//       data = xlsx.utils.sheet_to_json(worksheet);
//     } else if (fileExtension === ".csv") {
//       // Read the csv file
//       data = xlsx.utils.csv_to_json(file.buffer.toString());
//     } else {
//       return res
//         .status(400)
//         .send("Invalid file type. Please upload an xlsx or csv file.");
//     }

//     // Transform data
//     const transformedData = data.map((row) => {
//       const { Longitude, Latitude, Date, Village, ...speciesData } = row;

//       const parsedDate = parseDate(Date); // Parse the date
//       if (!parsedDate) {
//         console.error("Invalid date format:", Date);
//       }

//       return {
//         longitude: parseFloat(Longitude), // Parse Longitude to float
//         latitude: parseFloat(Latitude), // Parse Latitude to float
//         date: parsedDate || new Date(), // Use parsed date or current date if invalid
//         village: Village || null, // Set to null if Village is missing
//         species: Object.keys(speciesData).reduce((acc, key) => {
//           const weight = parseFloat(speciesData[key]);
//           acc.set(key, isNaN(weight) ? 0 : weight); // Store 0 if the weight is invalid or missing
//           return acc;
//         }, new Map()),
//       };
//     });

//     // Save the transformed data to the database
//     await SpeciesData.insertMany(transformedData);

//     // Send success response
//     return res.status(200).send("File uploaded and data saved successfully.");
//   } catch (error) {
//     console.error("Error uploading species data:", error);
//     return res.status(500).send("Internal server error.");
//   }
// };

export const uploadSpeciesData = async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    console.log(req.file);

    // Parse the file based on extension
    let data;
    const fileExtension = path.extname(file.originalname);

    if (fileExtension === ".xlsx") {
      // Read the xlsx file
      const workbook = xlsx.read(file.buffer); // Use buffer instead of file.path for multer memoryStorage
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const worksheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
    } else if (fileExtension === ".csv") {
      // Read the csv file
      data = xlsx.utils.csv_to_json(file.buffer.toString());
    } else {
      return res
        .status(400)
        .send("Invalid file type. Please upload an xlsx or csv file.");
    }

    // Transform data
    const transformedData = data.map((row) => {
      const { Longitude, Latitude, Date, Village, ...speciesData } = row;

      const parsedDate = parseDate(Date); // Parse the date using the updated function
      if (!parsedDate) {
        console.error("Invalid date format:", Date);
      }

      return {
        longitude: parseFloat(Longitude), // Parse Longitude to float
        latitude: parseFloat(Latitude), // Parse Latitude to float
        date: parsedDate || new Date(), // Use parsed date or the current date if invalid
        village: Village || null, // Set to null if Village is missing
        species: speciesData, // Directly store species data as an object (Mixed type)
      };
    });

    // Save the transformed data to the database
    await SpeciesData.insertMany(transformedData);

    // Send success response
    return res.status(200).send("File uploaded and data saved successfully.");
  } catch (error) {
    console.error("Error uploading species data:", error);
    return res.status(500).send("Internal server error.");
  }
};
export const getLogsByUserIdWithUser = async (req, res) => {
  try {
    const { userid } = req.body;
    console.log(userid);

    // Fetch logs sorted by `createdAt` in ascending order
    const logs = await Log.find({ userId: userid }).sort({ createdAt: 1 });

    res.status(200).json({ data: logs });
  } catch (error) {
    console.error("Error fetching logs with user data:", error);
    res.status(500).json({ message: "Failed to fetch logs", error });
  }
};

export const otherDataUpload = async (req, res) => {
  try {
    const {
      date,
      latitude,
      longitude,
      depth,
      species,
      sea,
      state,
      userId,
      dataType,
      total_weight,
    } = req.body;

    // Validate required fields
    if (!date || !latitude || !longitude || !species || !userId || !dataType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let dataId = generateRandomId();
    console.log(dataId);

    // Create new catch entry
    const newCatch = new Catch({
      date,
      latitude,
      longitude,
      depth,
      species,
      sea,
      state,
      userId,
      dataType,
      total_weight,
      dataId,
    });

    const logData = {
      userId,
      dataType,
      fileType: "manual",
      dataId, // Include fileType here
    };

    // Comment out database insertion for debugging or re-enable as needed
    try {
      await newCatch.save();
      await Log.create(logData);
      res.status(200).json({
        message: "Data uploaded successfully.",
      });
    } catch (dbError) {
      res.status(500).json({
        message: "Error inserting data into database",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({
      message: "Error uploading data.",
      error: error.message,
    });
  }
};

export const getDataByDataId = async (req, res) => {
  try {
    const { dataId } = req.params;

    // Validate required field
    if (!dataId) {
      return res.status(400).json({ message: "dataId is required." });
    }

    // Find the catch data by dataId
    const catchData = await Catch.findOne({ dataId });

    // If no data found
    if (!catchData) {
      return res.status(404).json({ message: "Data not found." });
    }

    // Respond with the data
    res.status(200).json({
      message: "Data fetched successfully.",
      data: catchData,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({
      message: "Error fetching data.",
      error: error.message,
    });
  }
};

export const getLogsByDataType = async (req, res) => {
  try {
    const { dataType } = req.body; // Specify the dataType as "other"
    console.log(dataType);

    // Fetch logs with the specified dataType
    const logs = await Log.find({ dataType })
      .sort({ uploadTimestamp: -1 }) // Sort by the latest uploadTimestamp
      .limit(5) // Limit to the latest 10 logs
      .populate({
        path: "userId", // Populate the userId field with user data
        select: "username", // Only select the username field from the User model
      });

    // If no logs found
    if (!logs.length) {
      return res
        .status(404)
        .json({ message: "No logs found for dataType 'other'." });
    }

    // Respond with the logs
    res.status(200).json({
      message: "Logs fetched successfully.",
      logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    res.status(500).json({
      message: "Error fetching logs.",
      error: error.message,
    });
  }
};

export const getUniqueSpeciesNames = async (req, res) => {
  try {
    // Aggregate to flatten the species array and get unique species names
    const uniqueSpecies = await Catch.aggregate([
      { $unwind: "$species" }, // Unwind the species array to make it a flat list
      { $group: { _id: "$species.name" } }, // Group by the species name and get unique names
      { $project: { _id: 0, name: "$_id" } }, // Format the output to show just the species names
    ]);

    // Extract species names into an array
    const speciesNames = uniqueSpecies.map((species) => species.name);

    // Return the unique species names as a response
    res.status(200).json({
      success: true,
      species: speciesNames, // Return an array of species names
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Required Imports

// Controller to get logs for a specific user
export const getDataStatus = async (req, res) => {
  const { userId } = req.params;
  console.log("userId", userId);
  try {
    // Find all logs associated with the userId
    const logs = await Log.find({ userId });

    if (!logs.length) {
      return res.status(404).json({ message: "No logs found for this user" });
    }

    // Map the logs to extract necessary fields (dataId, dataStatus, and uploadTimestamp)
    const result = logs.map((log) => ({
      dataId: log.dataId,
      dataStatus: log.dataStatus,
      uploadedAt: log.uploadTimestamp, // Included uploaded date and time
    }));

    // Send the result back to the client
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
