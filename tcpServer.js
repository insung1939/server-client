var net = require('net'); // net 모듈 로드

var server = net.createServer((socket) => { // TCP 서버를 만든다.
//   socket.end('hello insung!');
    socket.on('data', function(data) {
        const lines = data.toString().split('\n')
        const path = lines[0].split(' ')[1]
        console.log('line: ' + lines[0])
        console.log('path: ' + path)
	    // console.log('Received: ' + data);
	    socket.write('HTTP/1.1 200 OK\n\n<html><body><h1>hello insung</h1></body></html>');
        socket.end()
    });
});

server.on('error', (err) => { // 네트워크 에러 처리
  console.log(err);
});

server.listen(80, () => {
  console.log('listen', server.address());
});