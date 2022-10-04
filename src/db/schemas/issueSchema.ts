import mongoose from "mongoose";

export interface IIssue {
    district: string;
    roadType: string;
    street: string;
    fullStreet: string;
    blocks: Array<string>;
    issueType: string;
    description: string;
    resolutionTime: Date;
    dateAdded: Date;
}

export const issueSchema = new mongoose.Schema<IIssue>({
    district: { type: String },
    roadType: { type: String },
    street: { type: String, index: 'text' },
    fullStreet: { type: String },
    blocks: { type: [String] },
    issueType: { type: String },
    description: { type: String },
    resolutionTime: { type: Date },
    dateAdded: { type: Date }
}, { collection: 'issues' })

export const IssueModel = mongoose.model<IIssue>('IssueModel', issueSchema);