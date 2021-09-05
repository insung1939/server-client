let net = require("net");

let options = {
  // 접속 정보 설정
  port: 80,
  host: "localhost",
};

let client = net.connect(options, () => {
  // 서버 접속
  console.log("서버에 접속 성공했습니다.");
  client.write("GET / HTTP/1.1\nHost: finset2.io\n\n");
});

//client.send

client.on("data", (data) => {
  // 데이터 수신 이벤트
  console.log(data.toString());
});

client.on("end", () => {
  // 접속 종료
  console.log("서버 접속이 종료되었습니다.");
});
