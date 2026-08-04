import { createWorker } from 'tesseract.js';
import { ExtractedDocumentData, DocumentChunk } from '../../types/file';

export async function parseImageOCR(file: Blob, filename: string): Promise<ExtractedDocumentData> {
  const worker = await createWorker('eng');
  const imageUrl = URL.createObjectURL(file);
  
  const ret = await worker.recognize(imageUrl);
  await worker.terminate();
  URL.revokeObjectURL(imageUrl);

  const text = ret.data.text || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const chunks: DocumentChunk[] = lines.map((line, idx) => ({
    id: `${filename}-ocr-${idx}`,
    fileId: filename,
    fileName: filename,
    content: line,
    type: line.length < 50 && /^[A-Z]/.test(line) ? 'heading' : 'paragraph',
  }));

  return {
    text,
    headings: lines.filter(l => l.length < 50 && /^[A-Z]/.test(l)),
    chunks,
    tables: [],
    images: [
      {
        id: `${filename}-img-0`,
        caption: filename,
        dataUrl: await blobToBase64(file),
      }
    ],
    metadata: {
      wordCount: text.split(/\s+/).length,
    },
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
