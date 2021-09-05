let net = require("net"); // net 모듈 로드(tcp 통신 및 서버를 만들 수 있음)
let fs = require("fs"); // fs(파일처리) 모듈 로드

let server = net.createServer((socket) => {
  // TCP 서버를 만든다.
  socket.on("data", function (data) {
    const lines = data.toString().split("\r\n"); //엔터로 다 나눔 \r: 커서를 행의 가장 앞으로 이동(공백제거 가능)
    //const domain = lines[1].split(' ')[1].trim() -> 이 방식의 문제점: lines[1]이 도메인이 아닐수도 있음...
    const headers = {}; //헤더 객체로 선언
    let path = ""; //path 선언
    console.log("data: " + data); //http 메시지전체를 볼 수 있음
    //console.log("lines: " + lines[0]); //http startline 보여줌
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        path = lines[i].split(" ")[1]; //http startline을 ' '으로 나누고 path만 추출
      } else {
        let parsing = lines[i].split(": "); // key, value로 나눠서 parsing
        const key = parsing[0].toLowerCase(); //key 값은 소문자로..
        const value = parsing[1]; //value 값 추출
        headers[key] = value; //헤더에 키-값 으로 객체 생성
      }
    }
    console.log("path: " + path);
    //console.log("headers: " + JSON.stringify(headers, null, 2));
    //json 객체를 스트링 객체로 변환해줌, 파라미터는  (변환할 값, replacer 파라미터: json문자열에 포함시킬 객체의 속성들을 선택하기 위한 옵션, space 파라미터)
    const domain = headers.host;
    console.log("domain: ", domain); //도메인주소 출력
    //로컬에서 호스트 도메인 추가 방법 경로:
    // \Windows\System32\drivers\etc\hosts 여기서 추가하삼
    if (domain === "insung.com" || domain === "insung-vue.com") {
      if (path == "/") {
        path = "/index.html";
      } //default path를 /index.html로 지정함
      const winPath = `c:\\${domain}${path}`; //readFile 함수에 필요 (path, callback)
      const splitPath = path.split("/"); //path를 '/'로 나누기
      const fileName = splitPath[splitPath.length - 1]; //splitPath의 마지막 요소를 가져옴(마지막요소가 확장자니까)
      const extension = fileName.split(".")[1]; //확장자요소만 완벽하게 가져오기
      console.log("extension: ", extension); //확장자 보여주기
      fs.readFile(winPath, (err, body) => {
        if (err) {
          socket.write(`HTTP/1.1 404 NOT FOUND\n\n`);
        }
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif" //fileName이 다음과 같은 확장자를 가진다면
        ) {
          //console.log("fileName: " + fileName);
          socket.write(
            `HTTP/1.1 200 OK\ncontent-type: image/${extension}\ncontent-length: ${body.length}\n\n`
          ); //이미지 http response 보내기
          socket.write(body, "base64");
        } else {
          socket.write(`HTTP/1.1 200 OK\n\n${body}`); //이미지 http 아닌 경우의 response
        }
        socket.end();
      });
    } else if (domain == "finset.io") {
      socket.write(
        "HTTP/1.1 301 Moved Permanently\nLocation: https://gitple.io/\n\n"
      ); //redirection 으로 gitple.io 로 이동 (300번대는 location이 있어야 이동함.)
      socket.end();
    } else {
      socket.write(
        `HTTP/1.1 200 OK\n\n<html><body><h1>you requested ${domain}</h1></body></html>`
      );
      socket.end();
    }
  });
});

server.on("error", (err) => {
  // 네트워크 에러 처리
  console.log(err);
});

server.listen(80, () => {
  console.log("listen", server.address());
}); //접속할때 localhost:1000, 80은 디폴트
