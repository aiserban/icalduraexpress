class Issue {
    district: number = 0;
    streetType: string = '';
    street: string = '';
    block: string = '';
    issueType: string = '';
    description: string = '';
    resolutionTime: Date = new Date();

    constructor(
        district: number,
        streetType: string,
        street: string,
        block: string,
        issueType: string,
        description: string,
        resolutionTime: Date
    ) {
        this.district = district,
        this.streetType = streetType;
        this.street = street;
        this.block = block;
        this.issueType = issueType;
        this.description = description;
        this.resolutionTime = resolutionTime;
    }
}