
import mongoose from "mongoose";

// Schema for species details within each fishing record
const speciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Species name is mandatory
    trim: true, // Ensures any leading/trailing spaces are removed
  },
  catch_weight: {
    type: Number,
    default: null, // Default to null if catch weight is not provided
  },
});

// Main schema for storing fishing data
const ValidatedCatchSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true, // Fishing date is mandatory
    },
    latitude: {
      type: Number,
      required: true, // Latitude is mandatory
    },
    longitude: {
      type: Number,
      required: true, // Longitude is mandatory
    },
    depth: {
      type: Number,
      default: null, // Depth can be null if not provided
    },
    species: [speciesSchema], // Array of species caught in this fishing event
    sea: {
      type: String,
      required: null, // Sea name is mandatory
    },
    state: {
      type: String,
      required: null, // State name is mandatory
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the data
      required: true,
    },

    dataId: {
      type: String,
      required: true, // Unique identifier for this batch of data
    },

    total_weight: {
      type: Number,
      default: null, // Total weight of the catch, can be null
    },
    tag: {
      type: String,
      enum: ["abundance", "occurrence"], // Defines if data is of type "abundance" or "occurrence"
      required: true, // Indicates the type of data
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp to current date
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

// Export the model for the fishing data schema
export default mongoose.model("ValidatedCatch", ValidatedCatchSchema);
