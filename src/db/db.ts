import Issue from "../service/data/Issue";
import { IIssue, IssueModel } from "./schemas/issueSchema";
import { startOfDay, endOfDay } from 'date-fns';
import mongoose, { mongo } from "mongoose";

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

    isConnected(): boolean {
        return mongoose.connection.readyState === 1 ? true : false
    }

    isConnecting(): boolean {
        return mongoose.connection.readyState === 2 ? true : false
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
        return IssueModel.find(query).then(results => {
            return results;
        }).catch(err => {
            console.log(err);
        })
    }

    async findDistinct(field: string, query: {}): Promise<string[] | void> {
        return IssueModel.distinct(field, query).then(results => {
            return results;
        }).catch(err => {
            console.log(err)
        })
    }

    /**
     *
     * @param street street name without the type (ex. 'Delfinului)
     * @param from starting date for the data
     * @returns mongo _id, block, list of dates with issues
     */
    async getChartData(street: string, from: Date): Promise<[string, string, Date[]] | void> {
        return IssueModel.aggregate([
            { $match: { street: street } },
            { $match: { dateAdded: { $gte: new Date(from) } } },
            { $unwind: '$blocks' },
            { $project: { blocks: '$blocks', dateAdded: { $dateToString: { format: '%Y-%m-%d', date: '$dateAdded' } } } },
            { $group: { _id: '$blocks', dateAdded: { $addToSet: { $toDate: '$dateAdded' } } } },
            { $project: { block: '$_id', datesAdded: '$dateAdded', _id: false } }
        ]).then((results) => {
            return (results as [string, string, Date[]])
        }).catch((err) => {
            console.log(err);
        })
    }

    async getChartDataWithCounts(street: string, fromDate: Date, toDate: Date): Promise<[{_id: string, block: string, issueCount: number, noIssueCount: number}] | void> {
        return IssueModel.aggregate([
            { $match: { $and: [{ street: street }, { dateAdded: { $gte: fromDate } }, { dateAdded: { $lt: toDate } }] } },
            { $unwind: '$blocks' },
            { $group: { _id: '$blocks', dateAdded: { $addToSet: '$dateAdded' } } },
            { $project: { block: '$_id', issueCount: { $size: '$dateAdded' }, noIssueCount: { $subtract: [{ $dateDiff: { startDate: fromDate, endDate: toDate, unit: 'day' } }, { $size: '$dateAdded' }] }, _id: false } },
            { $sort: { 'issueCount': -1 }}
        ]).then(results => {
            return results as [{_id: string, block: string, issueCount: number, noIssueCount: number}]
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