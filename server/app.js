import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import aws from "aws-sdk";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

// Controllers
import {
  getusername,
  login,
  signUp,
  changePassword,
} from "./controller/authController.js";
// import admin from "firebase-admin";
// import { assert } from "console";
// import serviceAccountKey from "./medium-clone-2b0eb-firebase-adminsdk-4m109-6a21350bd0.json" assert { type: "json" };

import { downloadFile } from "./controller/fileController.js";
import {
  getCatchDataGroupedByUser,
  getdataUploaduser,
  getDetailsData,
  getUnverifiedUser,
  verifyUser,
  updateCatchData,
  validateCatchData,
  getUniqueSpeciesCount,
  getUserTypeAndCount,
  getLatestLogs,
  acceptDataLog,
  rejectDataLog,
} from "./controller/admin-controller.js";

import { autoCheckData } from "./controller/DataValidationData.js";
import {
  getLogsByUserIdWithUser,
  uploadCSV,
} from "./controller/userController.js";

import { uploadCSV2 } from "./controller/userControllerNew.js";
import {
  getAllUsers,
  getDataByUserAndTag,
  getUsersByTag,
} from "./controller/admin-get-dataNew.js";

import { updateUser } from "./controller/userUpdate.js";
import {
  getFilteredCatches,
  getUnique,
} from "./controller/scientist-controller.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  // .connect(
  //     "mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/SIH"
  // )
  .connect(
    // "mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/SIH"
    "mongodb+srv://deshmusn:sneha2812@cluster0.x960yiu.mongodb.net/SIH"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// AWS S3 Configuration
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Utilities
const generateUploadUrl = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
  return s3.getSignedUrlPromise("putObject", {
    Bucket: "medium-blog-clone",
    Key: imageName,
    Expires: 11000,
    ContentType: "image/jpeg",
  });
};

const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });
// Routes

// User Authentication Routes
app.post("/signup", signUp);
app.post("/login", login);

// Admin Routes
app.post("/admin/getUnverifiesUsers", getUnverifiedUser);
app.post("/admin/verifyUser", verifyUser);
app.post("/admin/get-detail-data", getDetailsData);
app.post("/admin/get-fish-data", getCatchDataGroupedByUser);
app.get("/admin/get-data-upload-users", getdataUploaduser);
app.put("/admin/update-catch-data/:id", updateCatchData);
app.get("/admin/usernames", getusername);
app.post("/admin/validate-catch", validateCatchData);
app.get("/admin/get-unique-fish-count", getUniqueSpeciesCount);
app.get("/admin/get-userType-Count", getUserTypeAndCount);
app.get("/admin/get-latest-logs", getLatestLogs);
app.post("/admin/reject-log-data", rejectDataLog);
app.post("/admin/accept-log-data", acceptDataLog);
app.post("/admin/autoCheck-fishing-data", autoCheckData);

// User Update Details Routes
app.put("/user-update/:userType/:userId", updateUser);
app.get("/download/:type", downloadFile);
app.post("/user/get-log-data-by-id", getLogsByUserIdWithUser);

// Password Update Route
app.put("/user/Password-update", changePassword);

// Scientist Routes
app.get("/scientist/unique-species", getUnique);
app.post("/scientist/filter-data", getFilteredCatches);

// Upload Routes
app.get("/get-upload-url", async (req, res) => {
  try {
    const uploadUrl = await generateUploadUrl();
    res.status(200).json({ uploadUrl });
  } catch (err) {
    console.error("Error generating upload URL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// CSV Upload Route
// app.post("/upload", upload.single("file"), uploadCSV);

///new code aaded from here wjil other codes are preserved
//new upload csv routes
app.post("/upload", upload.single("file"), uploadCSV2);

// Route to fetch users by tag
app.get("/admin/users-by-tag/:tag", getUsersByTag);

// Route to fetch data by userId and tag
app.get("/admin/data/:userId/:tag", getDataByUserAndTag);

// Optional: Route to fetch all users who uploaded any data
app.get("/admin/all-users", getAllUsers);

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
