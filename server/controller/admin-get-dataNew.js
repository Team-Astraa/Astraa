// controllers/dataController.js
import CatchData from "../models/FishcatchDataNew.js"

// Fetch distinct users grouped by tag
export const getUsersByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const users = await CatchData.find({ tag })
      .distinct("userId")
      .populate("userId", "name email"); // Assuming User schema has name/email
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch data by userId and tag
export const getDataByUserAndTag = async (req, res) => {
  const { userId, tag } = req.params;
  try {
    const data = await CatchData.find({ userId, tag });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all users who uploaded data (optional for overview)
export const getAllUsers = async (req, res) => {
  try {
    const users = await CatchData.find()
      .distinct("userId")
      .populate("userId", "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
