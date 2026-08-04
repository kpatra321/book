import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Download, HardDrive, Cpu, Github, ArrowRight, CheckCircle2, Trees, Layers, FileText } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="min-h-full overflow-y-auto space-y-16 py-8 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Client-Side • Open Source • Free Forever</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          Create Professional Books & Handbooks <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Entirely In Your Browser</span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          OpenBook AI transforms PDFs, DOCX files, spreadsheets, images, and Google Drive files into structured books. Zero server required, zero data collection, pluggable AI providers.
        </p>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={onLaunchApp}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105"
          >
            <span>Launch OpenBook Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Fork on GitHub</span>
          </a>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hoverEffect>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">100% Private & Client-Side</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            All document parsing, RAG indexing, and exporting run inside your browser. No backend server or cloud database required.
          </p>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Pluggable AI & Local LLMs</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Use WebLLM locally in browser, connect your own OpenAI, Gemini, Claude, or Ollama API key, or operate in pure manual mode.
          </p>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-4">
            <Trees className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Forest Beat Handbook Mode</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Pre-built template for forest beat handbooks. Automatically maps spreadsheets into plantation registers, offences, and GPS pillars.
          </p>
        </GlassCard>
      </section>

      {/* Feature Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">Everything You Need To Build Books</h2>
          <p className="text-slate-400 text-sm">Engineered for researchers, forest officers, authors, and teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            'Multi-format file upload (PDF, DOCX, CSV, XLSX, Images with OCR)',
            'Evidence-backed RAG Knowledge Base with exact source citations',
            'Drag-and-drop collapsible chapter ordering',
            'Export to PDF, DOCX, XLSX, EPUB, HTML, Markdown, and JSON',
            'Client-side Google Drive folder synchronization',
            'Full PWA support for completely offline editing',
          ].map((feat, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Ready to build your first book?</h2>
        <button
          onClick={onLaunchApp}
          className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-105"
        >
          Open App Dashboard
        </button>
      </section>
    </div>
  );
};
