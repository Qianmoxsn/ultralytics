import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from ultralytics import YOLO

app = FastAPI()

ROOT = 'D:/Code/ultralytics'
# Load a model
model = YOLO(ROOT + '/ultralytics/trainresult/v8_170best.pt')  # pretrained YOLOv8n model
testimg = ROOT + '/webui/images/cube1.jpg'


# Define a function to run inference on a list of images
def run_inference(image):
    results = model.predict(image)  # return a generator of Results objects
    for rlt in results:
        result_tojson = rlt.tojson()
        return result_tojson


# 配置允许的来源、允许的方法和头部，以及其他 CORS 选项
origins = [
    "http://localhost:5173",
    "http://10.21.175.191:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "FastAPI is running!"}


# Define an endpoint to post the detection results to the web
@app.get("/detect_results/")
async def detect_results():
    results = run_inference(testimg)  # Run inference on test images
    # return JSONResponse(content=results)
    return results


@app.get("/fake_detect")
async def fake_detect():
    testimg = ROOT + '/webui/images/cube2.jpg'
    results = run_inference(testimg)  # Run inference on test images
    return JSONResponse(content=results)


# To run the FastAPI app, use the following command:
# uvicorn filename:app --reload
# For example: uvicorn webui.detectapi:app --reload
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1234)
