let net = require('net'); // net 모듈 로드
let fs = require('fs'); // fs 모듈 로드

let server = net.createServer((socket) => { // TCP 서버를 만든다.
    socket.on('data', function(data) {
        const lines = data.toString().split('\n')
        const domain = lines[1].split(' ')[1].trim()
        let path = lines[0].split(' ')[1]
        console.log('data: ' + data)
        console.log('line: ' + lines[0])
        console.log('domain: ' + domain)
        console.log('path: ' + path)
        
        if(1 || domain == "insung.com"){
            if (path == '/') {
                path = '/index.html'
            }
            const winPath = `c:\\insung.com${path}`;
                
            let option = null; // {encoding:'base64', flag:'r'};
            fs.readFile(winPath, option, (err, body) => {
                if(err){
                    socket.write(`HTTP/1.1 404 NOT FOUND\n\n`);
                }
            console.log('body:', winPath, body);
            if (path == '/finset.png' || path == '/google.png') {
                socket.write(`HTTP/1.1 200 OK\ncontent-type: image/png\ncontent-length: ${body.length}\n\n`);
                socket.write(body, 'base64');
            } else {
              socket.write(`HTTP/1.1 200 OK\n\n${body}`);
            }
              socket.end()
          });
            }else if(domain == "finset.io"){
                socket.write('HTTP/1.1 301 Moved Permanently\nLocation: https://gitple.io/\n\n');
                socket.end()
            }else{
                socket.write(`HTTP/1.1 200 OK\n\n<html><body><h1>you requested ${domain}</h1></body></html>`);
                socket.end()
            }
	    console.log('Received: ' + data);
    });
});

server.on('error', (err) => { // 네트워크 에러 처리
  console.log(err);
});

server.listen(80, () => {
  console.log('listen', server.address());
});