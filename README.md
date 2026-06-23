# 👁️ Eye Disease Detection Using Deep Learning

A web-based deep learning project for **classifying retinal/eye images** into four categories:

- **Cataract**
- **Diabetic Retinopathy**
- **Glaucoma**
- **Normal**

This project combines a **TensorFlow/Keras image classification model** with a **Flask web application** so users can upload an eye image and receive an instant prediction.

---

## 📌 Project Overview

Early detection of eye diseases can help reduce the risk of vision loss. This project was developed as an AI-based screening prototype that analyzes uploaded eye images and predicts the most likely disease class.

The system includes:
- a trained `.h5` model for prediction,
- a user-friendly upload interface,
- confidence score output,
- and a simple medical alert message when an abnormal condition is detected.

> **Note:** This is an educational and research-oriented project. It is **not a substitute for professional medical diagnosis**.

---

## 🚀 Key Features

- ✅ Detects **4 eye conditions** from images
- ✅ Built with **Flask + TensorFlow/Keras**
- ✅ Clean modern frontend using **HTML, CSS, and JavaScript**
- ✅ Drag-and-drop or file upload support
- ✅ Returns prediction with confidence score
- ✅ Displays warning message for abnormal cases
- ✅ Uses transfer learning for better baseline performance

---

## 🧠 Model Information

This project notebook includes:

1. **Dataset validation and folder checking**
2. **Image preprocessing and augmentation**
3. **CNN model training**
4. **Transfer learning with `MobileNetV2`**
5. **Fine-tuning of top layers**
6. **Model saving and prediction testing**
7. **Visualization of feature maps and Grad-CAM**

### Training Strategy
- Image size: `224 x 224`
- Batch size: `32`
- Validation split: `20%`
- Data augmentation:
  - rotation
  - zoom
  - shear
  - horizontal flip
- Output classes: `4`

---

## 📂 Dataset

Dataset source:

🔗 [Kaggle - Eye Diseases Classification Dataset](https://www.kaggle.com/datasets/gunavenkatdoddi/eye-diseases-classification)

Dataset classes used in this project:
- `cataract`
- `diabetic_retinopathy`
- `glaucoma`
- `normal`

Please download the dataset from Kaggle and keep it in the following structure:

```bash
dataset/
├── cataract/
├── diabetic_retinopathy/
├── glaucoma/
└── normal/
```

---

## 🗂️ Project Structure

```bash
Batch 15/
├── app.py
├── eye_disease_model.h5
├── resnet.ipynb
├── README.md
├── accuracy_graph.png
├── loss_graph.png
├── final_accuracy.png
├── final_loss.png
├── dataset/
│   ├── cataract/
│   ├── diabetic_retinopathy/
│   ├── glaucoma/
│   └── normal/
├── static/
│   ├── script.js
│   ├── script_new.js
│   └── style.css
└── templates/
    └── index.html
```

---

## 🌐 Web Application Flow

1. User uploads an eye image.
2. Flask receives the image at the `/predict` endpoint.
3. The image is resized to `224x224` and normalized.
4. The trained model predicts the class.
5. The system returns:
   - predicted disease name,
   - confidence score,
   - class probabilities,
   - and a medical alert if needed.

---

## ⚙️ Tech Stack

| Layer | Tools Used |
|------|------------|
| Backend | `Python`, `Flask` |
| Deep Learning | `TensorFlow`, `Keras`, `NumPy` |
| Image Processing | `Pillow` |
| Frontend | `HTML`, `CSS`, `JavaScript` |
| Visualization | `Matplotlib` |

---

## 📈 Performance

The current saved model provides a **promising baseline** for multi-class eye disease classification.

### Verified local result
A fresh evaluation of the saved model on the current local validation split (`841` images) produced:

- **Validation Accuracy:** `62.66%`
- **Validation Loss:** `1.2860`

This shows the project is working end-to-end and provides a solid foundation for further improvement.

### Target improvement direction
With stronger transfer learning (such as **ResNet50 / EfficientNet**), class balancing, more epochs, and hyperparameter tuning, this project can be further improved toward **95%+ accuracy goals** in future iterations.

> Important: only claim **95%+ accuracy** in reports or presentations after verifying it with a fresh evaluation.

---

## 🖼️ Training Curves

You can use the generated plots in your presentation/report:

- `accuracy_graph.png`
- `loss_graph.png`
- `final_accuracy.png`
- `final_loss.png`

If GitHub image preview is enabled, you can also display them like this:

```md
![Accuracy Graph](accuracy_graph.png)
![Loss Graph](loss_graph.png)
```

---

## 8️⃣ Software Requirements

Before running the project, make sure you have:

- `Python 3.10` or `Python 3.11` installed (`python.exe`, 64-bit)
- `pip` enabled
- the project `requirements.txt` file
- a supported eye image in one of these formats: `.png`, `.jpg`, `.jpeg`, `.gif`

### Install all required packages

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

---

## ▶️ How to Run the Project

### 1) Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 2) Start the Flask app

```bash
python app.py
```

### 3) Open in browser

```bash
http://127.0.0.1:5000/
```

---

## 🔍 API Endpoint

### `POST /predict`
Uploads an image and returns the predicted result.

**Supported image file formats:** `png`, `jpg`, `jpeg`, `gif`

#### Example JSON response
```json
{
  "prediction": "glaucoma",
  "confidence": "87.4%",
  "probabilities": {
    "cataract": "3.2%",
    "diabetic_retinopathy": "5.8%",
    "glaucoma": "87.4%",
    "normal": "3.6%"
  },
  "notification": "⚠️ Glaucoma detected! Please consult an eye specialist immediately."
}
```

---

## 🔮 Future Enhancements

- Improve validation accuracy with better architectures
- Add confusion matrix and classification report
- Deploy on Render, Railway, or Hugging Face Spaces
- Add patient report download option
- Add explainable AI visualization directly in the web app
- Support webcam capture and real-time screening

---

## ⚠️ Disclaimer

This application is intended for:
- academic projects,
- learning purposes,
- AI demonstrations,
- and preliminary screening research.

It must **not** be used as a final medical decision system.

---

## 🙌 Acknowledgements

- Kaggle dataset contributors
- TensorFlow / Keras community
- Flask open-source ecosystem

---

## 👨‍💻 Author Note

This project demonstrates the practical integration of **deep learning + medical image analysis + web deployment** in one complete workflow. 
