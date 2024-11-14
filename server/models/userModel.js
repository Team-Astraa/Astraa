// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB auto-generates ObjectId
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    role: { 
        type: String, 
        required: true, 
        enum: ["admin", "user"], // Primary roles
    },
    userType: {
        type: String,
        enum: ["fisherman", "industry-collaborators", "research_cruises", "research_institute"],
        required: function () { return this.role === "user"; } // Only required if role is 'user'
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
});

export default mongoose.model("User", userSchema);
