import { Sent } from './sentModel';
import { Received } from './recievedModel';
export class Invitation {
    public sent: Sent[];
    public received: Received[];
    constructor(sent:Sent[], received:Received[]){
        this.sent = sent;
        this.received = received
    }
}