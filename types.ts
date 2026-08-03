export enum ModelProvider {
  Google = "Google",
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Meta = "Meta",
  Mistral = "Mistral",
  DeepSeek = "DeepSeek",
  Tencent = "Tencent",
  Bytedance = "Bytedance",
  Alibaba = "Alibaba"
}

export interface VibeAttributes {
  chill: number;
  intellect: number;
  creativity: number;
  speed: number;
  basedness: number;
  humor: number;
  safety: number;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: ModelProvider;
  elo: number;
  vibeScore: number; // 0-100
  votes: number;
  contextWindow: number; // Kept for compatibility, can be 0 or resolution
  pricePerMInput: number; // Used as Cost Index for visual
  releaseDate: string;
  attributes: VibeAttributes;
  description: string;
}

export interface VibeAnalysisResult {
  response: string;
  vibeScore: number;
  reasoning: string;
  attributes: {
    chill: number;
    intellect: number;
    creativity: number;
    basedness: number;
    humor: number;
    safety: number;
  };
}