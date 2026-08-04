import React from 'react';
import { BOOK_TEMPLATES } from '../templates/templateRegistry';
import { useBookStore } from '../store/useBookStore';
import { GlassCard } from '../components/common/GlassCard';
import { Trees, Compass, FileText, BookOpen, FilePlus, Sparkles, CheckCircle2 } from 'lucide-react';

interface TemplatesPageProps {
  onNavigateTab: (tab: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onNavigateTab }) => {
  const { createBook } = useBookStore();

  const handleUseTemplate = async (templateId: string, templateName: string) => {
    const title = templateId === 'forest_beat_handbook' ? 'Pine Ridge Beat Handbook' : `New ${templateName}`;
    await createBook(title, templateName, templateId);
    onNavigateTab('editor');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees': return Trees;
      case 'Compass': return Compass;
      case 'FileText': return FileText;
      case 'BookOpen': return BookOpen;
      default: return FilePlus;
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Templates & Specialized Modes</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select a pre-configured template to jumpstart your book structure with standardized departmental chapters.
        </p>
      </div>

      {/* Featured Forest Beat Handbook Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Featured Specialized Mode</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <Trees className="w-6 h-6 text-emerald-400" />
              <span>Forest Beat Handbook Mode</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Designed specifically for forest officers. Automatically categorizes uploaded departmental records into Beat Intro, RF/PRF details, year-wise plantation data, species breakdown, ANR areas, wildlife, offences, fire lines, staff, and GPS boundary pillars.
            </p>
          </div>

          <button
            onClick={() => handleUseTemplate('forest_beat_handbook', 'Forest Beat Handbook')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 shrink-0 transition-colors"
          >
            Launch Forest Mode
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-300">
          <div className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>30+ Departmental Chapters</span></div>
          <div className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Auto Excel-to-Table Mapping</span></div>
          <div className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>GPS Boundary Coordinates</span></div>
          <div className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>CMYK Print Ready PDF</span></div>
        </div>
      </div>

      {/* All Templates Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100">All Project Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BOOK_TEMPLATES.map(tpl => {
            const Icon = getIcon(tpl.icon);
            return (
              <GlassCard key={tpl.id} hoverEffect className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-800 text-emerald-400 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">{tpl.name}</h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-medium">
                    {tpl.category}
                  </span>
                  <p className="text-xs text-slate-400">{tpl.description}</p>
                </div>

                <button
                  onClick={() => handleUseTemplate(tpl.id, tpl.name)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Use Template
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
