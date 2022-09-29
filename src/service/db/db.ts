import Issue from "../data/Issue";
import { IIssue, IssueModel } from "./schemas/issueSchema";
import { startOfDay, endOfDay } from 'date-fns';
import mongoose from "mongoose";

class Db {
    constructor() {
        this.connect();
    }

    async connect() {
        await mongoose.connect('mongodb://localhost:27017/icaldura')
            .then(() => {
                console.log('--- DATABASE CONNECTED ---')
            })
            .catch((err) => {
                console.log(`--- ISSUES CONNECTING ---\n${err}`);
            })
    }

    async addIfNotExists(issue: Issue) {
        await IssueModel.find({
            district: issue.district,
            street: issue.street,
            dateAdded: {
                $gte: startOfDay(issue.dateAdded),
                $lte: endOfDay(issue.dateAdded)
            },
            blocks: issue.blocks
        }).then((results) => {
            if (results.length === 0) {
                let newIssue = new IssueModel(issue);
                newIssue.save()
            }
        }).catch(err => {
            console.log(err);
        });
    }

    async findMany(query: {}): Promise<(mongoose.Document<unknown, any, IIssue> & IIssue & {
        _id: mongoose.Types.ObjectId;
    })[] | void> {
        return   IssueModel.find(query).then(results => {
            return results;
        }).catch(err => {
            console.log(err);
        })

    }

    async clearDb() {
        await IssueModel.deleteMany({});
        console.log('--- DATABASE CLEARED ---');
    }
}

export default new Db();