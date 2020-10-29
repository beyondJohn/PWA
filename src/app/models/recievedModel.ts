export class Received{
    public userNumber: string;
    public status: string;
    public inviterName: string;
    public date: string;
    constructor(
        userNumber: string,
        status: string,
        inviterName: string,
        date: string
    ) {
        this.userNumber = userNumber;
        this.status = status;
        this.inviterName = inviterName;
        this.date = date;
    }
}