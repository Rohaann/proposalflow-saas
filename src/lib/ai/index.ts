import { createOpenAI } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';

export type AIProvider = 'openrouter';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getProviderModel(modelName: string = 'anthropic/claude-3.5-sonnet') {
  // Use OpenRouter for all models
  return openrouter(modelName);
}

export async function generateContent(prompt: string, system: string, modelName: string = 'anthropic/claude-3.5-sonnet') {
  try {
    const { text } = await generateText({
      model: getProviderModel(modelName),
      system,
      prompt,
    });
    return text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate content.");
  }
}

export async function generateStructuredData<T>(prompt: string, system: string, schema: any, modelName: string = 'anthropic/claude-3.5-sonnet') {
  try {
    const { object } = await generateObject({
      model: getProviderModel(modelName),
      system,
      prompt,
      schema,
    });
    return object as T;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate structured data.");
  }
}
