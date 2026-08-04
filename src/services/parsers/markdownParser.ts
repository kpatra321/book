import { ExtractedDocumentData, DocumentChunk } from '../../types/file';

export async function parseMarkdownText(file: Blob, filename: string): Promise<ExtractedDocumentData> {
  const text = await file.text();
  const headings: string[] = [];
  const chunks: DocumentChunk[] = [];

  const lines = text.split('\n');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      headings.push(headingText);
      chunks.push({
        id: `${filename}-line-${idx}`,
        fileId: filename,
        fileName: filename,
        content: headingText,
        type: 'heading',
      });
    } else if (trimmed.length > 0) {
      chunks.push({
        id: `${filename}-line-${idx}`,
        fileId: filename,
        fileName: filename,
        content: trimmed,
        type: 'paragraph',
      });
    }
  });

  return {
    text,
    headings,
    chunks,
    tables: [],
    images: [],
    metadata: {
      wordCount: text.split(/\s+/).length,
    },
  };
}
