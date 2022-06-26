/// <reference types="node" />
import { Socket, Server as Ser } from 'net';
import { Options } from '../types/server';
export default class Server {
    socket: Ser | null;
    constructor();
    /**
     *
     * @param callback 回调函数
     */
    protected connection(callback: (socket: Socket) => void): void;
    /**
     *
     * @param PORT
     * @param hostname
     * @param backlog
     * @param listeningListener
     * @returns
     */
    listen(PORT: Options['port'], hostname?: string, backlog?: number, listeningListener?: () => void): Server;
}
