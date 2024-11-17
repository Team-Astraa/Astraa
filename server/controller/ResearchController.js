import Catch from "../models/FishCatchData.js";
export const getCatchDataGroupedByUser = async (req, res) => {
    try {
      const { userId } = req.body;
      console.log(userId);
       // Assuming the userId is passed as a URL parameter
  
      // Use new to instantiate the ObjectId
      const objectId = new mongoose.Types.ObjectId(userId);
  
      // Aggregate query to filter by userId and then group the data
      const catchData = await Catch.aggregate([
        { $match: { userId: objectId } }, // Match the userId passed in the request
        { 
          $group: {
            _id: "$userId",
            catches: { $push: "$$ROOT" } // Group catches by userId
          }
        }
      ]);
  
      if (catchData.length === 0) {
        return res.status(404).json({ message: "No catch data found for this user" });
      }
  
      return res.status(200).json(catchData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching data", error: error.message });
    }
  };