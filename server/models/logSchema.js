import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileType: { type: String, required: true },  // Store the file type (e.g., CSV, Excel)
    uploadTimestamp: { type: Date, default: Date.now }, // Store the timestamp of upload
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;
