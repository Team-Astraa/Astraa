import mongoose from 'mongoose';

const researchInstituteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instituteName: { type: String, required: true },
    instituteCode: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    researchFocus: { type: String, required: true },
});

export default mongoose.model("ResearchInstitute", researchInstituteSchema);
