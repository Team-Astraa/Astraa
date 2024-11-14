import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Fisherman from '../models/Fisherman.js';
import IndustryCollaborator from '../models/IndustryCollaborator.js';
import ResearchCruise from '../models/ResearchCruise.js';
import ResearchInstitute from '../models/ResearchInstitute.js';

export const signUp = async (req, res) => {
    const { email, password, role, userType, additionalDetails } = req.body;

    // Validate the request body
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required" });
    }

    // If role is 'user', validate userType-specific details
    if (role === 'user') {
        if (!userType) {
            return res.status(400).json({ message: "User type is required for user role" });
        }
        if (!additionalDetails) {
            return res.status(400).json({ message: "Additional details are required for the selected user type" });
        }
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            userType,
        });

        // Save the user
        await newUser.save();

        // Create user-specific details
        let userDetails;
        switch (userType) {
            case "fisherman":
                userDetails = new Fisherman({
                    userId: newUser._id,
                    ...additionalDetails, // Fisherman-specific details
                });
                await userDetails.save();
                break;
            case "industry-collaborators":
                userDetails = new IndustryCollaborator({
                    userId: newUser._id,
                    ...additionalDetails, // Industry-collaborator-specific details
                });
                await userDetails.save();
                break;
            case "research_cruises":
                userDetails = new ResearchCruise({
                    userId: newUser._id,
                    ...additionalDetails, // Research-cruise-specific details
                });
                await userDetails.save();
                break;
            case "research_institute":
                userDetails = new ResearchInstitute({
                    userId: newUser._id,
                    ...additionalDetails, // Research-institute-specific details
                });
                await userDetails.save();
                break;
            default:
                break;
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send response
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
