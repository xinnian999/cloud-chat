class Chat {
  header = document.querySelector("header");
  modal = document.querySelector("#modal");
  modalInput = document.querySelector("#modal input");
  modalButton = document.querySelector("#modal button");
  msgInput = document.querySelector("#messageInput");
  msgSendBtn = document.querySelector("#send");
  main = document.querySelector("main");
  clearBtn = document.querySelector(".clear");
  user = {};
  msg = "";
  sorket = new WebSocket("ws://localhost:3000");
  // sorket = new WebSocket("ws://101.42.108.39:3000");
  msgList = [];

  constructor() {
    // 如果localstorge存在用户信息，直接引用
    // 不存在,就弹窗注册
    const user = localStorage.getItem("user");
    if (!user) {
      this.modal.style.display = "block";
      this.modalButton.onclick = () => {
        if (!this.modalInput.value) return alert("昵称不能为空");
        const name = this.modalInput.value;
        const uid = "chat_user_" + Date.now();
        const userInfo = { name, uid };
        this.user = userInfo;
        // localStorage存一下
        localStorage.setItem("user", JSON.stringify(userInfo));
        this.modal.style.display = "none";

        // 广播入场通知
        this.send({ ...this.user, type: 1 });
      };
    } else {
      this.user = JSON.parse(user);
    }

    // 消息输入与发送事件+回车发送事件
    this.msgInput.oninput = (e) => {
      this.msg = e.target.value;
    };
    this.msgSendBtn.onclick = () => {
      if (!this.msg) return alert("不能发送空的内容");
      this.send({ ...this.user, msg: this.msg, type: 2 });
    };
    document.onkeydown = (event) => {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        //回车键的键值为13
        if (!this.msg) return alert("不能发送空的内容");
        this.send({ ...this.user, msg: this.msg, type: 2 });
      }
    };

    this.sorket.onopen = () => {
      console.log("连接服务器成功");

      // 如果是注册过的用户,发送入场广播
      if (this.user.name) this.send({ ...this.user, type: 1 });
    };

    // 消息接收监听
    this.sorket.onmessage = (e) => {
      let message = JSON.parse(e.data);
      this.msgList.push(message);
      this.render();
    };

    this.clearBtn.onclick = () => {
      localStorage.clear();
      window.location.reload();
    };
  }

  // 发送消息
  send(data) {
    this.sorket.send(JSON.stringify(data));
    this.msgInput.value = "";
    this.msg = "";
  }

  render() {
    let html = "";
    this.msgList.forEach(({ type, uid, name, msg, time, userTotal }) => {
      if (type === 1) {
        html += `<div class="join-tip">${name} 加入了聊天</div>`;
      }

      if (type === 2 && uid !== this.user.uid) {
        html += `<div class="mesItem">
            <div class="nickname">${name}</div>
            <div class="content">${msg}</div>
            <p>${time}</p>
          </div>`;
      }

      if (type === 2 && uid === this.user.uid) {
        html += ` <div class="mesItem-me">
        <div class="content">${msg}</div>
        <div class="nickname">${name}</div>
        <p>${time}</p>
      </div>`;
      }

      this.header.innerText = `在线人数：${userTotal}`;
    });
    this.main.innerHTML = html;

    // 保持滚动到最底部
    this.main.scrollTop = this.main.scrollHeight;
  }
}

new Chat();
