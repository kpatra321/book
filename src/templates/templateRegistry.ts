import { getForestBeatInitialChapters } from './forestBeatHandbook';
import { Chapter } from '../types/book';

export interface BookTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  getChapters: (title: string) => Chapter[];
}

export const BOOK_TEMPLATES: BookTemplate[] = [
  {
    id: 'forest_beat_handbook',
    name: 'Forest Beat Handbook',
    category: 'Government & Forestry',
    description: 'Comprehensive baseline departmental handbook covering Beat intro, RF/PRF details, plantations, offences, wildlife, staff, and GPS boundary pillars.',
    icon: 'Trees',
    getChapters: getForestBeatInitialChapters,
  },
  {
    id: 'range_handbook',
    name: 'Range Forest Handbook',
    category: 'Government & Forestry',
    description: 'Division-level range handbook compiling multiple beat records, nursery inventories, and timber extraction data.',
    icon: 'Compass',
    getChapters: (title) => [
      { id: '1', title: 'Title Page', type: 'title_page', content: `# Range Forest Handbook: ${title}`, order: 0 },
      { id: '2', title: 'Table of Contents', type: 'toc', content: '<!-- Auto TOC -->', order: 1 },
      { id: '3', title: 'Range Executive Summary', type: 'chapter', content: '## Range Overview', order: 2 },
      { id: '4', title: 'Beat Jurisdictions', type: 'chapter', content: '## Beats in Range', order: 3 },
      { id: '5', title: 'Nursery & Plantation Register', type: 'chapter', content: '## Range Nurseries', order: 4 },
      { id: '6', title: 'Annexures', type: 'annexure', content: '## Departmental Annexures', order: 5 },
    ],
  },
  {
    id: 'annual_report',
    name: 'Annual Departmental Report',
    category: 'Corporate & Government',
    description: 'Standard multi-chapter annual report with financial tables, project milestones, and progress charts.',
    icon: 'FileText',
    getChapters: (title) => [
      { id: '1', title: 'Title Page', type: 'title_page', content: `# Annual Report: ${title}`, order: 0 },
      { id: '2', title: 'Foreword by Director', type: 'foreword', content: '## Director Message', order: 1 },
      { id: '3', title: 'Table of Contents', type: 'toc', content: '<!-- Auto TOC -->', order: 2 },
      { id: '4', title: 'Executive Summary', type: 'introduction', content: '## Summary of Achievements', order: 3 },
      { id: '5', title: 'Performance & Operations', type: 'chapter', content: '## Operational Highlights', order: 4 },
      { id: '6', title: 'Financial Statements', type: 'chapter', content: '## Revenue & Expenditure', order: 5 },
      { id: '7', title: 'Conclusion & Future Outlook', type: 'chapter', content: '## Looking Ahead', order: 6 },
    ],
  },
  {
    id: 'research_paper',
    name: 'Academic & Research Monograph',
    category: 'Academic',
    description: 'Structured scientific manuscript with Abstract, Methodology, Findings, Discussion, and Bibliography.',
    icon: 'BookOpen',
    getChapters: (title) => [
      { id: '1', title: 'Title & Abstract', type: 'title_page', content: `# ${title}\n\n### Abstract\nWrite your abstract here.`, order: 0 },
      { id: '2', title: 'Table of Contents', type: 'toc', content: '<!-- Auto TOC -->', order: 1 },
      { id: '3', title: '1. Introduction & Objectives', type: 'introduction', content: '## Introduction', order: 2 },
      { id: '4', title: '2. Literature Review', type: 'chapter', content: '## Related Work', order: 3 },
      { id: '5', title: '3. Methodology & Dataset', type: 'chapter', content: '## Research Methodology', order: 4 },
      { id: '6', title: '4. Results & Analysis', type: 'chapter', content: '## Empirical Findings', order: 5 },
      { id: '7', title: '5. Discussion & Conclusion', type: 'chapter', content: '## Discussion', order: 6 },
      { id: '8', title: 'Bibliography & References', type: 'bibliography', content: '## Cited Works', order: 7 },
    ],
  },
  {
    id: 'custom_book',
    name: 'Blank Book Project',
    category: 'General',
    description: 'Clean blank book template with standard front matter and chapter structure ready for customization.',
    icon: 'FilePlus',
    getChapters: (title) => [
      { id: '1', title: 'Title Page', type: 'title_page', content: `# ${title}`, order: 0 },
      { id: '2', title: 'Table of Contents', type: 'toc', content: '<!-- Auto TOC -->', order: 1 },
      { id: '3', title: 'Chapter 1: Introduction', type: 'chapter', content: '## Introduction\nStart writing here...', order: 2 },
    ],
  },
];
