import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import xlsx from 'xlsx';
import csv from 'csv-parser';
import fs from 'fs';
import Catch from '../models/FishCatchData.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });
  const upload = multer({ storage: storage });


  app.post('/upload/:adminId', upload.single('file'), async (req, res) => {
    try {
      const { adminId } = req.params; // Get admin ID from URL params
      const file = req.file;
      const filePath = file.path;
  
      let data = [];
  
      // Check if the file is Excel or CSV
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Parse Excel file
        const workbook = xlsx.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const sheet = workbook.Sheets[sheet_name_list[0]]; // Assuming first sheet
        data = xlsx.utils.sheet_to_json(sheet);
      } else if (file.mimetype === 'text/csv') {
        // Parse CSV file
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            data = results;
          });
      }
  
      // Extract data and store in MongoDB with pending verification
      const catches = data.map(item => {
        const species = [];
        const speciesData = item.species.split(',');
        speciesData.forEach(s => {
          const match = s.match(/([A-Za-z\s]+)\((\d+)\)/);
          if (match) {
            species.push({
              name: match[1].trim(),
              catch_weight: parseInt(match[2].trim())
            });
          }
        });
  
        return {
          date: new Date(item.date),
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          depth: item.depth,
          species,
          adminId, // Store admin ID who is verifying the data
          verified: false // Mark as not verified initially
        };
      });
  
      // Insert data into MongoDB with pending status
      await Catch.insertMany(catches);
  
      res.status(200).json({ message: 'File uploaded and data is awaiting verification by admin.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  });