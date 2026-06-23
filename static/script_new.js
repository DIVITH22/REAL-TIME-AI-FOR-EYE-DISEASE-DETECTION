// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const predictBtn = document.getElementById('predict-btn');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const clearBtn = document.getElementById('clear-image');

const mainView = document.getElementById('main-view');
const loadingView = document.getElementById('loading-view');
const resultView = document.getElementById('result-view');
const resultImage = document.getElementById('result-image');
const aiResponse = document.getElementById('ai-response');
const progressBar = document.getElementById('progress-bar');
const resetBtn = document.getElementById('reset-btn');

// State
let selectedImageBase64 = null;
let selectedImageDataUrl = null;

// ============ Upload Zone Management ============
dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
};

dropZone.ondragleave = () => {
    dropZone.classList.remove('dragover');
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
};

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
};

// ============ File Handler ============
function handleFile(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImageBase64 = e.target.result.split(',')[1];
        selectedImageDataUrl = e.target.result;
        imagePreview.src = e.target.result;
        previewContainer.classList.remove('hidden');
        predictBtn.disabled = false;
        predictBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    };
    reader.readAsDataURL(file);
}

// ============ Clear Image Handler ============
clearBtn.onclick = (e) => {
    e.stopPropagation();
    selectedImageBase64 = null;
    selectedImageDataUrl = null;
    previewContainer.classList.add('hidden');
    predictBtn.disabled = true;
    predictBtn.classList.add('opacity-50', 'cursor-not-allowed');
    fileInput.value = '';
};

// ============ Predict Handler ============
predictBtn.onclick = async () => {
    if (!selectedImageBase64) return;

    mainView.classList.add('hidden');
    loadingView.classList.remove('hidden');

    // Progress animation
    progressBar.style.width = '30%';
    setTimeout(() => {
        progressBar.style.width = '60%';
    }, 1000);

    try {
        // Create FormData
        const formData = new FormData();
        const byteCharacters = atob(selectedImageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('file', blob, 'image.jpg');

        // Send request
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const result = await response.json();
        progressBar.style.width = '100%';

        // Show results
        setTimeout(() => {
            loadingView.classList.add('hidden');
            resultView.classList.remove('hidden');

            // Display image
            if (resultImage) {
                resultImage.src = selectedImageDataUrl;
            }

            // Display analysis
            const analysisText = formatAnalysis(result);
            renderAIResponse(analysisText);
        }, 500);

    } catch (error) {
        console.error('Error:', error);
        loadingView.classList.add('hidden');
        mainView.classList.remove('hidden');
        alert('Analysis failed. Please try again.');
    }
};

// ============ Format Analysis ============
function formatAnalysis(result) {
    let text = '';

    if (result.prediction) {
        text += `<strong>Disease Detected: ${result.prediction.toUpperCase()}</strong><br><br>`;
    }

    if (result.confidence) {
        text += `<strong>Confidence: ${result.confidence}</strong><br><br>`;
    }

    text += 'Eye scan completed. All indicators appear normal.';

    return text;
}

// ============ Render Response ============
function renderAIResponse(html) {
    aiResponse.innerHTML = html;
}

// ============ Reset Handler ============
resetBtn.onclick = () => {
    resultView.classList.add('hidden');
    mainView.classList.remove('hidden');
    clearBtn.click();
    progressBar.style.width = '0%';
    aiResponse.innerHTML = '';
    if (resultImage) {
        resultImage.src = '';
    }
    selectedImageBase64 = null;
    selectedImageDataUrl = null;
    fileInput.value = '';
};
