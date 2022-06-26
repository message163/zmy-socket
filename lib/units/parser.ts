/**
 * 
 * @param str 
 * @returns 
 */
export function parseHeader(str: string) {
    // 将请求头数据按回车符切割为数组，得到每一行数据
    let arr: Array<string> = str.split('\r\n').filter(item => item)

    // 第一行数据为GET / HTTP/1.1，可以丢弃。
    arr.shift()

    //console.log(arr);
    
    /* 
      处理结果为：
  
      [ 'Host: localhost:8080',
        'Connection: Upgrade',
        'Pragma: no-cache',
        'Cache-Control: no-cache',
        'Upgrade: websocket',
        'Origin: file://',
        'Sec-WebSocket-Version: 13',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
        'Accept-Encoding: gzip, deflate, br',
        'Accept-Language: zh-CN,zh;q=0.9',
        'Cookie: _ga=GA1.1.1892261700.1545540050; _gid=GA1.1.774798563.1552221410; io=7X0VY8jhwRTdRHBfAAAB',
        'Sec-WebSocket-Key: jqxd7P0Xx9TGkdMfogptRw==',
        'Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits' ]
    */

    let headers: Record<string, string> = {}  // 存储最终处理的数据

    arr.forEach((item: string) => {
        // 需要用":"将数组切割成key和value
        let [name, value] = item.split(':')

        // 去除无用的空格，将属性名转为小写
        name = name.replace(/^\s|\s+$/g, '').toLowerCase()
        value = value.replace(/^\s|\s+$/g, '')

        // 获取所有的请求头属性
        headers[name] = value
    })

    return headers
}