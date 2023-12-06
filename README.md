## 前言

websocket是 html5 新增的一项api，实现客户端与服务器之间的即时通信。今天用它来实现一个聊天室demo，这里选择**原生js**来实现，因为用惯了vue和react的舒适框架，是时候复习一下原生的api了。毕竟现在前端技术更新很快，掌握好底层的东西才能做到以不变应万变

demo在线预览：[http://101.42.108.39:90/chat/](http://101.42.108.39:90/chat/)

## 思路

后台使用node搭建一个websocket服务器，客户端连接此服务器完成握手，前台每次发送消息，后台就向所有握手的客户端广播消息

## 关键api

### 前台

+ sorket = new WebSocket("ws://localhost:3000") 【初始化WebSocket对象】

+ this.sorket.onopen 【与服务端建立连接触发】

+ this.sorket.send 【向服务器发送消息】

+ this.sorket.onmessage 【收到服务端推送消息触发】

### 后台

+ ws.createServer=(conn=>{}).listen(3000) 【创建ws服务器】

+ conn.on("text", function (obj) {}) 【接收消息】

+ conn.sendText() 【向所有握手的客户端广播消息】
