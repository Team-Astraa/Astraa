const mongoose = require('mongoose');

// Schema for the catch data
const catchSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  depth: { type: String, required: true },
  species: [{
    name: String,
    catch_weight: Number
  }],
  verified: { type: Boolean, default: false }, // Verification status
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the admin who verifies the data
});

const Catch = mongoose.model('Catch', catchSchema);

export default Catch;