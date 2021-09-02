var net = require('net');

var options = { // 접속 정보 설정
  port: 80,
//   host: "www.google.com",
  host: 'localhost'
};

var client = net.connect(options, () => { // 서버 접속
  console.log("서버에 접속 성공했습니다.");
  client.write('GET / HTTP/1.1\nHost: www.google.com\n\n')
});

//client.send

client.on('data', (data) => { // 데이터 수신 이벤트
  console.log(data.toString());
  client.end()
});

client.on('end', () => { // 접속 종료
  console.log("서버 접속이 종료되었습니다.");
});