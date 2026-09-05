# PneumoScan AI frontend

A responsive React frontend for **Pneumonia Detection Using Chest X-Ray Images**. It uses a client-side mock prediction service today and is structured to connect to a FastAPI `POST /predict` endpoint later.

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To create a production build:

```bash
npm run build
```

## Connecting the backend later

The temporary prediction code is in `src/services/predictionService.ts`. Replace `requestPrediction` with a multipart request like this:

```ts
const formData = new FormData()
formData.append('image', image)

const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: formData,
})

if (!response.ok) throw new Error('Prediction failed')
return response.json()
```

Have FastAPI return this shape:

```json
{
  "prediction": "Bacterial Pneumonia",
  "confidence": 94.2,
  "probabilities": {
    "Normal": 2.1,
    "Bacterial Pneumonia": 94.2,
    "Viral Pneumonia": 3.7
  }
}
```
