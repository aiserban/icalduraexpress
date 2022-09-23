import Issue from "../data/Issue";
import { IssueModel } from "./schemas/issueSchema";
import {startOfDay, endOfDay} from 'date-fns';

class Db {
    saveIfNotExist(issue: Issue) {
        IssueModel.find({
            district: issue.district,
            street: issue.street,
            dateAdded: {
                $gte: startOfDay(issue.dateAdded),
                $lte: endOfDay(issue.dateAdded)
            },
            blocks: issue.blocks,
            issueType: issue.issueType
        }).then((results) => {
            if (results.length === 0) {
                let newIssue = new IssueModel(issue);
                newIssue.save()
            }
        })
    }

    async clearDb(){
        await IssueModel.deleteMany({});
        console.log('--- CLEARED DOWN DATABASE ---');
    }
}

export default new Db();