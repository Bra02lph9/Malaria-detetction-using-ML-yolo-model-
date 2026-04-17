from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from config import RESULT_DIR
from services.inference import run_inference

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route("/results/<filename>")
def get_result_file(filename):
    return send_from_directory(RESULT_DIR, filename)


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    result = run_inference(file)

    return jsonify({
        "image_url": f"http://127.0.0.1:5000/results/{result['image_name']}",
        "total_detections": result["total_detections"],
        "counts": result["counts"],
        "detections": result["detections"]
    })


if __name__ == "__main__":
    app.run(debug=True)
