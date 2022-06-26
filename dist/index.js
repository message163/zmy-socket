"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./lib/core/server"));
const parser_1 = require("./lib/units/parser");
const crypto_1 = __importDefault(require("crypto"));
const frame_1 = require("./lib/frame");
class webSocket extends server_1.default {
    constructor() {
        super();
        this.Guid = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
        this.createSocket();
    }
    createSocket(callback) {
        return new Promise((resolve) => {
            this.connection((socket) => {
                this.socketInstance = socket;
                this.socketInstance.once('data', (data) => {
                    const headers = (0, parser_1.parseHeader)(data.toString());
                    if (this.isSocket(headers)) {
                        this.setHeader(headers);
                        callback && callback(this);
                        resolve(this);
                    }
                });
            });
        });
    }
    isSocket(headers) {
        var _a, _b;
        if (headers['upgrade'] !== 'websocket') {
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close();
            return false;
        }
        else if (headers['sec-websocket-version'] !== '13') {
            (_b = this.socket) === null || _b === void 0 ? void 0 : _b.close();
            return false;
        }
        else {
            return true;
        }
    }
    setHeader(headers) {
        var _a;
        const key = headers['sec-websocket-key'];
        const hash = crypto_1.default.createHash('sha1');
        hash.update(`${key}${this.Guid}`);
        const result = hash.digest('base64');
        const header = `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-Websocket-Accept: ${result}\r\n\r\n`;
        (_a = this.socketInstance) === null || _a === void 0 ? void 0 : _a.write(header);
    }
    on(event, callback) {
        var _a;
        (_a = this.socketInstance) === null || _a === void 0 ? void 0 : _a.on(event, (data) => {
            callback((0, frame_1.decodeWsFrame)(data).payloadData.toString());
        });
    }
    send(data) {
        var _a;
        (_a = this.socketInstance) === null || _a === void 0 ? void 0 : _a.write((0, frame_1.encodeWsFrame)({ payloadData: data }));
    }
}
exports.default = webSocket;
