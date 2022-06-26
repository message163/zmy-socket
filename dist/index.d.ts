/// <reference types="node" />
import type { Socket } from "net";
import Server from "./lib/core/server";
import type { Event } from './lib/types/server';
export default class webSocket extends Server {
    socketInstance?: Socket;
    private readonly Guid;
    constructor();
    createSocket(callback?: (socket?: webSocket) => void): Promise<webSocket | undefined>;
    private isSocket;
    private setHeader;
    on(event: Event, callback: () => void): void;
    on(event: Event, callback: (data: Buffer) => void): void;
    send(data: any): void;
}
