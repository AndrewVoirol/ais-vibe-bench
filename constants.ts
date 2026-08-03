import { LLMModel, ModelProvider } from './types';

// DATA SOURCE: User provided Image Generation Leaderboard (Gemini 3 Pro, Hunyuan, etc.)

export const MOCK_MODELS: LLMModel[] = [
  {
    id: "gemini-3-pro-image-preview",
    name: "Gemini 3 Pro Image",
    provider: ModelProvider.Google,
    elo: 1242,
    vibeScore: 99,
    votes: 3720,
    contextWindow: 0,
    pricePerMInput: 6.00,
    releaseDate: "2025-02-15",
    attributes: { chill: 90, intellect: 98, creativity: 100, speed: 95, basedness: 92, humor: 85, safety: 95 },
    description: "The new King of Pixels. 'nano-banana-pro' architecture delivers photorealism that finally surpasses Midjourney. Incredible prompt adherence."
  },
  {
    id: "hunyuan-image-3.0",
    name: "Hunyuan Image 3.0",
    provider: ModelProvider.Tencent,
    elo: 1161,
    vibeScore: 92,
    votes: 57245,
    contextWindow: 0,
    pricePerMInput: 2.50,
    releaseDate: "2025-01-20",
    attributes: { chill: 85, intellect: 88, creativity: 94, speed: 80, basedness: 85, humor: 60, safety: 80 },
    description: "Tencent's powerhouse. Massive voting volume suggests this is the community favorite for general purpose generation. Excellent Asian-aesthetic optimization."
  },
  {
    id: "gemini-2.5-flash-image-preview",
    name: "Gemini 2.5 Flash Img",
    provider: ModelProvider.Google,
    elo: 1158,
    vibeScore: 95,
    votes: 579254,
    contextWindow: 0,
    pricePerMInput: 0.50,
    releaseDate: "2024-12-10",
    attributes: { chill: 98, intellect: 90, creativity: 92, speed: 100, basedness: 90, humor: 80, safety: 92 },
    description: "The speed demon. Over half a million votes confirm this is the daily driver for most users. Instant generation with near-Pro quality."
  },
  {
    id: "seedream-4-2k",
    name: "Seedream 4 2k",
    provider: ModelProvider.Bytedance,
    elo: 1144,
    vibeScore: 89,
    votes: 14507,
    contextWindow: 0,
    pricePerMInput: 4.00,
    releaseDate: "2025-02-01",
    attributes: { chill: 75, intellect: 85, creativity: 96, speed: 70, basedness: 88, humor: 70, safety: 75 },
    description: "Bytedance's 2K resolution specialist. Crisp, detailed, and perfect for wallpaper generation. Slightly slower but worth the wait."
  },
  {
    id: "imagen-4.0-ultra",
    name: "Imagen 4.0 Ultra",
    provider: ModelProvider.Google,
    elo: 1143,
    vibeScore: 91,
    votes: 478685,
    contextWindow: 0,
    pricePerMInput: 5.00,
    releaseDate: "2024-11-15",
    attributes: { chill: 88, intellect: 92, creativity: 90, speed: 85, basedness: 80, humor: 65, safety: 98 },
    description: "The previous SOTA holder. Ultra-realistic photorealism with Google's signature safety rails. Still a top contender for commercial work."
  },
  {
    id: "imagen-4.0-generate",
    name: "Imagen 4.0 Gen",
    provider: ModelProvider.Google,
    elo: 1130,
    vibeScore: 88,
    votes: 479234,
    contextWindow: 0,
    pricePerMInput: 3.00,
    releaseDate: "2024-11-15",
    attributes: { chill: 90, intellect: 85, creativity: 88, speed: 92, basedness: 80, humor: 65, safety: 98 },
    description: "The standard version of Imagen 4. Balanced performance and cost. A workhorse for standard stock photography replacement."
  },
  {
    id: "seedream-4-high-res-fal",
    name: "Seedream 4 Hi-Res",
    provider: ModelProvider.Bytedance,
    elo: 1127,
    vibeScore: 87,
    votes: 47180,
    contextWindow: 0,
    pricePerMInput: 3.50,
    releaseDate: "2025-01-30",
    attributes: { chill: 70, intellect: 80, creativity: 93, speed: 65, basedness: 85, humor: 65, safety: 70 },
    description: "Optimized for FAL infrastructure. High resolution output with a distinct artistic flair typical of Seedream models."
  },
  {
    id: "wan2.5-t2i-preview",
    name: "Wan 2.5 T2I",
    provider: ModelProvider.Alibaba,
    elo: 1124,
    vibeScore: 86,
    votes: 5642,
    contextWindow: 0,
    pricePerMInput: 1.50,
    releaseDate: "2025-02-10",
    attributes: { chill: 80, intellect: 85, creativity: 89, speed: 88, basedness: 82, humor: 60, safety: 85 },
    description: "Alibaba's text-to-image entrant. Great prompt understanding for complex scenes, though style diversity lags behind Gemini."
  },
  {
    id: "gpt-image-1",
    name: "GPT Image 1",
    provider: ModelProvider.OpenAI,
    elo: 1121,
    vibeScore: 93,
    votes: 228474,
    contextWindow: 0,
    pricePerMInput: 8.00,
    releaseDate: "2024-10-05",
    attributes: { chill: 92, intellect: 94, creativity: 85, speed: 90, basedness: 75, humor: 50, safety: 99 },
    description: "OpenAI's dedicated image model. Extremely coherent and safe, but sometimes lacks the raw artistic 'vibe' of the newer models."
  },
  {
    id: "seedream-4-fal",
    name: "Seedream 4 Fal",
    provider: ModelProvider.Bytedance,
    elo: 1118,
    vibeScore: 85,
    votes: 13460,
    contextWindow: 0,
    pricePerMInput: 3.00,
    releaseDate: "2025-01-30",
    attributes: { chill: 75, intellect: 80, creativity: 90, speed: 85, basedness: 85, humor: 65, safety: 75 },
    description: "Standard Seedream on FAL. Solid performance but shadowed by its 2K and High-Res siblings."
  },
  {
    id: "gpt-image-1-mini",
    name: "GPT Image 1 Mini",
    provider: ModelProvider.OpenAI,
    elo: 1099,
    vibeScore: 90,
    votes: 29759,
    contextWindow: 0,
    pricePerMInput: 1.00,
    releaseDate: "2024-10-15",
    attributes: { chill: 95, intellect: 88, creativity: 80, speed: 98, basedness: 80, humor: 60, safety: 95 },
    description: "The efficient choice from OpenAI. Fast, cheap, and good enough for thumbnails and drafts."
  }
];

export const PROVIDER_COLORS: Record<ModelProvider, string> = {
  [ModelProvider.Google]: "#34d399", // Emerald 400
  [ModelProvider.OpenAI]: "#14b8a6", // Teal 500
  [ModelProvider.Anthropic]: "#f97316", // Orange 500
  [ModelProvider.Meta]: "#0ea5e9", // Sky 500
  [ModelProvider.Mistral]: "#eab308", // Yellow 500
  [ModelProvider.DeepSeek]: "#ef4444", // Red 500
  [ModelProvider.Tencent]: "#3b82f6", // Blue 500
  [ModelProvider.Bytedance]: "#06b6d4", // Cyan 500
  [ModelProvider.Alibaba]: "#f43f5e" // Rose 500 (Pinkish-Red, avoids Purple)
};