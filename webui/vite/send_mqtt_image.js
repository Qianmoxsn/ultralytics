const mqtt = require("mqtt");
// import mqtt from 'mqtt'
const ROOT = "D:/Code/ultralytics";
const url = "ws://10.21.175.191:8083/mqtt";


// 创建客户端实例
const options = {
  // Clean session
  clean: false,
  connectTimeout: 4000,
  // 认证信息
  clientId: "testpublisher",
};

let fake_image_jepg = ROOT + "/data/images/bus.jpg";

const client = mqtt.connect(url, options);
client.on("connect", function () {
  console.log("Connected");
  // 发布主题
  client.publish("imagecapture", fake_image_jepg, function (err) {
    if (!err) {
      console.log("Message is published");
    } else {
      console.log("publish error:" + err);
    }
  });
});
