import React from 'react';
import { Sparkles, Calendar, HeartHandshake, Compass, MessageSquareCode, Layers } from 'lucide-react';
import { EventPlan } from '../types/event';

interface NavbarProps {
  currentView: 'landing' | 'workspace' | 'wizard' | 'inspiration' | 'copilot';
  onNavigate: (view: 'landing' | 'workspace' | 'wizard' | 'inspiration' | 'copilot') => void;
  activeEvent: EventPlan | null;
  events: EventPlan[];
  onSelectEvent: (eventId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeEvent,
  events,
  onSelectEvent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EADFD5] px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4A154B] via-[#7C3AED] to-[#FB923C] flex items-center justify-center text-white shadow-sm shadow-purple-900/20">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#2D1236] font-editorial">
              CelebrateAI
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4A5E]">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-[#4A154B] cursor-pointer ${
              currentView === 'landing' ? 'text-[#4A154B] font-semibold border-b-2 border-[#4A154B] pb-0.5' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`transition-colors hover:text-[#4A154B] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'workspace' ? 'text-[#4A154B] font-semibold border-b-2 border-[#4A154B] pb-0.5' : ''
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>My Events</span>
            {events.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-1.5 py-0.2">
                {events.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('inspiration')}
            className={`transition-colors hover:text-[#4A154B] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'inspiration' ? 'text-[#4A154B] font-semibold border-b-2 border-[#4A154B] pb-0.5' : ''
            }`}
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Inspiration</span>
          </button>

          <button
            onClick={() => onNavigate('copilot')}
            className={`transition-colors hover:text-[#4A154B] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'copilot' ? 'text-[#4A154B] font-semibold border-b-2 border-[#4A154B] pb-0.5' : ''
            }`}
          >
            <MessageSquareCode className="w-4 h-4 text-coral-600" />
            <span>AI Copilot</span>
          </button>

          {/* Quick event selector dropdown */}
          {events.length > 1 && (
            <div className="relative group">
              <select
                aria-label="Switch Active Event"
                value={activeEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="text-xs bg-white/80 border border-[#D8C7B9] rounded-lg px-2.5 py-1.5 text-[#3A2A3E] focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} {ev.isDemo ? '(Demo)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3">
          {activeEvent?.isDemo && (
            <span className="hidden sm:inline-block text-xs font-medium text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200">
              Demo Mode Active
            </span>
          )}

          <button
            onClick={() => onNavigate('wizard')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#7C3AED] hover:from-[#3B1042] hover:to-[#6D28D9] rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Plan My Event</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden items-center justify-around pt-3 mt-2 border-t border-[#EADFD5]/70 text-xs text-[#5A4A5E]">
        <button
          onClick={() => onNavigate('landing')}
          className={`py-1 ${currentView === 'landing' ? 'text-purple-800 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('workspace')}
          className={`py-1 ${currentView === 'workspace' ? 'text-purple-800 font-bold' : ''}`}
        >
          Workspace
        </button>
        <button
          onClick={() => onNavigate('inspiration')}
          className={`py-1 ${currentView === 'inspiration' ? 'text-purple-800 font-bold' : ''}`}
        >
          Inspiration
        </button>
        <button
          onClick={() => onNavigate('copilot')}
          className={`py-1 ${currentView === 'copilot' ? 'text-purple-800 font-bold' : ''}`}
        >
          Copilot
        </button>
      </div>
    </header>
  );
};
