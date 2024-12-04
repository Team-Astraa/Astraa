// import mongoose from "mongoose";

// // Schema for Species data in the cluster
// const ClusteredSpeciesSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Species name is mandatory"], // Error message if missing
//     trim: true,
//   },
//   catch_weight: {
//     type: Number,
//     default: null, // Allow null values if not provided
//     validate: {
//       validator: (v) => v === null || !isNaN(v), // Validate as a number or null
//       message: "Catch weight must be a valid number or null.",
//     },
//   },
// });

// // Schema for validated data
// const ValidatedCatchSchema = new mongoose.Schema(
//   {
//     date: {
//       type: Date,
//       required: false, // Make optional for now
//       validate: {
//         validator: (v) => !v || !isNaN(new Date(v).getTime()), // Validate as a valid date or allow null
//         message: "Invalid date format.",
//       },
//       default: null, // Default to null if not provided
//     },
//     latitude: {
//       type: Number,
//       required: false, // Make optional for now
//       validate: {
//         validator: (v) => !v || (!isNaN(v) && v >= -90 && v <= 90), // Validate latitude or allow null
//         message: "Latitude must be a valid number between -90 and 90.",
//       },
//       default: null,
//     },
//     longitude: {
//       type: Number,
//       required: false, // Make optional for now
//       validate: {
//         validator: (v) => !v || (!isNaN(v) && v >= -180 && v <= 180), // Validate longitude or allow null
//         message: "Longitude must be a valid number between -180 and 180.",
//       },
//       default: null,
//     },
//     depth: {
//       type: Number,
//       default: null, // Allow null if depth is not provided
//       validate: {
//         validator: (v) => v === null || !isNaN(v), // Validate depth as a number or null
//         message: "Depth must be a valid number or null.",
//       },
//     },
//     species: {
//       type: [ClusteredSpeciesSchema], // Array of species objects
//       required: false, // Make optional for now
//       validate: {
//         validator: (v) => Array.isArray(v), // Ensure species is an array if provided
//         message: "Species must be an array.",
//       },
//       default: [], // Default to an empty array if not provided
//     },
//     total_weight: {
//       type: Number,
//       default: 0, // Default to 0 if not provided
//       validate: {
//         validator: (v) => !isNaN(v), // Ensure it's a valid number
//         message: "Total weight must be a valid number.",
//       },
//     },
//     verified_date: {
//       type: Date,
//       required: false, // Make optional for now
//       validate: {
//         validator: (v) => !v || !isNaN(new Date(v).getTime()), // Validate as a valid date or allow null
//         message: "Invalid verified date format.",
//       },
//       default: null, // Default to null if not provided
//     },
//     verifier_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: false, // Make optional for now
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true, // Automatically add createdAt and updatedAt
//   }
// );

// const ValidatedCatch = mongoose.model("ValidatedCatch", ValidatedCatchSchema);

// export default ValidatedCatch;

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
