/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EventWizard } from './components/wizard/EventWizard';
import { EventWorkspace } from './components/dashboard/EventWorkspace';
import { InspirationTab } from './components/dashboard/tabs/InspirationTab';
import { CopilotTab } from './components/dashboard/tabs/CopilotTab';
import { StorageService, DEMO_EVENT } from './services/storage';
import { EventPlan } from './types/event';

export default function App() {
  const [events, setEvents] = useState<EventPlan[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [currentView, setCurrentView] = useState<
    'landing' | 'workspace' | 'wizard' | 'inspiration' | 'copilot'
  >('landing');

  // Load events on initial mount
  useEffect(() => {
    const loadedEvents = StorageService.getEvents();
    setEvents(loadedEvents);
    const activeId = StorageService.getActiveEventId();
    setActiveEventId(activeId);
  }, []);

  const activeEvent =
    events.find((e) => e.id === activeEventId) || events[0] || DEMO_EVENT;

  const handleSelectEvent = (id: string) => {
    setActiveEventId(id);
    StorageService.setActiveEventId(id);
  };

  const handleEventCreated = (newEvent: EventPlan) => {
    StorageService.saveEvent(newEvent);
    const updated = StorageService.getEvents();
    setEvents(updated);
    setActiveEventId(newEvent.id);
    StorageService.setActiveEventId(newEvent.id);
    setCurrentView('workspace');
  };

  const handleUpdateEvent = (updatedEvent: EventPlan) => {
    StorageService.saveEvent(updatedEvent);
    const updated = StorageService.getEvents();
    setEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    StorageService.deleteEvent(id);
    const updated = StorageService.getEvents();
    setEvents(updated);
    setActiveEventId(StorageService.getActiveEventId());
  };

  const handleResetDemo = () => {
    StorageService.resetToDemo();
    const updated = StorageService.getEvents();
    setEvents(updated);
    setActiveEventId(DEMO_EVENT.id);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D1236] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeEvent={activeEvent}
        events={events}
        onSelectEvent={handleSelectEvent}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onPlanEvent={() => setCurrentView('wizard')}
            onExploreInspiration={() => setCurrentView('inspiration')}
            onOpenWorkspace={() => setCurrentView('workspace')}
            onOpenCopilot={() => setCurrentView('copilot')}
          />
        )}

        {currentView === 'wizard' && (
          <EventWizard
            onEventCreated={handleEventCreated}
            onCancel={() => setCurrentView(events.length > 0 ? 'workspace' : 'landing')}
          />
        )}

        {currentView === 'workspace' && (
          <EventWorkspace
            event={activeEvent}
            events={events}
            onSelectEvent={handleSelectEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onResetDemo={handleResetDemo}
            onPlanNewEvent={() => setCurrentView('wizard')}
          />
        )}

        {currentView === 'inspiration' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <InspirationTab event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          </div>
        )}

        {currentView === 'copilot' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
            <CopilotTab event={activeEvent} />
          </div>
        )}
      </main>
    </div>
  );
}
