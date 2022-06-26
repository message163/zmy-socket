/// <reference types="node" />
import { Socket, Server as Ser } from 'net';
import { Options } from '../types/server';
export default class Server {
    socket: Ser | null;
    constructor();
    protected connection(callback: (socket: Socket) => void): void;
    listen(PORT: Options['port'], hostname?: string, backlog?: number, listeningListener?: () => void): Server;
}
