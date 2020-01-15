import { Invitations } from './invitationsModel';
import { Connections } from './connections';
export class People {
    public invitations: Invitations;
    public connections: Connections

    constructor(
        invitations: Invitations,
        connections: Connections
    ) {
        this.invitations = invitations;
        this.connections = connections;
    }
}