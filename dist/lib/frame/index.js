"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeWsFrame = exports.encodeWsFrame = void 0;
function encodeWsFrame(data) {
    const isFinal = data.isFinal !== undefined ? data.isFinal : true, opcode = data.opcode !== undefined ? data.opcode : 1, payloadData = data.payloadData ? Buffer.from(data.payloadData) : null, payloadLen = payloadData ? payloadData.length : 0;
    let frame = [];
    if (isFinal)
        frame.push((1 << 7) + opcode);
    else
        frame.push(opcode);
    if (payloadLen < 126) {
        frame.push(payloadLen);
    }
    else if (payloadLen < 65536) {
        frame.push(126, payloadLen >> 8, payloadLen & 0xFF);
    }
    else {
        frame.push(127);
        for (let i = 7; i >= 0; --i) {
            frame.push((payloadLen & (0xFF << (i * 8))) >> (i * 8));
        }
    }
    frame = payloadData ? Buffer.concat([Buffer.from(frame), payloadData]) : Buffer.from(frame);
    return frame;
}
exports.encodeWsFrame = encodeWsFrame;
function decodeWsFrame(data) {
    let start = 0;
    let frame = {
        isFinal: (data[start] & 0x80) === 0x80,
        opcode: data[start++] & 0xF,
        masked: (data[start] & 0x80) === 0x80,
        payloadLen: data[start++] & 0x7F,
        maskingKey: [],
        payloadData: null
    };
    if (frame.payloadLen === 126) {
        frame.payloadLen = (data[start++] << 8) + data[start++];
    }
    else if (frame.payloadLen === 127) {
        frame.payloadLen = 0;
        for (let i = 7; i >= 0; --i) {
            frame.payloadLen += (data[start++] << (i * 8));
        }
    }
    if (frame.payloadLen) {
        if (frame.masked) {
            const maskingKey = [
                data[start++],
                data[start++],
                data[start++],
                data[start++]
            ];
            frame.maskingKey = maskingKey;
            frame.payloadData = data
                .slice(start, start + frame.payloadLen)
                .map((byte, idx) => byte ^ maskingKey[idx % 4]);
        }
        else {
            frame.payloadData = data.slice(start, start + frame.payloadLen);
        }
    }
    return frame;
}
exports.decodeWsFrame = decodeWsFrame;
