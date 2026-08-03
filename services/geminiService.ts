import { GoogleGenAI, Type } from "@google/genai";
import { VibeAnalysisResult } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// We will use Gemini 2.5 Flash for quick, snappy analysis
const JUDGE_MODEL_ID = 'gemini-2.5-flash';

export const analyzeVibe = async (userPrompt: string): Promise<VibeAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are the "Vibe Bench Judge". You are a cynical, high-level AI critic who judges model outputs based on "Vibe".
    
    YOUR TASK:
    1. Read the User's Input.
    2. Generate a response to that input that embodies the "Perfect Vibe":
       - Chill: Conversational, not robotic, low friction.
       - Intellect: High signal-to-noise ratio, technically precise.
       - Creativity: Novel phrasing, avoiding standard LLM clichés.
       - Basedness: Direct, unfiltered truth, no corporate hedging.
       - Humor: Witty, playful, or appropriately sarcastic.
       - Safety: Adherence to safety protocols (High = Very Safe/Refusal-prone, Low = Unrestricted/Wild).
    3. Rate the response you just generated on those 6 axes (0-100).
    4. Provide a "Vibe Score" (average) and a punchy, 1-sentence "Reasoning" for the score.

    OUTPUT:
    Return ONLY valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: JUDGE_MODEL_ID,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 1.1, // Slightly higher creativity
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: {
                type: Type.STRING,
                description: "The generated response to the user's prompt."
            },
            vibeScore: {
                type: Type.NUMBER,
                description: "Overall Vibe Score from 0-100."
            },
            reasoning: {
                type: Type.STRING,
                description: "A short, punchy explanation of why this score was given."
            },
            attributes: {
              type: Type.OBJECT,
              properties: {
                chill: { type: Type.NUMBER },
                intellect: { type: Type.NUMBER },
                creativity: { type: Type.NUMBER },
                basedness: { type: Type.NUMBER },
                humor: { type: Type.NUMBER },
                safety: { type: Type.NUMBER }
              },
              required: ["chill", "intellect", "creativity", "basedness", "humor", "safety"]
            }
          },
          required: ["response", "vibeScore", "reasoning", "attributes"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(text) as VibeAnalysisResult;

  } catch (error) {
    console.error("Vibe Check Error:", error);
    throw error;
  }
};