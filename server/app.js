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
} from "./controller/admin-controller.js";
import { uploadCSV } from "./controller/userController.js";
import { updateUser } from "./controller/userUpdate.js";
import {
  getFilteredCatches,
  getUnique,
} from "./controller/scientist-controller.js";

// Configurations
import { cloudinaryConnect, cloudinaryStorage } from "./Config/Cloudinary.js";
import localUpload from "./Config/Multerconfig.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/SIH")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Cloudinary Configuration
cloudinaryConnect();
const cloudinaryUpload = multer({ storage: cloudinaryStorage });

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

// Local Upload Directory Configuration
const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

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

// User Update Details Routes
app.put("/user-update/:userType/:userId", updateUser);

// Password Update Route
app.put("/user/Password-update", changePassword);

// Scientist Routes
app.get("/scientist/unique-species", getUnique);
app.post("/scientist/filter-data", getFilteredCatches);

// Upload Routes
app.post("/upload/local", localUpload.single("file"), (req, res) => {
  try {
    console.log("Uploaded File (Local):", req.file);
    res.status(200).send("File uploaded successfully to local storage!");
  } catch (error) {
    console.error("Error during local upload:", error.message);
    res.status(400).send(error.message);
  }
});

app.post("/upload/cloudinary", cloudinaryUpload.single("file"), (req, res) => {
  try {
    console.log("Uploaded File (Cloudinary):", req.file);
    res.status(200).send("File uploaded successfully to Cloudinary!");
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);
    res.status(400).send(error.message);
  }
});

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
app.post("/upload", localUpload.single("file"), uploadCSV);

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
