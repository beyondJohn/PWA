export class Sent {
    public userNumber: string;
    public status: string;
    public inviteeName: string;
    public date: string;
    constructor(
        userNumber: string,
        status: string,
        inviteeName: string,
        date: string
    ) {
        this.userNumber = userNumber;
        this.status = status;
        this.inviteeName = inviteeName;
        this.date = date;
    }
}