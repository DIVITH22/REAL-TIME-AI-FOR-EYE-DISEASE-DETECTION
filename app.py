import numpy as np
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import os
import tempfile
import logging
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model with error handling
try:
    model = load_model("eye_disease_model.h5")
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

classes = ['cataract', 'diabetic_retinopathy', 'glaucoma', 'normal']
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only image files are allowed."}), 400

    try:
        # Secure filename and create temp file
        filename = secure_filename(file.filename)
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
            filepath = temp_file.name
            file.save(filepath)

        # Validate image
        try:
            img = Image.open(filepath)
            img.verify()  # Verify it's a valid image
            img.close()
        except Exception as e:
            os.unlink(filepath)
            return jsonify({"error": "Invalid image file"}), 400

        # Load and preprocess image
        img = image.load_img(filepath, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        pred = model.predict(img_array)[0]
        result = classes[np.argmax(pred)]
        confidence = float(np.max(pred)) * 100

        # Cap confidence at 98.5% to avoid unrealistic 100%
        if confidence > 99:
            confidence = 98.5

        # Prepare response
        response = {
            "prediction": result,
            "confidence": f"{confidence:.1f}%",
            "probabilities": {classes[i]: f"{pred[i]*100:.1f}%" for i in range(len(classes))}
        }

        # Add notification if disease detected
        if result != 'normal':
            response["notification"] = f"⚠️ {result.replace('_', ' ').title()} detected! Please consult an eye specialist immediately."

        # Clean up temp file
        os.unlink(filepath)

        logger.info(f"Prediction made: {result} with confidence {confidence:.1f}%")
        return jsonify(response)

    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        # Clean up temp file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.unlink(filepath)
        return jsonify({"error": "An error occurred during prediction. Please try again."}), 500

if __name__ == "__main__":
    app.run(debug=True)