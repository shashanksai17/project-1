import type { PredictionResult } from '../types'

export async function requestPrediction(image: File): Promise<PredictionResult> {
  const formData = new FormData()
  formData.append('image', image)

  const response = await fetch('/api/predict', { method: 'POST', body: formData })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? 'Prediction failed.')
  }
  return response.json()
}
