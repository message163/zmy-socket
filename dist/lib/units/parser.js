"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeader = void 0;
function parseHeader(str) {
    let arr = str.split('\r\n').filter(item => item);
    arr.shift();
    let headers = {};
    arr.forEach((item) => {
        let [name, value] = item.split(':');
        name = name.replace(/^\s|\s+$/g, '').toLowerCase();
        value = value.replace(/^\s|\s+$/g, '');
        headers[name] = value;
    });
    return headers;
}
exports.parseHeader = parseHeader;
