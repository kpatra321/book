import { AIProviderAdapter } from './baseProvider';
import { AICompletionParams } from '../../../types/ai';

export class GeminiAdapter implements AIProviderAdapter {
  id = 'gemini';
  name = 'Google Gemini API';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = '', model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async complete(params: AICompletionParams): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API Key is not configured. Please set your API key in Settings.');
    }

    let fullPrompt = '';
    if (params.systemPrompt) {
      fullPrompt += `System Directive: ${params.systemPrompt}\n\n`;
    }
    if (params.contextChunks && params.contextChunks.length > 0) {
      fullPrompt += `Reference Documents:\n${params.contextChunks.join('\n---\n')}\n\n`;
    }
    fullPrompt += `Task: ${params.prompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: params.temperature ?? 0.3,
          maxOutputTokens: params.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }
}
