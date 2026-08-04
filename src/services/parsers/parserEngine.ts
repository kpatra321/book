import { ExtractedDocumentData, FileType } from '../../types/file';
import { parsePDF } from './pdfParser';
import { parseDOCX } from './docxParser';
import { parseSpreadsheet } from './excelParser';
import { parseImageOCR } from './ocrParser';
import { parseMarkdownText } from './markdownParser';
import { pluginRegistry } from '../plugins/pluginRegistry';

export async function parseDocumentFile(file: Blob, filename: string, fileType: FileType): Promise<ExtractedDocumentData> {
  const extension = filename.split('.').pop() || '';

  // Check if a registered plugin handles this extension first
  const customParser = pluginRegistry.getParserForExtension(extension);
  if (customParser) {
    return customParser.parse(file, filename);
  }

  switch (fileType) {
    case 'pdf':
      return parsePDF(file, filename);
    case 'docx':
    case 'doc':
    case 'odt':
    case 'rtf':
      return parseDOCX(file, filename);
    case 'csv':
    case 'excel':
      return parseSpreadsheet(file, filename);
    case 'image':
      return parseImageOCR(file, filename);
    case 'markdown':
    case 'txt':
    case 'json':
    default:
      return parseMarkdownText(file, filename);
  }
}
