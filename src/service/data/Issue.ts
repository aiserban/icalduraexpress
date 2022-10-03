export class Issue {
    district: string = '';
    roadType: string = '';
    street: string = '';
    blocks: string[] = [];
    issueType: string = '';
    description: string = '';
    resolutionTime: Date = new Date();
    dateAdded: Date = new Date();

    constructor(
        district: string,
        roadType: string,
        street: string,
        blocks: string[],
        issueType: string,
        description: string,
        resolutionTime: Date,
        dateAdded: Date
    ) {
        this.district = district,
        this.roadType = roadType;
        this.street = street;
        this.blocks = blocks;
        this.issueType = issueType;
        this.description = description;
        this.resolutionTime = resolutionTime;
        this.dateAdded = dateAdded;
    }
}