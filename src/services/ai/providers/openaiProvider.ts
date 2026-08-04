import { AIProviderAdapter } from './baseProvider';
import { AICompletionParams } from '../../../types/ai';

export class OpenAIAdapter implements AIProviderAdapter {
  id = 'openai';
  name = 'OpenAI API';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = '', model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async complete(params: AICompletionParams): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API Key is not configured. Please set your API key in Settings.');
    }

    const messages = [];
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }

    let userContent = params.prompt;
    if (params.contextChunks && params.contextChunks.length > 0) {
      userContent = `SOURCE EVIDENCE CHUNKS:\n${params.contextChunks.join('\n\n')}\n\nUSER PROMPT:\n${params.prompt}`;
    }

    messages.push({ role: 'user', content: userContent });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: params.temperature ?? 0.3,
        max_tokens: params.maxTokens ?? 2000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}
