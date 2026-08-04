import { ExtractedDocumentData } from './file';
import { Book, Chapter } from './book';

export type PluginType = 'parser' | 'template' | 'exporter' | 'ai_provider';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  type: PluginType;
  description: string;
  author: string;
}

export interface ParserPlugin extends PluginManifest {
  type: 'parser';
  fileExtensions: string[];
  parse: (file: File | Blob, filename: string) => Promise<ExtractedDocumentData>;
}

export interface TemplatePlugin extends PluginManifest {
  type: 'template';
  category: string;
  getInitialChapters: (title: string) => Chapter[];
  autoCategorizeContent?: (extractedData: ExtractedDocumentData[]) => Chapter[];
}

export interface ExporterPlugin extends PluginManifest {
  type: 'exporter';
  extension: string;
  mimeType: string;
  exportBook: (book: Book, options?: Record<string, any>) => Promise<Blob>;
}

export interface AIProviderPlugin extends PluginManifest {
  type: 'ai_provider';
  providerKey: string;
  generateText: (prompt: string, options?: Record<string, any>) => Promise<string>;
}
