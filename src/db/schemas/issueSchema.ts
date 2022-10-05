import mongoose from "mongoose";

export interface IIssue {
    district: string;
    roadType: string;
    streetName: string;
    street: string;
    blocks: Array<string>;
    issueType: string;
    description: string;
    resolutionTime: Date;
    dateAdded: Date;
}

export const issueSchema = new mongoose.Schema<IIssue>({
    district: { type: String },
    roadType: { type: String },
    streetName: { type: String },
    street: { type: String },
    blocks: { type: [String] },
    issueType: { type: String },
    description: { type: String },
    resolutionTime: { type: Date },
    dateAdded: { type: Date }
}, { collection: 'issues', collation: { locale: 'simple', strength: 1, caseLevel: true } })

issueSchema.index({street: 1, blocks: 1});
issueSchema.index({street: 'text'});
issueSchema.index({blocks: 1 });

export const IssueModel = mongoose.model<IIssue>('IssueModel', issueSchema);