import { create } from 'zustand';
import { Book, Chapter, BookMetadata } from '../types/book';
import { db } from '../services/db/indexDB';
import { getForestBeatInitialChapters } from '../templates/forestBeatHandbook';

interface BookState {
  books: Book[];
  activeBookId: string | null;
  activeChapterId: string | null;
  isLoading: boolean;
  
  // Actions
  loadBooks: () => Promise<void>;
  createBook: (title: string, category?: string, templateId?: string) => Promise<Book>;
  setActiveBook: (id: string | null) => void;
  setActiveChapter: (id: string | null) => void;
  updateBookMetadata: (bookId: string, metadata: Partial<BookMetadata>) => Promise<void>;
  updateChapterContent: (bookId: string, chapterId: string, content: string) => Promise<void>;
  addChapter: (bookId: string, title: string, type?: Chapter['type']) => Promise<void>;
  deleteChapter: (bookId: string, chapterId: string) => Promise<void>;
  reorderChapters: (bookId: string, startIndex: number, endIndex: number) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  togglePinBook: (bookId: string) => Promise<void>;
  seedSampleForestBook: () => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  activeBookId: null,
  activeChapterId: null,
  isLoading: false,

  loadBooks: async () => {
    set({ isLoading: true });
    const books = await db.books.toArray();
    if (books.length === 0) {
      // Seed initial sample Forest Beat Handbook so user has demo data ready!
      await get().seedSampleForestBook();
    } else {
      set({ books, activeBookId: books[0]?.id || null, activeChapterId: books[0]?.chapters[0]?.id || null, isLoading: false });
    }
  },

  createBook: async (title: string, category = 'General', templateId = 'custom_book') => {
    const isForest = templateId === 'forest_beat_handbook';
    const initialChapters = isForest ? getForestBeatInitialChapters(title) : [
      { id: 'ch-1', title: 'Title Page', type: 'title_page' as const, content: `# ${title}`, order: 0 },
      { id: 'ch-2', title: 'Table of Contents', type: 'toc' as const, content: '<!-- Auto TOC -->', order: 1 },
      { id: 'ch-3', title: 'Chapter 1: Introduction', type: 'chapter' as const, content: '## Introduction\nStart typing content here or upload reference files.', order: 2 },
    ];

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      category,
      tags: isForest ? ['Forestry', 'Beat Handbook', 'Departmental'] : ['General'],
      templateId,
      metadata: {
        title,
        author: 'Department Officer',
        language: 'English',
        organization: isForest ? 'State Forest Department' : 'OpenBook Organization',
      },
      forestBeatDetails: isForest ? {
        beatName: title,
        rangeName: 'Central Range',
        divisionName: 'North Division',
        state: 'Forestry State',
        totalAreaHectares: 1450.75,
      } : undefined,
      chapters: initialChapters,
      fileIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.books.add(newBook);
    set((state) => ({
      books: [newBook, ...state.books],
      activeBookId: newBook.id,
      activeChapterId: newBook.chapters[0]?.id || null,
    }));

    return newBook;
  },

  setActiveBook: (id) => {
    const book = get().books.find(b => b.id === id);
    set({
      activeBookId: id,
      activeChapterId: book?.chapters[0]?.id || null,
    });
  },

  setActiveChapter: (id) => set({ activeChapterId: id }),

  updateBookMetadata: async (bookId, metadata) => {
    const book = get().books.find(b => b.id === bookId);
    if (!book) return;

    const updatedMetadata = { ...book.metadata, ...metadata };
    const updatedBook = { ...book, metadata: updatedMetadata, title: metadata.title || book.title, updatedAt: Date.now() };

    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b)
    }));
  },

  updateChapterContent: async (bookId, chapterId, content) => {
    const book = get().books.find(b => b.id === bookId);
    if (!book) return;

    const updatedChapters = book.chapters.map(ch => ch.id === chapterId ? { ...ch, content } : ch);
    const updatedBook = { ...book, chapters: updatedChapters, updatedAt: Date.now() };

    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b)
    }));
  },

  addChapter: async (bookId, title, type = 'chapter') => {
    const book = get().books.find(b => b.id === bookId);
    if (!book) return;

    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      title,
      type,
      content: `## ${title}\nWrite content here...`,
      order: book.chapters.length,
      isCollapsible: true,
      isExpanded: true,
    };

    const updatedChapters = [...book.chapters, newChapter];
    const updatedBook = { ...book, chapters: updatedChapters, updatedAt: Date.now() };

    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b),
      activeChapterId: newChapter.id,
    }));
  },

  deleteChapter: async (bookId, chapterId) => {
    const book = get().books.find(b => b.id === bookId);
    if (!book || book.chapters.length <= 1) return;

    const updatedChapters = book.chapters.filter(ch => ch.id !== chapterId);
    const updatedBook = { ...book, chapters: updatedChapters, updatedAt: Date.now() };

    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b),
      activeChapterId: updatedChapters[0]?.id || null,
    }));
  },

  reorderChapters: async (bookId, startIndex, endIndex) => {
    const book = get().books.find(b => b.id === bookId);
    if (!book) return;

    const result = Array.from(book.chapters);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const reordered = result.map((ch, idx) => ({ ...ch, order: idx }));
    const updatedBook = { ...book, chapters: reordered, updatedAt: Date.now() };

    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b)
    }));
  },

  deleteBook: async (bookId) => {
    await db.books.delete(bookId);
    set(state => {
      const filtered = state.books.filter(b => b.id !== bookId);
      return {
        books: filtered,
        activeBookId: filtered[0]?.id || null,
        activeChapterId: filtered[0]?.chapters[0]?.id || null,
      };
    });
  },

  togglePinBook: async (bookId) => {
    const book = get().books.find(b => b.id === bookId);
    if (!book) return;

    const updatedBook = { ...book, isPinned: !book.isPinned };
    await db.books.put(updatedBook);
    set(state => ({
      books: state.books.map(b => b.id === bookId ? updatedBook : b)
    }));
  },

  seedSampleForestBook: async () => {
    const title = 'Pine Ridge Beat Handbook';
    const chapters = getForestBeatInitialChapters(title);

    const sampleBook: Book = {
      id: 'sample-forest-beat-1',
      title,
      subtitle: 'Official Departmental Beat Record & Resource Inventory',
      category: 'Forest Beat Handbook',
      tags: ['Forestry', 'Beat Handbook', 'Sample Data', 'Official'],
      templateId: 'forest_beat_handbook',
      isPinned: true,
      metadata: {
        title,
        subtitle: 'Official Departmental Beat Record & Resource Inventory',
        author: 'R. K. Sharma (Beat Officer)',
        organization: 'State Forest Department',
        publisher: 'Government Forestry Press',
        edition: '2026 First Edition',
        language: 'English',
        department: 'Division Forest Office',
      },
      forestBeatDetails: {
        beatName: 'Pine Ridge Beat',
        rangeName: 'Eastern Range',
        divisionName: 'Pine Valley Forest Division',
        state: 'Uttarakhand',
        totalAreaHectares: 1280.45,
        reserveForests: ['RF Pine Ridge Block A', 'RF Pine Ridge Block B'],
        revenueVillages: ['Green Valley', 'Timber Creek', 'Cedar Hill'],
        staffCount: 4,
      },
      chapters,
      fileIds: [],
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now(),
    };

    await db.books.add(sampleBook);
    set({
      books: [sampleBook],
      activeBookId: sampleBook.id,
      activeChapterId: sampleBook.chapters[0].id,
      isLoading: false,
    });
  },
}));
