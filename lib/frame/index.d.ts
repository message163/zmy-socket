/// <reference types="node" />
export declare function encodeWsFrame(data: any): Buffer;
export declare function decodeWsFrame(data: Buffer): {
    isFinal: boolean;
    opcode: number;
    masked: boolean;
    payloadLen: number;
    maskingKey: any[];
    payloadData: Buffer;
};
