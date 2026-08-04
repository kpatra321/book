import { Chapter } from '../types/book';
import { ExtractedDocumentData } from '../types/file';

export const FOREST_BEAT_CHAPTERS: { title: string; type: Chapter['type']; defaultContent: string }[] = [
  { title: 'Title Page', type: 'title_page', defaultContent: '# Forest Beat Handbook\n\n**Beat Name:** [Beat Name]\n**Range:** [Range Name]\n**Division:** [Division Name]\n**State:** [State Name]\n\n---' },
  { title: 'Certificate of Verification', type: 'certificate', defaultContent: '### Certificate\nThis Beat Handbook has been inspected and verified for official departmental record.\n\n**Beat Guard Signature:** _______________\n**Range Forest Officer Signature:** _______________' },
  { title: 'Foreword', type: 'foreword', defaultContent: '### Foreword\nThis handbook provides comprehensive baseline information for effective management and protection of the forest beat.' },
  { title: 'Preface & Acknowledgement', type: 'preface', defaultContent: '### Preface\nCompiled from official beat registers, GPS surveys, and departmental records.' },
  { title: 'Table of Contents', type: 'toc', defaultContent: '<!-- Auto-generated Table of Contents -->' },
  { title: '1. Beat Introduction & Overview', type: 'chapter', defaultContent: '### 1.1 Geographic Location\nDetailing the boundary, range affiliation, and administrative jurisdiction.' },
  { title: '2. Administrative Setup & Staff Details', type: 'chapter', defaultContent: '### Staff Hierarchy\n| Designation | Name | Contact Number | Headquarters |\n| --- | --- | --- | --- |\n| Forest Section Officer | | | |\n| Beat Guard | | | |\n| Forest Watcher | | | |' },
  { title: '3. Reserved & Protected Forests (RF/PRF)', type: 'chapter', defaultContent: '### Reserved Forests\n| RF Name | Compartment Nos | Area (Ha) | Notification No & Date |\n| --- | --- | --- | --- |' },
  { title: '4. Revenue Villages & Demography', type: 'chapter', defaultContent: '### Revenue Villages in Beat\n| Village Name | Population | Households | Primary Source of Livelihood |\n| --- | --- | --- | --- |' },
  { title: '5. Plantation History & Operations', type: 'chapter', defaultContent: '### Plantation Overview\nSummary of afforestation activities, ANR, and species selection.' },
  { title: '6. Year-wise Plantation Data', type: 'chapter', defaultContent: '### Year-wise Plantation Register\n| Year | Location/Compartment | Area (Ha) | Major Species | Survival % |\n| --- | --- | --- | --- | --- |' },
  { title: '7. Species-wise Plantation Data', type: 'chapter', defaultContent: '### Species Breakdown\n| Species Name (Botanical / Local) | Total Planted | Major Use |\n| --- | --- | --- |' },
  { title: '8. ANR (Assisted Natural Regeneration) Areas', type: 'chapter', defaultContent: '### ANR Details\n| Block Name | Compartment | Area (Ha) | Year of Operation |\n| --- | --- | --- | --- |' },
  { title: '9. Bamboo & Medicinal Plantations', type: 'chapter', defaultContent: '### Bamboo & NTFP Resources\n| Location | Area (Ha) | Species | Yield / Condition |\n| --- | --- | --- | --- |' },
  { title: '10. Wildlife & Habitat Information', type: 'chapter', defaultContent: '### Fauna Register\nKey mammal species, bird censuses, waterhole locations, and corridor movement.' },
  { title: '11. Forest Protection & Offence Cases', type: 'chapter', defaultContent: '### Offence Record\n| Case No | Date | Offence Type | Location | Status / Action Taken |\n| --- | --- | --- | --- | --- |' },
  { title: '12. Encroachment Details', type: 'chapter', defaultContent: '### Encroachment Status\n| Compartment | Land Type | Area (Ha) | Encroacher Name / Details | Legal Action |\n| --- | --- | --- | --- | --- |' },
  { title: '13. Fire Lines & Protection Works', type: 'chapter', defaultContent: '### Fire Line Maintenance\n| Fire Line Name | Length (Km) | Width (M) | Last Maintenance Date |\n| --- | --- | --- | --- |' },
  { title: '14. Infrastructure: Roads, Buildings & Water Bodies', type: 'chapter', defaultContent: '### Departmental Assets\n- Forest Guard Quarter\n- Inspection Hut / Watch Tower\n- Beat Patrol Roads (Km)\n- Water Bodies / Anicut Check Dams' },
  { title: '15. Joint Forest Management (JFMC / VSS)', type: 'chapter', defaultContent: '### Vana Samrakshana Samithi (VSS)\n| VSS Name | President Name | Member Count | Executive Body Details |\n| --- | --- | --- | --- |' },
  { title: '16. Eco-tourism & Community Initiatives', type: 'chapter', defaultContent: '### Ecotourism Spots\nSpot details, visitor facilities, and nature trail maintenance.' },
  { title: '17. Soil, Climate, Topography & Hydrology', type: 'chapter', defaultContent: '### Environmental Factors\n- Soil Type: Red Loamy / Alluvial\n- Average Rainfall: mm\n- Elevation: meters MSL' },
  { title: '18. Maps & GPS Boundary Coordinates', type: 'chapter', defaultContent: '### GPS Coordinates & Pillar Locations\n| Boundary Pillar No | Latitude (N) | Longitude (E) | Remarks |\n| --- | --- | --- | --- |' },
  { title: '19. Annexures & Reference Records', type: 'annexure', defaultContent: '### Annexure List\n1. Notification Copies\n2. Gazette Extracts\n3. Maps' },
  { title: 'Glossary & Local Terminology', type: 'glossary', defaultContent: '### Glossary\n- **RF:** Reserved Forest\n- **PRF:** Protected Reserved Forest\n- **JFMC:** Joint Forest Management Committee\n- **ANR:** Assisted Natural Regeneration' },
  { title: 'Index & Back Cover', type: 'back_cover', defaultContent: '---\n**Official Forest Beat Handbook**\n*Forest Department*' },
];

