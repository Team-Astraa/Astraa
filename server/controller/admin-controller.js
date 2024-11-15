// adminRoutes.js
import express from 'express';
import User from '../models/User'; // Import the User model

const router = express.Router();

// Get users by userType
router.get('/users', async (req, res) => {
    const { userType } = req.query; // Get userType from query parameters

    if (!userType) {
        return res.status(400).json({ message: "User type is required" });
    }

    try {
        // Fetch users by userType
        const users = await User.find({ userType })
            .populate('userDetails'); // Optionally, populate related details (like Fisherman, etc.)
        
        if (!users.length) {
            return res.status(404).json({ message: `No users found for ${userType}` });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

export default router;
