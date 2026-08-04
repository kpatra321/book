export type AIProviderType =
  | 'none'
  | 'webllm'
  | 'openai'
  | 'gemini'
  | 'claude'
  | 'ollama';

export interface AISettings {
  activeProvider: AIProviderType;
  openaiKey?: string;
  openaiModel?: string;
  geminiKey?: string;
  geminiModel?: string;
  claudeKey?: string;
  claudeModel?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
  webllmModel?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionParams {
  prompt: string;
  systemPrompt?: string;
  contextChunks?: string[];
  temperature?: number;
  maxTokens?: number;
}