export function getForestBeatInitialChapters(title: string): Chapter[] {
  return FOREST_BEAT_CHAPTERS.map((ch, order) => ({
    id: `forest-beat-ch-${order}`,
    title: ch.title,
    type: ch.type,
    content: ch.defaultContent.replace('[Beat Name]', title),
    order,
    isCollapsible: true,
    isExpanded: true,
  }));
}

/**
 * Auto-categorizes extracted spreadsheets & documents into Forest Beat Handbook chapters
 */
export function autoCategorizeForestData(extractedDocs: ExtractedDocumentData[]): Record<string, string> {
  const chapterUpdates: Record<string, string> = {};

  extractedDocs.forEach(doc => {
    doc.tables.forEach(table => {
      const headerStr = table.headers.join(' ').toLowerCase();
      
      if (headerStr.includes('year') && headerStr.includes('plantation')) {
        chapterUpdates['6. Year-wise Plantation Data'] = `### Extracted Year-wise Plantation Data\nSource File: ${table.title || 'Table'}\n\n` + tableToMarkdown(table);
      } else if (headerStr.includes('species') || headerStr.includes('botanical')) {
        chapterUpdates['7. Species-wise Plantation Data'] = `### Extracted Species Data\nSource File: ${table.title || 'Table'}\n\n` + tableToMarkdown(table);
      } else if (headerStr.includes('offence') || headerStr.includes('case')) {
        chapterUpdates['11. Forest Protection & Offence Cases'] = `### Extracted Offence Cases\nSource File: ${table.title || 'Table'}\n\n` + tableToMarkdown(table);
      } else if (headerStr.includes('pillar') || headerStr.includes('latitude') || headerStr.includes('gps')) {
        chapterUpdates['18. Maps & GPS Boundary Coordinates'] = `### Extracted GPS Boundary Coordinates\nSource File: ${table.title || 'Table'}\n\n` + tableToMarkdown(table);
      } else if (headerStr.includes('village') || headerStr.includes('population')) {
        chapterUpdates['4. Revenue Villages & Demography'] = `### Extracted Revenue Village Information\nSource File: ${table.title || 'Table'}\n\n` + tableToMarkdown(table);
      }
    });
  });

  return chapterUpdates;
}

function tableToMarkdown(table: { headers: string[]; rows: string[][] }): string {
  const headerLine = '| ' + table.headers.join(' | ') + ' |';
  const sep = '| ' + table.headers.map(() => '---').join(' | ') + ' |';
  const rows = table.rows.map(r => '| ' + r.join(' | ') + ' |').join('\n');
  return [headerLine, sep, rows].join('\n');
}
