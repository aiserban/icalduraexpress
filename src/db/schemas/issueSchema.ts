import mongoose from "mongoose";


const issueSchema = new mongoose.Schema({
    district: String,
    roadType: String,
    street: String,
    blocks: Array,
    issueType: String,
    description: String,
    resolutionTime: Date,
    dateAdded: Date
})

export const IssueModel = mongoose.model('IssueModel', issueSchema);