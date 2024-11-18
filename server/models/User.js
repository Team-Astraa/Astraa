// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }, // Store hashed password
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "scientist"], // Primary roles
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
  },
  userType: {
    type: String,
    enum: [
      "fisherman",
      "industry-collaborators",
      "research_cruises",
      "research_institute",
    ],
    required: function () {
      return this.role === "user";
    }, // Only required if role is 'user'
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

export default mongoose.model("User", userSchema);
