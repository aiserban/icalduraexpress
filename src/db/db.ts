import { Issue } from "../service/data/Issue";
import { IIssue, IssueModel } from "./schemas/issueSchema";
import { startOfDay, endOfDay } from 'date-fns';
import mongoose, { mongo } from "mongoose";
import { AppConfig } from "../../app.config";

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        await mongoose.connect(`mongodb://${AppConfig.mongoUri}:${AppConfig.mongoPort}/icaldura`)
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
            { $project: { street: '$_id.street', roadType: '$_id.roadType', streetName: '$_id.streetName', _id: 0 } },
            { $sort: { street: 1 } }
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
     * Get the list of issues per day for a particular block
     * @param street
     * @param block
     * @param limit
     * @returns
     */
    async getHistoricalDataForBlock(street: string, block: string, from: Date, limit: number = 30): Promise<{ dateAdded: Date, issueType: string }[] | void> {
        return IssueModel.aggregate([
            { $match: { $and: [{ street: street }, { blocks: block }, { dateAdded: { $gte: from } }] } },
            { $project: { dateAdded: { $dateToString: { format: '%Y-%m-%d', date: '$dateAdded' } }, issueType: '$issueType' } },
            { $group: { _id: { dateAdded: '$dateAdded', issueType: '$issueType' } } },
            { $project: { dateAdded: '$_id.dateAdded', issueType: '$_id.issueType', _id: 0 } },
            { $sort: { dateAdded: -1 } },
            { $limit: limit }
        ]).then(results => {
            if (results.length > 0) {
                const mapped = results.map(item => {
                    return ({ issueType: item.issueType, dateAdded: new Date(item.dateAdded) })
                })
                return mapped;
            }
        }).catch(err => {
            console.log(err)
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
            { $match: { $and: [{ street: street }, { dateAdded: { $gte: fromDate } }, { dateAdded: { $lte: toDate } }] } },
            { $unwind: '$blocks' },
            { $group: { _id: '$blocks', dateAdded: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$dateAdded' } } } } },
            { $project: { block: '$_id', issueCount: { $size: '$dateAdded' }, noIssueCount: { $subtract: [{ $dateDiff: { startDate: fromDate, endDate: toDate, unit: 'day' } }, { $size: '$dateAdded' }] }, _id: false } },
            { $sort: { 'issueCount': -1 } }
        ]).then(results => {
            return results as [{ _id: string, block: string, issueCount: number, noIssueCount: number }]
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * Get the top ten blocks (including streets) with the most issues
     * @returns the street and block combination with the most issues recorded
     */
    async getTopBlocks(limit: number): Promise<[{ street: string, block: string, count: number }] | void> {
        return IssueModel.aggregate([
            { $unwind: '$blocks' },
            { $group: { _id: { street: '$street', block: '$blocks' }, datesAdded: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$dateAdded' } } } } },
            { $project: { street: '$_id.street', block: '$_id.block', count: { $size: '$datesAdded' } } },
            { $sort: { 'count': -1 } },
            { $limit: limit }
        ]).then(results => {
            return results as [{ street: string, block: string, count: number }]
        }).catch(err => {
            console.log(err)
        })
    }

    async clearDb() {
        await IssueModel.deleteMany({});
        console.log('--- DATABASE CLEARED ---');
    }
}

export const db = new Database();