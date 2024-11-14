import mongoose from 'mongoose';

const researchCruiseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cruiseName: { type: String, required: true },
    cruiseId: { type: String, required: true },
    researchInstitution: { type: String, required: true },
    cruiseArea: { type: String, required: true },
    objectiveOfCruise: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
});

export default mongoose.model("ResearchCruise", researchCruiseSchema);
