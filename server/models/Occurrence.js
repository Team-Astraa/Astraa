const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  catch_weight: { type: Number, required: true },
});

const occurrenceSchema = new mongoose.Schema({
  tag: { type: String, enum: ["occurrence"], required: true }, // Tag specifically for occurrence
  date: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  species: [speciesSchema], // Array of species objects
  total_weight: { type: Number, required: true },
  depth: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Used to indicate if data is verified
});

const Occurrence = mongoose.model("Occurrence", occurrenceSchema);

module.exports = Occurrence;
