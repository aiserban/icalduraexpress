import Issue from "../data/Issue";
import { IssueModel } from "../schemas/issueSchema";
import {startOfDay, endOfDay} from 'date-fns';

class Db {
    saveIfNotExist(issue: Issue) {
        IssueModel.find({
            district: issue.district,
            street: issue.street,
            dateAdded: {
                $gte: startOfDay(issue.dateAdded),
                $lt: endOfDay(issue.dateAdded)
            },
            blocks: issue.blocks,
            issueType: issue.issueType
        }).then((results) => {
            results.length;
        })
    } 
}

export default new Db();