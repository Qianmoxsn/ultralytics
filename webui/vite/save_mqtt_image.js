const mqtt = require("mqtt");
const fs = require("fs");
const ROOT = "D:/Code/ultralytics";
const url = "ws://10.21.175.191:8083/mqtt";

// 创建客户端实例
const options = {
    // Clean session
    clean: false,
    connectTimeout: 4000,
    // 认证信息
    clientId: "testsubscriber",
  };

const client = mqtt.connect(url, options);

// 订阅主题
client.on("connect", function () {
    console.log("Connected");
    client.subscribe("imagecapture", function (err) {
        if (!err) {
            console.log("Subscribe successfully");
        } else {
            console.log("Subscribe error:" + err);
        }
    });
});

// 接收消息并保存
client.on("message", function (topic, message) {
    console.log("Received message:" + message.toString());
    fs.writeFile(ROOT + "/webui/images/received.jpg", message, function (err) {
        if (err) {
            console.log("Write file error:" + err);
        } else {
            console.log("Write file successfully");
        }
    });
});