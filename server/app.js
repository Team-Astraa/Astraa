import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import aws from "aws-sdk";
import { nanoid } from "nanoid";
import { signUp } from "./controller/authController.js";
import admin from "firebase-admin";
import serviceAccountKey from "./medium-clone-2b0eb-firebase-adminsdk-4m109-6a21350bd0.json" assert { type: "json" };

dotenv.config();
const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI) // Use environment variable for MongoDB URI
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// AWS S3 Configuration
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Route Handlers
app.get("/ping", (req, res) => {
  res.send("pong");
});

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

app.post("/signup", signUp);

app.get("/get-upload-url", async (req, res) => {
  try {
    const uploadUrl = await generateUploadUrl();
    res.status(200).json({ uploadUrl });
  } catch (err) {
    console.error("Error generating upload URL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
