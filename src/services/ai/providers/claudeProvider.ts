import { AIProviderAdapter } from './baseProvider';
import { AICompletionParams } from '../../../types/ai';

export class ClaudeAdapter implements AIProviderAdapter {
  id = 'claude';
  name = 'Anthropic Claude API';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = '', model: string = 'claude-3-5-haiku-20241022') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async complete(params: AICompletionParams): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Claude API Key is not configured. Please set your API key in Settings.');
    }

    let userContent = params.prompt;
    if (params.contextChunks && params.contextChunks.length > 0) {
      userContent = `CONTEXT DOCUMENTS:\n${params.contextChunks.join('\n---\n')}\n\nUSER PROMPT:\n${params.prompt}`;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: params.maxTokens ?? 2000,
        system: params.systemPrompt || 'You are an open-source client-side document AI assistant.',
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || 'No response generated.';
  }
}

export class OllamaAdapter implements AIProviderAdapter {
  id = 'ollama';
  name = 'Local Ollama API';
  private url: string;
  private model: string;

  constructor(url: string = 'http://localhost:11434', model: string = 'llama3') {
    this.url = url;
    this.model = model;
  }

  isConfigured(): boolean {
    return true; // Local endpoint assumes running
  }

  async complete(params: AICompletionParams): Promise<string> {
    let fullPrompt = '';
    if (params.systemPrompt) {
      fullPrompt += `System: ${params.systemPrompt}\n\n`;
    }
    if (params.contextChunks && params.contextChunks.length > 0) {
      fullPrompt += `Documents:\n${params.contextChunks.join('\n\n')}\n\n`;
    }
    fullPrompt += `Prompt: ${params.prompt}`;

    const res = await fetch(`${this.url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API connection failed at ${this.url}. Please make sure Ollama is running locally.`);
    }

    const data = await res.json();
    return data.response || 'No response generated.';
  }
}

export class ManualAdapter implements AIProviderAdapter {
  id = 'none';
  name = 'Manual / AI Disabled';

  isConfigured(): boolean {
    return true;
  }

  async complete(params: AICompletionParams): Promise<string> {
    return `[AI Disabled Mode]\nNo remote or local AI provider is currently active. You can edit chapters manually or configure an API key / WebLLM in Settings.`;
  }
}
