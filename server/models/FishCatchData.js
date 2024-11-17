import mongoose from "mongoose";

const SpeciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Species name is mandatory
    trim: true,
  },
  catch_weight: {
    type: Number,
    default: null, // Default to null if catch weight is not provided
  },
});

const CatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true, // Date of the fishing activity is mandatory
  },
  latitude: {
    type: Number,
    required: true, // Latitude of fishing location is mandatory
  },
  longitude: {
    type: Number,
    required: true, // Longitude of fishing location is mandatory
  },
  depth: {
    type: Number,
    default: null, // Depth can be null if not available
  },
  species: {
    type: [SpeciesSchema], // Array of species objects
    required: true, // At least one species entry is required
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the admin who uploaded the data
    required: true,
    ref: "User", // Assumes there's an Admin model
  },
  verified: {
    type: Boolean,
    default: false, // Default to unverified
  },
  total_weight:{
    type:Number,
    default:0
  }
}, {
  timestamps: true, // Automatically include createdAt and updatedAt fields
});

const Catch = mongoose.model("Catch", CatchSchema);

export default Catch;


