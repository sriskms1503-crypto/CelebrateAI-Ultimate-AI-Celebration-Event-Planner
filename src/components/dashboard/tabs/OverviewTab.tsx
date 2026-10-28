import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { EventPlan } from '../../../types/event';
import { formatCurrency, calculateRemainingBudget, calculateActualExpenses } from '../../../utils/budget';
import { formatEventDate, getDaysRemaining } from '../../../utils/date';

interface OverviewTabProps {
  event: EventPlan;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ event, onNavigateTab }) => {
  const daysRemaining = getDaysRemaining(event.date);
  const actualSpent = calculateActualExpenses(event.budget.expenses);
  const remainingBudget = calculateRemainingBudget(event.budget.total, actualSpent);

  const attendingGuests = event.guests
    .filter((g) => g.rsvpStatus === 'Attending')
    .reduce((sum, g) => sum + g.attendeesCount, 0);

  const completedTasks = event.checklist.filter((t) => t.status === 'Completed').length;

  return (
    <div className="space-y-8">
      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A6A7E] text-xs">
            <span>Countdown</span>
            <Clock className="w-4 h-4 text-purple-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#2D1236]">
              {daysRemaining > 0 ? daysRemaining : 0}
            </span>
            <span className="text-xs text-[#7A6A7E]">days to go</span>
          </div>
          <p className="text-[11px] text-[#5A4A5E] mt-1 truncate">
            {formatEventDate(event.date)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A6A7E] text-xs">
            <span>Remaining Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#2D1236]">
              {formatCurrency(remainingBudget, event.currency)}
            </span>
          </div>
          <p className="text-[11px] text-[#5A4A5E] mt-1">
            Total Cap: {formatCurrency(event.budget.total, event.currency)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A6A7E] text-xs">
            <span>RSVP Attendance</span>
            <Users className="w-4 h-4 text-purple-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#2D1236]">
              {attendingGuests}
            </span>
            <span className="text-xs text-[#7A6A7E]">/ {event.guestCount} heads</span>
          </div>
          <p className="text-[11px] text-[#5A4A5E] mt-1">
            {Math.round((attendingGuests / (event.guestCount || 1)) * 100)}% confirmed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A6A7E] text-xs">
            <span>Checklist Progress</span>
            <CheckCircle2 className="w-4 h-4 text-purple-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#2D1236]">
              {completedTasks}
            </span>
            <span className="text-xs text-[#7A6A7E]">/ {event.checklist.length} done</span>
          </div>
          <p className="text-[11px] text-[#5A4A5E] mt-1">
            {event.checklist.length > 0
              ? Math.round((completedTasks / event.checklist.length) * 100)
              : 0}
            % tasks completed
          </p>
        </div>
      </div>

      {/* AI Concept & Theme Blueprint Card */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-editorial text-[#2D1236]">
                Event Concept: {event.concept.title}
              </h3>
              <p className="text-xs text-[#7A6A7E]">{event.styleTheme} Aesthetic</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('copilot')}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 cursor-pointer"
          >
            Ask Copilot to Refine
          </button>
        </div>

        <p className="text-xs text-[#5A4A5E] leading-relaxed">
          {event.concept.description}
        </p>

        {/* Color Palette */}
        <div className="mt-5 pt-4 border-t border-[#E8DDD2]/60">
          <span className="text-xs font-bold text-[#2D1236]">Curated Color Palette</span>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {event.concept.colorPalette.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E2D5C8]">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium text-[#2D1236]">{color.name}</span>
                <span className="text-[10px] font-mono text-[#7A6A7E]">{color.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decor, Lighting, Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-5 border-t border-[#E8DDD2]/60">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-2">
              Decor & Floral Vision
            </h4>
            <ul className="space-y-1.5 text-xs text-[#5A4A5E]">
              {event.concept.decorationIdeas.map((idea, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">·</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              Lighting & Ambiance
            </h4>
            <ul className="space-y-1.5 text-xs text-[#5A4A5E]">
              {event.concept.lightingIdeas.map((idea, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">·</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              Guest Experience Highlights
            </h4>
            <ul className="space-y-1.5 text-xs text-[#5A4A5E]">
              {event.concept.guestExperience.map((idea, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">·</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Schedule & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-editorial text-[#2D1236]">
              Day-of-Event Schedule
            </h3>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs font-medium text-purple-700 hover:underline cursor-pointer"
            >
              Full Timeline →
            </button>
          </div>

          <div className="space-y-3">
            {event.schedule.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                <span className="text-xs font-bold font-mono text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 shrink-0">
                  {item.time}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#2D1236]">{item.title}</h4>
                  <p className="text-[11px] text-[#6C5870] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Contingency & Sustainability */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold font-editorial text-[#2D1236]">
                Risk Assessment & Contingencies
              </h3>
            </div>

            <div className="space-y-3">
              {event.risks.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#2D1236]">
                    <span>{r.risk}</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                        r.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.severity} Severity
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A4A5E] mt-1 leading-relaxed">
                    <strong>Contingency:</strong> {r.contingency}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-emerald-800" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Eco-Friendly Initiatives
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900/90">
              {event.sustainability.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
