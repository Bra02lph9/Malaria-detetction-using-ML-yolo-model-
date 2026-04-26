# 🦠 Malaria Detection using YOLOv8

This project is an end-to-end system for detecting malaria parasites in microscopy images using **YOLOv8** models. It combines deep learning with a web-based interface for easy interaction.

---

## 📦 Project Structure

### 🔹 Backend
A **Flask API** responsible for:
- Loading trained YOLOv8 models  
- Processing microscopy images  
- Returning detection results  

---

### 🔹 Frontend
A **React application** that allows users to:
- Upload microscopy images  
- Visualize detection results  
- Interact with the model easily  

---

## 🤖 Models

The project includes multiple YOLOv8 model variants for testing and comparison.

📁 The `models/` directory contains **4 different folders**, each representing a different YOLOv8 version:

- **YOLOv8n (Nano)** → very fast, lightweight, lower accuracy  
- **YOLOv8s (Small)** → balanced speed and accuracy  
- **YOLOv8t (Tiny)** → ultra-light model for quick testing  
- **Custom / Additional Model** → your trained or experimental version  

🎯 Purpose:
- Compare performance (speed vs accuracy)  
- Evaluate different architectures  
- Select the best model for deployment  

---

## 🧠 Model Details

- Framework: **YOLOv8**  
- Task: **Object Detection**  
- Dataset: Malaria microscopy images with bounding box annotations  

---

## 🧬 Classes

The model detects the following cell types:

- `red_blood_cell`  
- `leukocyte`  
- `trophozoite`  
- `ring`  
- `schizont`  
- `gametocyte`  