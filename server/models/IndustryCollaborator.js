import mongoose from 'mongoose';

const industryCollaboratorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organisationName: { type: String, required: true },
    organisationType: { type: String, required: true },
    organisationContactNumber: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    contactPerson: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
    },
    dataContributionType: { type: String, required: true },
    geographicalFocusArea: { type: String, required: true },
});

export default mongoose.model("IndustryCollaborator", industryCollaboratorSchema);
