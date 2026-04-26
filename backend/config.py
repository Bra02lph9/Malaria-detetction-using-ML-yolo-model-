from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model" / "best4.pt"
UPLOAD_DIR = BASE_DIR / "uploads"
RESULT_DIR = BASE_DIR / "results"

CLASS_NAMES = {
    0: "red_blood_cell",
    1: "leukocyte",
    2: "trophozoite",
    3: "ring",
    4: "schizont",
    5: "gametocyte",
}

UPLOAD_DIR.mkdir(exist_ok=True)
RESULT_DIR.mkdir(exist_ok=True)