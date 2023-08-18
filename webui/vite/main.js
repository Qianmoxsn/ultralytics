const imageInput = document.getElementById("imageInput");
const uploadedImage = document.getElementById("uploadedImage");
const resultImage = document.getElementById("resultImage");
const boundingCanvas = document.getElementById("boundingCanvas");

var bounding = { x: 0, y: 0, width: 0, height: 0 };

// 在窗口大小变化时更新canvas位置
window.addEventListener("resize", function () {
  this.setTimeout(function () {
    console.log("Re-draw Canvas...");
    updateWithDraw(bounding);
  }, 200);
});

// 初始加载时调用一次
updateCanvasPosition();

imageInput.addEventListener("change", async function () {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader(); // 在这里定义 reader
    // 使用 await 等待图像加载完成
    await new Promise((resolve) => {
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        resolve();
      };
      reader.readAsDataURL(file);
    });

    resultImage.src = uploadedImage.src;

    // 使用 await 等待结果图像加载完成
    await new Promise((resolve) => {
      resultImage.onload = function () {
        resolve();
      };
    });

    try {
      let resjson = await getRecognitionResult();
      // console.log(resjson);
      handleRecognitionResult(resjson);
    } catch (error) {
      console.error("Error:", error);
    }
  }
});

// 绘制bounding box
function drawBoundingBox(bounding) {
  const canvasContext = boundingCanvas.getContext("2d");

  // 设置绘制样式
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 2;

  // 绘制bounding box
  canvasContext.beginPath();
  canvasContext.rect(bounding.x, bounding.y, bounding.width, bounding.height);
  canvasContext.stroke();
  canvasContext.closePath();
  // console.log(bounding);
}

//清除Canvas
function clearCanvas() {
  const canvasContext = boundingCanvas.getContext("2d");
  canvasContext.clearRect(0, 0, boundingCanvas.width, boundingCanvas.height);
}

// 更新canvas位置函数
function updateCanvasPosition() {
  const resultImageRect = resultImage.getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop;
  // console.log(resultImageRect);
  boundingCanvas.style.position = "absolute";
  boundingCanvas.style.left = resultImageRect.left + "px";
  boundingCanvas.style.top = resultImageRect.top + scrollTop + "px";
  boundingCanvas.width = resultImageRect.width;
  boundingCanvas.height = resultImageRect.height;
}

function updateWithDraw(bounding) {
  updateCanvasPosition();
  drawBoundingBox(bounding);
}

// 获取识别json结果
async function getRecognitionResult() {
  // use detect api(http request) to get recognition result
  try {
    let response = await fetch("http://10.21.175.191:1234/fake_detect", { mode: "cors" });

    if (!response.ok) {
      console.error("HTTP Error:" + response.status);
    }

    let data = await response.json();
    data = JSON.parse(data);
    console.log("fetching data:\n", data, typeof data);
    return data;
  } catch (err) {
    console.error("Fetching Error:" + err);
    throw err;
  }
}

// 处理识别结果
function handleRecognitionResult(jsonresult) {
  // update bounding box
  /* jsonresult 示例:
   * [
   *   {
   *     "name": "cube",
   *     "class": 1,
   *     "confidence": 0.7532966136932373,
   *     "box": {
   *       "x1": 85.58421325683594,
   *       "y1": 220.336669921875,
   *       "x2": 379.03240966796875,
   *       "y2": 566.9713134765625
   *     }
   *   }
   * ]
   */
  const result = jsonresult[0];

  let class_name = result["name"];
  let conf = result["confidence"];
  let bounding_xyxy = result["box"];

  bounding = {
    x: bounding_xyxy.x1,
    y: bounding_xyxy.y1,
    width: bounding_xyxy.x2 - bounding_xyxy.x1,
    height: bounding_xyxy.y2 - bounding_xyxy.y1,
  };
  updateWithDraw(bounding);
}
