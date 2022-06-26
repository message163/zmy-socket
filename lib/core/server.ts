import net, { Socket, Server as Ser } from 'net'
import { Options } from '../types/server'
export default class Server {
    public socket: Ser | null;
    public connections: Array<Ser>
    constructor() {
        this.socket = null;
        this.connections = []
    }
    /**
     * 
     * @param callback 回调函数
     */
    protected connection(callback: (socket: Socket) => void) {
        //创建socket 对象
        this.socket = net.createServer(callback)
        this.connections.push(this.socket)
        this.socket.on('close', () => {
            const pos = this.connections.indexOf(this.socket as net.Server)
            if (pos != -1) {
                this.connections.splice(pos, 1)
            }
        })
        console.log(this.connections);
        
    }

    public close() {
        this.socket?.close()
    }

    /**
     * 
     * @param PORT 
     * @param hostname 
     * @param backlog 
     * @param listeningListener 
     * @returns 
     */
    public listen(PORT: Options['port'], hostname?: string, backlog?: number, listeningListener?: () => void): Server {
        this.socket?.listen(PORT, hostname, backlog, listeningListener)
        return this
    }

}
