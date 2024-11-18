import mongoose from "mongoose";

// Schema for Species data in the cluster
const ClusteredSpeciesSchema = new mongoose.Schema({
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

// Schema for validated data
const ValidatedCatchSchema = new mongoose.Schema(
  {
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
      type: [ClusteredSpeciesSchema], // Array of species objects
      required: true, // At least one species entry is required
    },
    total_weight: {
      type: Number,
      default: 0, // Default total weight to 0
    },
    verified_date: {
      type: Date,
      required: true, // The date when this data was verified
    },
    verifier_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the verifier (admin/user) who validated the data
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt fields
  }
);

const ValidatedCatch = mongoose.model("ValidatedCatch", ValidatedCatchSchema);

export default ValidatedCatch;
