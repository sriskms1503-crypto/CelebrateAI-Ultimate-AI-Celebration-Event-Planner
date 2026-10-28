import React, { useState } from 'react';
import {
  FileText,
  Save,
  Download,
  Upload,
  Printer,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { EventPlan } from '../../../types/event';
import { formatCurrency, calculateActualExpenses, calculateRemainingBudget } from '../../../utils/budget';
import { formatEventDate } from '../../../utils/date';

interface NotesTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const NotesTab: React.FC<NotesTabProps> = ({ event, onUpdateEvent }) => {
  const [notes, setNotes] = useState<string>(event.notes || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveNotes = () => {
    onUpdateEvent({
      ...event,
      notes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_CelebrateAI_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const actualSpent = calculateActualExpenses(event.budget.expenses);
  const remaining = calculateRemainingBudget(event.budget.total, actualSpent);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Event Documentation & Exports
          </span>
          <h2 className="text-xl font-bold font-editorial text-[#2D1236] mt-0.5">
            Documents, Dossier & Notes
          </h2>
          <p className="text-xs text-[#7A6A7E] mt-1">
            Keep meeting notes, coordinator contacts, and export complete celebration dossier for print.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D8C7B9] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#5A4A5E] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>Export JSON Backup</span>
          </button>

          <button
            onClick={handlePrintDossier}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Event Dossier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Notes Scratchpad */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D1236]">Coordinator Scratchpad</h3>
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Notes'}</span>
            </button>
          </div>

          <p className="text-xs text-[#7A6A7E]">
            Jot down vendor contact numbers, family coordinator responsibilities, gate codes, or luggage drop notes.
          </p>

          <textarea
            rows={14}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your event notes here..."
            className="w-full p-4 rounded-xl border border-[#D8C7B9] text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
          />
        </div>

        {/* Right: Printable Executive Dossier Preview */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm space-y-4 print:m-0 print:border-none print:shadow-none">
          <div className="border-b border-[#E8DDD2] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
              Official Celebration Dossier
            </span>
            <h3 className="text-lg font-bold font-editorial text-[#2D1236]">{event.name}</h3>
            <p className="text-xs text-[#5A4A5E]">
              {formatEventDate(event.date)} · {event.city} ({event.venue})
            </p>
          </div>

          {/* Quick Summary Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DDD2]">
            <div>
              <span className="text-[#7A6A7E] block text-[11px]">Budget Cap</span>
              <strong className="text-purple-950 font-mono text-sm">
                {formatCurrency(event.budget.total, event.currency)}
              </strong>
            </div>
            <div>
              <span className="text-[#7A6A7E] block text-[11px]">Remaining Funds</span>
              <strong className="text-emerald-700 font-mono text-sm">
                {formatCurrency(remaining, event.currency)}
              </strong>
            </div>
            <div>
              <span className="text-[#7A6A7E] block text-[11px]">Guest Headcount</span>
              <strong>{event.guestCount} guests</strong>
            </div>
            <div>
              <span className="text-[#7A6A7E] block text-[11px]">Theme / Style</span>
              <strong>{event.styleTheme}</strong>
            </div>
          </div>

          {/* Key Schedule rundown */}
          <div className="text-xs space-y-1.5">
            <span className="font-bold text-[#2D1236] block">Day-of Itinerary:</span>
            <div className="space-y-1">
              {event.schedule.slice(0, 5).map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono font-bold text-purple-900 w-12">{s.time}</span>
                  <span className="text-[#2D1236] font-medium">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Vendors */}
          <div className="text-xs space-y-1.5 pt-2 border-t border-[#E8DDD2]">
            <span className="font-bold text-[#2D1236] block">Contracted Key Partners:</span>
            <div className="space-y-1 text-[11px]">
              {event.vendors.slice(0, 4).map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <span className="text-[#2D1236] font-medium">
                    {v.name} ({v.category})
                  </span>
                  <span className="font-mono text-slate-500">{v.contactInfo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[#7A6A7E] italic border-t border-[#E8DDD2]">
            Generated via CelebrateAI. Document contains confidential celebration details.
          </div>
        </div>
      </div>
    </div>
  );
};
