export class Connection {
    public inviterNumber: string;
    public inviterName: string;
    public status: string;

    constructor(
        inviterNumber: string,
        inviterName: string,
        status: string
    ) {
        this.inviterNumber = inviterNumber;
        this.inviterName = inviterName;
        this.status = status;

    }
}