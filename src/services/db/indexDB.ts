import Dexie, { Table } from 'dexie';
import { Book } from '../../types/book';
import { UploadedFile } from '../../types/file';
import { RAGChunkIndex } from '../../types/rag';
import { AISettings } from '../../types/ai';

export class OpenBookDatabase extends Dexie {
  books!: Table<Book, string>;
  files!: Table<UploadedFile, string>;
  ragChunks!: Table<RAGChunkIndex, string>;
  settings!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('OpenBookAIDB');
    this.version(1).stores({
      books: 'id, title, category, isPinned, isArchived, createdAt, updatedAt',
      files: 'id, bookId, name, type, source, uploadedAt',
      ragChunks: 'id, bookId, fileId, fileName, type',
      settings: 'key',
    });
  }
}

export const db = new OpenBookDatabase();

export async function getSettings(): Promise<AISettings> {
  const settingsRow = await db.settings.get('ai_settings');
  if (settingsRow) {
    return settingsRow.value as AISettings;
  }
  return {
    activeProvider: 'none',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3',
    openaiModel: 'gpt-4o-mini',
    geminiModel: 'gemini-1.5-flash',
    claudeModel: 'claude-3-5-haiku-20241022',
  };
}

export async function saveSettings(settings: AISettings): Promise<void> {
  await db.settings.put({ key: 'ai_settings', value: settings });
}
