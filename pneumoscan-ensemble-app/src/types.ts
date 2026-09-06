export type PredictionClass = 'Normal' | 'Bacterial Pneumonia' | 'Viral Pneumonia'

export interface PredictionResult {
  prediction: PredictionClass
  confidence: number
  probabilities: Record<PredictionClass, number>
}
