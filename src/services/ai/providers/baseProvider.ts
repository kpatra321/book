import { AICompletionParams } from '../../../types/ai';

export interface AIProviderAdapter {
  id: string;
  name: string;
  isConfigured: () => boolean;
  complete: (params: AICompletionParams) => Promise<string>;
}
