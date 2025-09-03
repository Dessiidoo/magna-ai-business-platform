import { secret } from "encore.dev/config";

// AI Provider API Keys
export const openAIKey = secret("OpenAIKey");
export const claudeKey = secret("ClaudeKey");
export const geminiKey = secret("GeminiKey");
export const grokKey = secret("GrokKey");
export const copiletKey = secret("CopilotKey");

// Business Intelligence APIs
export const clearbitKey = secret("ClearbitKey");
export const hunterKey = secret("HunterKey");
export const apolloKey = secret("ApolloKey");
export const zoomInfoKey = secret("ZoomInfoKey");

// Market Research APIs
export const semrushKey = secret("SemrushKey");
export const similarWebKey = secret("SimilarWebKey");
