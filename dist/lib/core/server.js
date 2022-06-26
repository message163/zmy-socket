"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
class Server {
    constructor() {
        this.socket = null;
    }
    connection(callback) {
        this.socket = net_1.default.createServer(callback);
    }
    listen(PORT, hostname, backlog, listeningListener) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.listen(PORT, hostname, backlog, listeningListener);
        return this;
    }
}
exports.default = Server;
