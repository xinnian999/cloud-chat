const ws = require("nodejs-websocket");
const moment = require("moment");

const msgList = [];

var server = ws
  .createServer(function (conn) {
    conn.on("text", function (obj) {
      msgList.push({
        ...JSON.parse(obj),
        userTotal: server.connections.length,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      // 发送广播
      server.connections.forEach((conn) => {
        conn.sendText(JSON.stringify(msgList));
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
