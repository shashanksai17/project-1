# PneumoScan AI

PneumoScan AI is a responsive chest X-ray screening demo for three classes:

- Normal
- Bacterial Pneumonia
- Viral Pneumonia

The existing React interface is connected to a FastAPI backend that runs a soft-voting ensemble of DenseNet-121, EfficientNet-B3, and Swin-Tiny. The trained checkpoints are downloaded once from the public [PneumoScan Hugging Face Space](https://huggingface.co/spaces/shanthan5589/pneumoscan-ai) and verified against the SHA-256 values in `models/weights_checksums.json`. No training or test data is included.

## Run the complete app with Docker

Docker is the simplest option. The first start downloads approximately 182 MB of model checkpoints.

```bash
docker build -t pneumoscan-ai .
docker run --rm -p 7860:7860 pneumoscan-ai
```

Open `http://localhost:7860`.

## Run locally for development

Requirements:

- Python 3.10 or 3.11
- Node.js 18 or newer
- npm 9 or newer

Create the Python environment and install the backend:

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install torch==2.7.1 torchvision==0.22.1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

On macOS or Linux:

```bash
source .venv/bin/activate
python -m pip install --upgrade pip
pip install torch==2.7.1 torchvision==0.22.1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

In a second terminal, start the React development server:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Vite proxies `/api` requests to FastAPI on port 8000.

The backend automatically uses CUDA when a compatible PyTorch installation and NVIDIA GPU are available. It also runs on CPU, with slower predictions.

## API

`POST /api/predict` accepts multipart form data with an `image` field. JPG and PNG files up to 10 MB are supported.

```bash
curl -X POST -F "image=@chest-xray.jpg" http://localhost:8000/api/predict
```

`GET /api/health` reports whether the service and all three models loaded successfully.

The ensemble uses weights 0.6, 0.3, and 0.1 for DenseNet-121, EfficientNet-B3, and Swin-Tiny. Its held-out mixed-source test result was 80.59% accuracy and 0.778 macro-F1. Because every source appeared in training, validation, and testing, these figures do not measure generalization to a new hospital.
