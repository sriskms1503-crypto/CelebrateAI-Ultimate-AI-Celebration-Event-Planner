import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  FileText,
  Compass,
  MessageSquareCode,
  Layers,
  Settings,
  Trash2,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { getDaysRemaining, formatEventDate } from '../../utils/date';
import { formatCurrency } from '../../utils/budget';

// Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { BudgetTab } from './tabs/BudgetTab';
import { TimelineTab } from './tabs/TimelineTab';
import { VendorsTab } from './tabs/VendorsTab';
import { GuestsTab } from './tabs/GuestsTab';
import { InspirationTab } from './tabs/InspirationTab';
import { InvitationsTab } from './tabs/InvitationsTab';
import { CopilotTab } from './tabs/CopilotTab';
import { NotesTab } from './tabs/NotesTab';

interface EventWorkspaceProps {
  event: EventPlan;
  events: EventPlan[];
  onSelectEvent: (id: string) => void;
  onUpdateEvent: (updated: EventPlan) => void;
  onDeleteEvent: (id: string) => void;
  onResetDemo: () => void;
  onPlanNewEvent: () => void;
}

export type WorkspaceTab =
  | 'overview'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'guests'
  | 'inspiration'
  | 'invitations'
  | 'copilot'
  | 'notes';

export const EventWorkspace: React.FC<EventWorkspaceProps> = ({
  event,
  events,
  onSelectEvent,
  onUpdateEvent,
  onDeleteEvent,
  onResetDemo,
  onPlanNewEvent,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');

  const daysRemaining = getDaysRemaining(event.date);

  const tabs: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'budget', label: 'Smart Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Tasks', icon: Calendar },
    { id: 'vendors', label: 'Vendors & Quotes', icon: Users },
    { id: 'guests', label: 'Guests & RSVP', icon: CheckCircle2 },
    { id: 'inspiration', label: 'Inspiration', icon: Compass },
    { id: 'invitations', label: 'Invitations Studio', icon: FileText },
    { id: 'copilot', label: 'Celebration Copilot', icon: MessageSquareCode },
    { id: 'notes', label: 'Dossier & Notes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* 1. Event Workspace Header Banner */}
      <div className="bg-white border-b border-[#E8DDD2] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7A6A7E] mb-1 font-medium">
              <span className="text-purple-800 font-bold">{event.eventType}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                {event.city} ({event.venue})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-700" />
                {formatEventDate(event.date)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#2D1236]">
                {event.name}
              </h1>

              {event.isDemo && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  Sample Celebration
                </span>
              )}

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                {daysRemaining > 0 ? `${daysRemaining} Days to Go` : 'Celebration Today'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onPlanNewEvent}
              className="px-3 py-1.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              + New Event
            </button>

            {event.isDemo && (
              <button
                onClick={() => {
                  if (window.confirm('Reset sample celebration to initial state?')) {
                    onResetDemo();
                  }
                }}
                className="p-2 rounded-xl border border-[#D8C7B9] text-[#7A6A7E] hover:text-purple-700 bg-white cursor-pointer"
                title="Reset sample event"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {!event.isDemo && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Permanently delete "${event.name}"? This action cannot be undone.`
                    )
                  ) {
                    onDeleteEvent(event.id);
                  }
                }}
                className="p-2 rounded-xl border border-[#D8C7B9] text-rose-500 hover:bg-rose-50 bg-white cursor-pointer"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Workspace Tabs Navigation */}
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4A5E] hover:bg-[#F3EBE3]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-purple-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {activeTab === 'overview' && (
          <OverviewTab event={event} onNavigateTab={(t) => setActiveTab(t as WorkspaceTab)} />
        )}
        {activeTab === 'budget' && (
          <BudgetTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'vendors' && (
          <VendorsTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'guests' && (
          <GuestsTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'inspiration' && (
          <InspirationTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'invitations' && (
          <InvitationsTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
        {activeTab === 'copilot' && <CopilotTab event={event} />}
        {activeTab === 'notes' && (
          <NotesTab event={event} onUpdateEvent={onUpdateEvent} />
        )}
      </main>
    </div>
  );
};
