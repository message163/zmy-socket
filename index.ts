import { log } from "console";
import type { Socket } from "net";
import Server from "./lib/core/server";
import type { Event } from './lib/types/server'
import { parseHeader } from "./lib/units/parser";
import crypto from 'crypto'
import { encodeWsFrame, decodeWsFrame } from "./lib/frame";
export default class webSocket extends Server {
    protected socketInstance?: Socket
    private readonly Guid: string
    constructor() {
        super()
        this.Guid = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11' //webSocket 唯一GUID 该值是固定的，所有websocket的该值都一样
        this.createSocket()
    }
    public createSocket(callback?: (socket?: webSocket) => void): Promise<webSocket | undefined> {
        return new Promise((resolve) => {
            this.connection((socket: Socket) => {
                this.socketInstance = socket;
                this.socketInstance.once('data', (data: Buffer) => {
                    const headers = parseHeader(data.toString())
                    if (this.isSocket(headers)) {
                        this.setHeader(headers)
                        callback && callback(this)
                        resolve(this)
                    }
                })
            })
        })

    }
    /**
     * 
     * @param headers 
     * @returns 
     */
    private isSocket(headers: Record<string, string>): boolean {
        if (headers['upgrade'] !== 'websocket') {
            // 若当前请求不是WebSocket连接，则关闭连接
            this.socket?.close()
            return false
        } else if (headers['sec-websocket-version'] !== '13') {
            // 判断WebSocket版本是否为13，防止是其他版本，造成兼容错误
            this.socket?.close()
            return false
        } else {
            // 请求为WebSocket连接时，进一步处理
            return true
        }

    }
    /**
     * 
     * @param headers 
     */
    private setHeader(headers: Record<string, string>) {
        const key = headers['sec-websocket-key']
        const hash = crypto.createHash('sha1') //创建一个签名算法为sha1的哈希对象
        hash.update(`${key}${this.Guid}`)  // 将key和GUID连接后，更新到hash
        const result = hash.digest('base64') // 生成base64字符串
        const header = `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-Websocket-Accept: ${result}\r\n\r\n` // 生成供前端校验用的请求头
        this.socketInstance?.write(header)
    }

    /**
     * 
     * @param event 
     * @param callback 
     */
    public on(event: Event, callback: () => void): void
    public on(event: Event, callback: (data: Buffer) => void): void
    public on(event: Event, callback: (data: any) => void): void {
        this.socketInstance?.on(event, (data: Buffer) => {
            callback(decodeWsFrame(data).payloadData.toString())
        })
    }
    /**
     * 
     * @param event 
     * @param callback 
     */
    public once(event: Event, callback: () => void): void
    public once(event: Event, callback: (data: Buffer | string) => void): void {
        this.socketInstance?.once(event, (data: Buffer) => {
            callback(decodeWsFrame(data).payloadData.toString())
        })
    }

    public send(data: any) {
        this.socketInstance?.write(encodeWsFrame({ payloadData: data }))
    }



}

const ws = new webSocket()

ws.createSocket().then(socket => {

    socket?.on('data', (data: any) => {
        log(data)
    })

})


ws.listen(9000)

