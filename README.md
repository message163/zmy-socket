# Nodejs Websocket

使用方法

```js
//创建ws实例对象
const ws = new webSocket()

ws.createSocket().then(socket => {
    //回调 监听数据 data
    socket?.on('data', (data: any) => {
        log(data)
    })

})

//发送数据
ws.send(123)

//监听端口
ws.listen(9000)

```
