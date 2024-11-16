import xlsx from "xlsx";
import fs from "fs";
import csv from "csv-parser";

import Catch from "../models/FishCatchData.js";
// Helper function to clean and normalize data
const cleanData = (data, userId) => {
    return data.map((item) => {
      const species = [];
  
      // Check if MAJOR_SPECIES exists and process it
      if (item.MAJOR_SPECIES) {
        const speciesData = item.MAJOR_SPECIES.split(","); // Split by commas
        speciesData.forEach((s) => {
          const match = s.match(/([A-Za-z\s]+)\((\d+)\)/); // Regex to extract name and weight
          if (match) {
            // Add species with extracted name and weight
            species.push({
              name: match[1].trim().toLowerCase(),
              catch_weight: parseInt(match[2].trim()),
            });
          } else {
            // Add species with name only (no catch weight)
            species.push({
              name: s.trim().toLowerCase(),
              catch_weight: null, // Default value when weight is missing
            });
          }
        });
      }
  
      // Normalize depth values by removing non-numeric characters
      const depth = item.DEPTH ? parseFloat(item.DEPTH.replace(/[^0-9.]/g, "")) : null;
  
      return {
        date: new Date(item["FISHING Date"]), // Normalize date format
        latitude: parseFloat(item.SHOOT_LAT),
        longitude: parseFloat(item.SHOOT_LONG),
        depth,
        species, // Processed species array
        userId, // Attach admin ID to each record
        verified: false, // Default verification status
        total_weight : parseFloat(item.TOTAL_CATCH
        )
      };
    });
  };
  

export const uploadCSV = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;
    const filePath = file.path;

    let data = [];

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

      // Clean and normalize data
      data = cleanData(rawData, userId);
    } else if (file.mimetype === "text/csv") {
      // Parse CSV file
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          data = cleanData(results, userId);

          // Log data to console
          console.log("Parsed Data:", data);

          // Comment out database insertion for debugging or re-enable as needed
          try {
            await Catch.insertMany(data);
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
