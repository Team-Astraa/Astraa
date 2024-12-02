

import xlsx from "xlsx";
import fs from "fs";
import csv from "csv-parser";
import { getDistance } from "geolib";
import cloudinary from "../cloudinaryConfig.js"; // Import Cloudinary config

import Catch from "../models/FishCatchData.js";
import Log from "../models/logSchema.js";

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

const cleanData = (data, userId) => {
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

    //old
    // const depth = item.DEPTH
    // ? parseFloat(item.DEPTH.replace(/[^0-9.]/g, ""))
    // : null;

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

    return {
      date, // Use the parsed date
      latitude,
      longitude,
      depth,
      species,
      sea,
      state,
      userId,
      verified: false,
      total_weight: parseFloat(item.TOTAL_CATCH),
    };
  });
};


export const uploadCSV = async (req, res) => {
  console.log("Controller reaching");

  try {
    const { userId } = req.body; // Get user ID from request body
    const file = req.file; // Get the file from the request

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }

    // Upload the file to Cloudinary
    const cloudinaryResult = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "SIH", // Customize the folder as needed
    });

    console.log("File uploaded to Cloudinary:", cloudinaryResult);

    const fileUrl = cloudinaryResult.secure_url; // Get the file URL from Cloudinary
    let data = []; // Array to hold file data

    // Delete the file from local storage after upload
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

    // Parse the file (CSV or XLSX)
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse XLSX file
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON
    } else if (file.mimetype === "text/csv") {
      // Parse CSV file
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          data = results;
          await insertDataToDB(data, fileUrl, userId, res); // Insert data into the DB
        });
      return; // Exit function to process CSV asynchronously
    } else {
      return res.status(400).json({
        message: "Invalid file type. Please upload an Excel or CSV file.",
      });
    }

    // Insert data into the database (for Excel files)
    await insertDataToDB(data, fileUrl, userId, res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

// db.js
export const insertDataToDB = async (data, fileUrl, userId, res) => {
  try {
    // Assuming you have a MongoDB model to insert data
    const DocumentModel = require("./models/DocumentModel");

    // Insert data and file URL into your database
    await DocumentModel.create({
      userId,
      fileUrl,
      data, // Parsed data
    });

    res
      .status(200)
      .json({ message: "File uploaded and data inserted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error inserting data into the database",
      error: error.message,
    });
  }
};

// Upload CSV/Excel File and Save to Cloudinary
// export const uploadCSV = async (req, res) => {

//   console.log("controller reaching")

//   try {

//     console.log("going in try")

//     const { userId } = req.body; // Get user ID from request body
//     const file = req.file; // Get file from request

//     if (!file) {
//       return res.status(400).json({ message: "No file provided." });
//     }

//     const cloudinaryResult = await cloudinary.v2.uploader.upload(file.path, {
//       resource_type: 'raw',
//       folder: 'SIH',
//     }).catch(error => {
//       console.error("Error uploading to Cloudinary:", error.message);
//       return res.status(500).json({ message: "Error uploading to Cloudinary", error: error.message });
//     });

//     console.log("HI", cloudinaryResult)

//     const fileUrl = cloudinaryResult.secure_url; // Get URL of uploaded file
//     let data = []; // Array to hold file data

//     const fs = require("fs");
//     // Delete the file from local storage after upload
//     fs.unlink(file.path, (err) => {
//       if (err) {
//         console.error("Error deleting local file:", err);
//       }
//     });

//     // Parse Excel or CSV
//     if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//       // Parse Excel file
//       const workbook = xlsx.readFile(file.path);
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       data = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON
//     } else if (file.mimetype === "text/csv") {
//       // Parse CSV file
//       const results = [];
//       fs.createReadStream(file.path)
//         .pipe(csv())
//         .on("data", (row) => {
//           results.push(row);
//         })
//         .on("end", async () => {
//           data = results;
//           await insertDataToDB(data, fileUrl, userId, res);
//         });
//       return; // Exit function to process CSV asynchronously
//     } else {
//       return res.status(400).json({
//         message: "Invalid file type. Please upload an Excel or CSV file.",
//       });
//     }

//     // Insert data into the database for Excel
//     await insertDataToDB(data, fileUrl, userId, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error uploading file", error: error.message });
//   }
// };

// Insert Data into Database
// const insertDataToDB = async (data, fileUrl, userId, res) => {
//   try {
//     const catchData = data.map((item) => ({
//       userId,
//       data: item,
//       fileUrl,
//     }));

//     await Catch.insertMany(catchData); // Save data to MongoDB
//     res.status(200).json({
//       message: "File uploaded successfully and data saved.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error inserting data into database",
//       error: error.message,
//     });
//   }
// };
