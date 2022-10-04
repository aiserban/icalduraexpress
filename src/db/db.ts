import { Issue } from "../service/data/Issue";
import { IIssue, IssueModel } from "./schemas/issueSchema";
import { startOfDay, endOfDay } from 'date-fns';
import mongoose, { mongo } from "mongoose";

class Database {
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

    async findStreet(input: string): Promise<void | { roadType: string, street: string }[]> {
        let re = new RegExp(`.*${input}.*`, 'i');
        return await IssueModel.aggregate([
            { $match: { street: re } },
            { $limit: 50 },
            { $group: { _id: { street: '$street', roadType: '$roadType', streetName: '$streetName' } } },
            { $limit: 10 },
            { $project: { street: '$_id.street', roadType: '$_id.roadType', streetName: '$_id.streetName', _id: 0 } }
        ]).then(results => {
            return results as [{ street: string, roadType: string, streetName: string }]
        }).catch(err => {
            console.log(err);
        })
    }

    async addIfNotExists(issue: Issue) {
        await IssueModel.find({
            district: issue.district,
            roadType: issue.roadType,
            street: issue.street,
            streetName: issue.streetName,
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

    async findDistinct(field: string, query: {}): Promise<string[] | void> {
        return IssueModel.distinct(field, query).then(results => {
            return results;
        }).catch(err => {
            console.log(err)
        })
    }

    /**
     * Chart data with a list of blocks,
     * each block having an array of days where an issue was registered
     * @param street
     * @param from starting date for the data
     * @returns mongo _id, block, list of dates with issues
     */
    async getListOfIssuesPerBlock(street: string, from: Date): Promise<[string, string, Date[]] | void> {
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

    /**
     * Chart data with all blocks and the number of issues they each had in the given interval
     * along with the days where no issue was reported
     * @param street
     * @param fromDate
     * @param toDate
     * @returns
     */
    async getChartDataWithIssueCounts(street: string, fromDate: Date, toDate: Date): Promise<[{ _id: string, block: string, issueCount: number, noIssueCount: number }] | void> {
        return IssueModel.aggregate([
            { $match: { $and: [{ street: street }, { dateAdded: { $gte: fromDate } }, { dateAdded: { $lt: toDate } }] } },
            { $unwind: '$blocks' },
            { $group: { _id: '$blocks', dateAdded: { $addToSet: '$dateAdded' } } },
            { $project: { block: '$_id', issueCount: { $size: '$dateAdded' }, noIssueCount: { $subtract: [{ $dateDiff: { startDate: fromDate, endDate: toDate, unit: 'day' } }, { $size: '$dateAdded' }] }, _id: false } },
            { $sort: { 'issueCount': -1 } }
        ]).then(results => {
            return results as [{ _id: string, block: string, issueCount: number, noIssueCount: number }]
        }).catch(err => {
            console.log(err);
        })
    }


    /* ------ TOP
    db.issues.aggregate([
    {$match: { street: 'Constantin RadulescuMotru'}},
    { $unwind: '$blocks' },
    //    { $project: { block: '$blocks', street: '$street', dateAdded: { $dateToString: {format: '%Y-%m-%d', date: '$dateAdded'}}}},
    { $group: {_id: {street: '$street', block: '$blocks', dateAdded: { $dateToString: {format: '%Y-%m-%d', date: '$dateAdded'}}}, count: { $sum: 1 }}},
    { $sort: { count: -1 }}
    ])

    */

    async clearDb() {
        await IssueModel.deleteMany({});
        console.log('--- DATABASE CLEARED ---');
    }
}

export const db = new Database();