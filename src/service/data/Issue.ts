export class Issue {
    constructor(
        public district: string,
        public roadType: string,
        public streetName: string,
        public street: string,
        public blocks: string[],
        public issueType: string,
        public description: string,
        public resolutionTime: Date,
        public dateAdded: Date
    ) {

    }
}