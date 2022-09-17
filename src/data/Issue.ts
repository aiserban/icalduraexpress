class Issue {
    district: string = '';
    roadType: string = '';
    street: string = '';
    blocks: string[] = [];
    issueType: string = '';
    description: string = '';
    resolutionTime: string = '';

    constructor(
        district: string,
        roadType: string,
        street: string,
        blocks: string[],
        issueType: string,
        description: string,
        resolutionTime: string
    ) {
        this.district = district,
        this.roadType = roadType;
        this.street = street;
        this.blocks = blocks;
        this.issueType = issueType;
        this.description = description;
        this.resolutionTime = resolutionTime;
    }
}

export default Issue;