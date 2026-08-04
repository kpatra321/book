import * as XLSX from 'xlsx';
import { Book } from '../../types/book';

export async function exportBookTablesToSpreadsheet(book: Book): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = [
    ['Property', 'Value'],
    ['Book Title', book.title],
    ['Author', book.metadata.author],
    ['Publisher', book.metadata.publisher || ''],
    ['Edition', book.metadata.edition || ''],
    ['Language', book.metadata.language],
    ['Total Chapters', book.chapters.length],
    ['Created At', new Date(book.createdAt).toISOString()],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Book Summary');

  // Extract Markdown tables from chapters into dedicated sheets
  let tableIndex = 1;
  for (const chapter of book.chapters) {
    const tableRegex = /\|(.+)\|/g;
    const matches = chapter.content.match(tableRegex);
    if (matches && matches.length > 2) {
      const rows = matches.map(rowStr => rowStr.split('|').map(cell => cell.trim()).filter(Boolean));
      // Exclude separator line (| --- |)
      const cleanRows = rows.filter(r => !r[0]?.startsWith('---'));
      if (cleanRows.length > 0) {
        const sheet = XLSX.utils.aoa_to_sheet(cleanRows);
        const sheetName = (chapter.title.slice(0, 25) + ` T${tableIndex++}`).replace(/[\\/?*:[\]]/g, '');
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
      }
    }
  }

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
