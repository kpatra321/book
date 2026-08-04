import { getSettings } from '../db/indexDB';
import { ragEngine } from './ragEngine';
import { OpenAIAdapter } from './providers/openaiProvider';
import { GeminiAdapter } from './providers/geminiProvider';
import { ClaudeAdapter, OllamaAdapter, ManualAdapter } from './providers/claudeProvider';
import { AIProviderAdapter } from './providers/baseProvider';
import { RAGQueryResult } from '../../types/rag';

export class AIService {
  private async getActiveAdapter(): Promise<AIProviderAdapter> {
    const settings = await getSettings();

    switch (settings.activeProvider) {
      case 'openai':
        return new OpenAIAdapter(settings.openaiKey, settings.openaiModel);
      case 'gemini':
        return new GeminiAdapter(settings.geminiKey, settings.geminiModel);
      case 'claude':
        return new ClaudeAdapter(settings.claudeKey, settings.claudeModel);
      case 'ollama':
        return new OllamaAdapter(settings.ollamaUrl, settings.ollamaModel);
      case 'none':
      default:
        return new ManualAdapter();
    }
  }

  /**
   * RAG Query with forced evidence citation
   */
  async askWithRAG(bookId: string, query: string): Promise<RAGQueryResult> {
    const citations = await ragEngine.searchKnowledgeBase(bookId, query, 5);
    const adapter = await this.getActiveAdapter();

    if (citations.length === 0) {
      return {
        answer: "No relevant evidence found in uploaded documents to answer this question. (OpenBook AI never invents information without evidence).",
        citations: [],
        usedChunks: 0,
        query,
      };
    }

    const context = ragEngine.buildPromptContext(citations);
    const systemPrompt = `You are OpenBook AI, an evidence-only book builder assistant.
CRITICAL RULES:
1. NEVER invent information. Use ONLY the provided citation evidence.
2. ALWAYS cite sources inline using [Source: filename, Page/Row X].
3. Maintain professional government/technical document formatting.`;

    const answer = await adapter.complete({
      prompt: query,
      systemPrompt,
      contextChunks: [context],
      temperature: 0.2,
    });

    return {
      answer,
      citations,
      usedChunks: citations.length,
      query,
    };
  }

  /**
   * Helper functions for automated document operations
   */
  async cleanFormatting(text: string): Promise<string> {
    const adapter = await this.getActiveAdapter();
    return adapter.complete({
      prompt: `Clean formatting, fix typos, fix spacing, and format into clean markdown:\n\n${text}`,
      systemPrompt: 'You are a document formatter. Clean up text without changing facts or factual numbers.',
    });
  }

  async generateTOC(chapterTitles: string[]): Promise<string> {
    return `# Table of Contents\n\n` + chapterTitles.map((title, i) => `${i + 1}. [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`).join('\n');
  }

  async generateGlossary(text: string): Promise<string> {
    const adapter = await this.getActiveAdapter();
    return adapter.complete({
      prompt: `Extract key technical terms, species names, or departmental terminology and build an alphabetical Glossary table in markdown:\n\n${text}`,
      systemPrompt: 'Generate a clean 2-column Markdown table with Term and Definition.',
    });
  }

  async generateSummary(text: string): Promise<string> {
    const adapter = await this.getActiveAdapter();
    return adapter.complete({
      prompt: `Provide an executive summary of the following chapter text:\n\n${text}`,
      systemPrompt: 'Summarize concisely using bullet points.',
    });
  }
}

export const aiService = new AIService();
