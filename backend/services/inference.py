from ultralytics import YOLO
import cv2
import uuid
from pathlib import Path

from config import MODEL_PATH, RESULT_DIR, UPLOAD_DIR, CLASS_NAMES

model = YOLO(str(MODEL_PATH))

CLASS_COLORS = {
    0: (70, 160, 255),   # red_blood_cell
    1: (160, 110, 255),  # leukocyte
    2: (255, 170, 80),   # trophozoite
    3: (80, 220, 170),   # ring
    4: (255, 120, 120),  # schizont
    5: (255, 215, 90),   # gametocyte
}


def run_inference(uploaded_file):
    ext = Path(uploaded_file.filename).suffix.lower() or ".png"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    input_path = UPLOAD_DIR / unique_name
    output_name = f"annotated_{unique_name}"
    output_path = RESULT_DIR / output_name

    uploaded_file.save(str(input_path))

    results = model.predict(
        source=str(input_path),
        conf=0.25,
        save=False,
        verbose=False
    )

    result = results[0]
    detections = []
    counts = {}

    img = cv2.imread(str(input_path))

    if result.boxes is not None:
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            confidence = float(box.conf[0].item())
            xyxy = box.xyxy[0].tolist()

            class_name = CLASS_NAMES.get(class_id, f"class_{class_id}")
            counts[class_name] = counts.get(class_name, 0) + 1

            detections.append({
                "class_id": class_id,
                "class_name": class_name,
                "confidence": round(confidence, 4),
                "box": [round(v, 2) for v in xyxy]
            })

            x1, y1, x2, y2 = map(int, xyxy)

            color_rgb = CLASS_COLORS.get(class_id, (255, 255, 255))
            color_bgr = (color_rgb[2], color_rgb[1], color_rgb[0])

            cv2.rectangle(img, (x1, y1), (x2, y2), color_bgr, 2)

    cv2.imwrite(str(output_path), img)

    return {
        "image_name": output_name,
        "total_detections": len(detections),
        "counts": counts,
        "detections": detections
    }
