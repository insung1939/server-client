let net = require("net");

let options = {
  port: 80,
  host: "localhost",
};

let client = net.connect(options, () => {
  console.log("서버에 접속 성공했습니다.");
  client.write("GET / HTTP/1.1\r\nHost: insung.com\n\n");
});

client.on("data", (data) => {
  console.log(data.toString());
});

client.on("end", () => {
  console.log("서버 접속이 종료되었습니다.");
});
