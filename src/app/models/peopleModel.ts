import { Invitation } from './invitationsModel';
import { Connection } from './connections';
export class People {
    public invitations: Invitation;
    public connections: Connection[]

    constructor(
        invitations: Invitation,
        connections: Connection[]
    ) {
        this.invitations = invitations;
        this.connections = connections;
    }
}