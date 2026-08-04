export type ChapterType =
  | 'title_page'
  | 'certificate'
  | 'foreword'
  | 'preface'
  | 'acknowledgement'
  | 'toc'
  | 'introduction'
  | 'chapter'
  | 'forest_section'
  | 'annexure'
  | 'glossary'
  | 'bibliography'
  | 'references'
  | 'index'
  | 'back_cover'
  | 'custom';

export interface Chapter {
  id: string;
  title: string;
  type: ChapterType;
  content: string; // Markdown or HTML content
  order: number;
  parentId?: string; // For nested chapters
  isCollapsible?: boolean;
  isExpanded?: boolean;
  metadata?: Record<string, any>;
  sourceCitations?: Array<{
    fileId: string;
    fileName: string;
    pageOrRow?: string;
  }>;
}

export interface BookMetadata {
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  edition?: string;
  language: string;
  department?: string;
  organization?: string;
  copyright?: string;
  isbn?: string;
  keywords?: string[];
  description?: string;
  coverImage?: string; // Base64 or Blob URL
}

export interface ForestBeatDetails {
  beatName?: string;
  rangeName?: string;
  divisionName?: string;
  circleName?: string;
  state?: string;
  totalAreaHectares?: number;
  reserveForests?: string[];
  protectedForests?: string[];
  revenueVillages?: string[];
  staffCount?: number;
  gpsBoundary?: Array<{ lat: number; lng: number }>;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  templateId?: string;
  metadata: BookMetadata;
  forestBeatDetails?: ForestBeatDetails;
  chapters: Chapter[];
  fileIds: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt: number;
  updatedAt: number;
}
