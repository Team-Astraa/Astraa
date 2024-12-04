const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  catch_weight: { type: Number, required: true },
});

const abundanceSchema = new mongoose.Schema({
  tag: { type: String, enum: ["abundance"], required: true }, // Tag specifically for abundance
  date: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  species: [speciesSchema], // Array of species objects
  total_weight: { type: Number, required: true },
  depth: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Used to indicate if data is verified
});

const Abundance = mongoose.model("Abundance", abundanceSchema);

module.exports = Abundance;
