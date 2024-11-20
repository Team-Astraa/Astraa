import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import aws from "aws-sdk";
import multer from "multer";
import { nanoid } from "nanoid";
import { getusername, login, signUp } from "./controller/authController.js";
import admin from "firebase-admin";
import { assert } from "console";
import serviceAccountKey from "./medium-clone-2b0eb-firebase-adminsdk-4m109-6a21350bd0.json" with { type: "json" };
import fs from "fs";
import path from "path";
import {
  getCatchDataGroupedByUser,
  getdataUploaduser,
  getDetailsData,
  getUnverifiedUser,
  verifyUser,
  updateCatchData,
  validatedCatchData,
} from "./controller/admin-controller.js";
import { uploadCSV } from "./controller/userController.js";
import { updateUser } from "./controller/userUpdate.js";
import { getFilteredCatches, getUnique } from "./controller/scientist-controller.js";



dotenv.config();
const app = express();
app.use(cors());

console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRETE_KEY);


// MongoDB Connection
mongoose
  //.connect(process.env.MONGODB_URI) // Use environment variable for MongoDB URI
  .connect("mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/SIH")
  
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// AWS S3 Configuration
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRETE_KEY,
});

// Route Handlers

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

// All users api
app.post("/upload", upload.single("file"), uploadCSV);

// auth api methods

app.post("/signup", signUp);
app.post("/login", login);

// admin api methods

app.post("/admin/getUnverifiesUsers", getUnverifiedUser);
app.post("/admin/verifyUser", verifyUser);
app.post("/admin/get-detail-data", getDetailsData);
app.post("/admin/get-fish-data", getCatchDataGroupedByUser);
app.get("/admin/get-data-upload-users", getdataUploaduser);
app.put("/admin/update-catch-data/:id", updateCatchData);
app.get("/admin/usernames", getusername);
app.post("/admin/validate-catch", validatedCatchData);

//user update-details routes
app.put("/user-update/:userType/:userId", updateUser);

app.get("/get-upload-url", async (req, res) => {
  try {
    const uploadUrl = await generateUploadUrl();
    res.status(200).json({ uploadUrl });
  } catch (err) {
    console.error("Error generating upload URL:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// scientist routes
app.get("/scientist/unique-species", getUnique);
app.post("/scientist/filter-data", getFilteredCatches);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
