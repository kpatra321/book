import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ExtractedDocumentData, DocumentChunk, DocumentTable } from '../../types/file';

export async function parseSpreadsheet(file: Blob, filename: string): Promise<ExtractedDocumentData> {
  const isCSV = filename.toLowerCase().endsWith('.csv');

  if (isCSV) {
    const text = await file.text();
    return new Promise((resolve) => {
      Papa.parse(text, {
        complete: (results) => {
          const rows = results.data as string[][];
          const headers = rows[0] || [];
          const dataRows = rows.slice(1).filter(r => r.some(Boolean));

          const table: DocumentTable = {
            id: `${filename}-table-0`,
            headers,
            rows: dataRows,
            sheetName: 'Sheet1',
          };

          const markdownTable = formatTableToMarkdown(headers, dataRows);

          const chunks: DocumentChunk[] = dataRows.map((row, idx) => ({
            id: `${filename}-row-${idx}`,
            fileId: filename,
            fileName: filename,
            content: row.join(' | '),
            type: 'table',
            sheetName: 'Sheet1',
            rowNumber: idx + 2,
          }));

          resolve({
            text: markdownTable,
            headings: [filename],
            chunks,
            tables: [table],
            images: [],
            metadata: {
              sheets: ['Sheet1'],
            },
          });
        },
      });
    });
  }

  // Handle XLSX / XLS
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;

  const tables: DocumentTable[] = [];
  const chunks: DocumentChunk[] = [];
  let combinedText = '';

  sheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

    if (jsonData.length > 0) {
      const headers = (jsonData[0] || []).map(String);
      const rows = jsonData.slice(1).map((row) => row.map(cell => String(cell ?? '')));

      tables.push({
        id: `${filename}-${sheetName}`,
        title: sheetName,
        headers,
        rows,
        sheetName,
      });

      const mdTable = formatTableToMarkdown(headers, rows);
      combinedText += `\n### Sheet: ${sheetName}\n` + mdTable + '\n';

      rows.forEach((row, rIdx) => {
        chunks.push({
          id: `${filename}-${sheetName}-r${rIdx}`,
          fileId: filename,
          fileName: filename,
          content: `${sheetName} Row ${rIdx + 2}: ` + row.join(' | '),
          type: 'table',
          sheetName,
          rowNumber: rIdx + 2,
        });
      });
    }
  });

  return {
    text: combinedText,
    headings: sheetNames,
    chunks,
    tables,
    images: [],
    metadata: {
      sheets: sheetNames,
    },
  };
}

export function formatTableToMarkdown(headers: string[], rows: string[][]): string {
  if (headers.length === 0) return '';
  const headerLine = '| ' + headers.join(' | ') + ' |';
  const separatorLine = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const rowLines = rows.map((r) => '| ' + r.join(' | ') + ' |');
  return [headerLine, separatorLine, ...rowLines].join('\n');
}
