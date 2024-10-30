export type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type GptResponseType = GptOcrResponse | GptProviderResponse | GptAnalysisResponse | GptSocialProfilerResponse;

export interface GptOcrResponse {
  // Add OCR response type details
}

export interface GptProviderResponse {
  // Add provider response type details  
}

export interface GptAnalysisResponse {
  // Add analysis response type details
}

export interface GptSocialProfilerResponse {
  // Add social profiler response type details
}
