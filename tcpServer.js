let net = require("net");
let fs = require("fs");

let server = net.createServer((socket) => {
  socket.on("data", function (data) {
    const lines = data.toString().split("\r\n");
    const headers = {};
    let path = "";
    console.log("data: " + data);
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        path = lines[i].split(" ")[1];
      } else {
        let parsing = lines[i].split(": ");
        const key = parsing[0].toLowerCase();
        const value = parsing[1];
        headers[key] = value;
      }
    }
    console.log("path: " + path);
    const domain = headers.host;
    console.log("domain: ", domain);
    if (domain === "insung.com" || domain === "insung-vue.com") {
      if (path == "/") {
        path = "/index.html";
      }
      const winPath = `c:\\${domain}${path}`;
      const splitPath = path.split("/");
      const fileName = splitPath[splitPath.length - 1];
      const extension = fileName.split(".")[1];
      console.log("extension: ", extension);
      fs.readFile(winPath, (err, body) => {
        if (err) {
          socket.write(`HTTP/1.1 404 NOT FOUND\n\n`);
        }
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif"
        ) {
          socket.write(
            `HTTP/1.1 200 OK\ncontent-type: image/${extension}\ncontent-length: ${body.length}\n\n`
          );
          socket.write(body, "base64");
        } else {
          socket.write(`HTTP/1.1 200 OK\n\n${body}`);
        }
        socket.end();
      });
    } else if (domain == "finset.io") {
      socket.write(
        "HTTP/1.1 301 Moved Permanently\nLocation: https://gitple.io/\n\n"
      );
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
  console.log(err);
});

server.listen(80, () => {
  console.log("listen", server.address());
});
