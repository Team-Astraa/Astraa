// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import aws from "aws-sdk";
import { signUp } from "./controller/authController.js";
import admin from "firebase-admin";
dotenv.config();
const app = express();
import serviceAccountKey from "./medium-clone-2b0eb-firebase-adminsdk-4m109-6a21350bd0.json" assert { type: "json" };

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });

//setting s3 buckets
const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRETE_KEY,
  });
  
// Routes
app.get("/ping", (req, res) => {
  res.send("pong");
});

const generateUploadUrl = async () => {
    const date = new Date();
  
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
  
    return await s3.getSignedUrlPromise("putObject", {
      Bucket: "medium-blog-clone",
      Key: imageName,
      Expires: 1000,
      ContentType: "image/jpeg",
    });
  };

app.post("/signup" , signUp)
app.get("/get-upload-url", (req, res) => {
    generateUploadUrl()
      .then((url) => {
        return res.status(200).json({
          uploadUrl: url,
        });
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(500).json({
          error: err.message,
        });
      });
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
