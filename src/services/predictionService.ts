import type { PredictionClass, PredictionResult } from '../types'

const classes: PredictionClass[] = ['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia']

/**
 * Temporary client-side stand-in for the future inference service.
 * Replace its body with: fetch('/predict', { method: 'POST', body: formData })
 * when the FastAPI backend is ready.
 */
export async function requestPrediction(_image: File): Promise<PredictionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 2000))

  const prediction = classes[Math.floor(Math.random() * classes.length)]
  const confidence = Number((88 + Math.random() * 10.8).toFixed(1))
  const remainder = 100 - confidence
  const otherClasses = classes.filter((item) => item !== prediction)
  const firstOther = Number((Math.random() * remainder).toFixed(1))

  return {
    prediction,
    confidence,
    probabilities: {
      [prediction]: confidence,
      [otherClasses[0]]: firstOther,
      [otherClasses[1]]: Number((remainder - firstOther).toFixed(1)),
    } as Record<PredictionClass, number>,
  }
}
