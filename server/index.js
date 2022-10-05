const ws = require("nodejs-websocket");
const moment = require("moment");

var server = ws
  .createServer(function (conn) {
    conn.on("text", function (obj) {
      obj = {
        ...JSON.parse(obj),
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      // 连接用户数
      obj.userTotal = server.connections.length;

      // 发送广播
      server.connections.forEach((conn) => {
        conn.sendText(JSON.stringify(obj));
      });
    });

    conn.on("close", function (code, reason) {
      console.log("关闭连接");
    });
    conn.on("error", function (code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(3000);
console.log("WebSocket建立完毕");
