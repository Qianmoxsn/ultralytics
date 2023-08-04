from ultralytics import YOLO

from fastapi import FastAPI

ROOT = 'D:/Code/ultralytics'
# Load a model
model = YOLO(ROOT + '/ultralytics/trainresult/v8_170best.pt')  # pretrained YOLOv8n model
testimgset = [
    'images/cube1.jpg',
    # 'images/cube2.jpg',
]
# Run batched inference on a list of images
results = model.predict(testimgset)  # return a generator of Results objects

# Process results generator
for result in results:
    result_tojson = result.result_tojson()

