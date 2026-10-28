/**
 * Date and Timeline calculation utilities for CelebrateAI
 */

export function getDaysRemaining(eventDateStr: string): number {
  if (!eventDateStr) return 0;
  const eventDate = new Date(eventDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function formatEventDate(dateStr: string): string {
  if (!dateStr) return 'Date to be announced';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generate adaptive planning milestones based on actual lead time
 */
export function generateAdaptiveMilestones(eventDateStr: string, eventType: string) {
  const daysUntil = getDaysRemaining(eventDateStr);

  if (daysUntil > 120) {
    // 4+ months away: Long-term leisurely planning
    return [
      { phase: '6-12 Months Before', tasks: ['Vision, theme & budget approval', 'Reserve main banquet venue', 'Shortlist lead photographer & videographer'] },
      { phase: '3-4 Months Before', tasks: ['Taste testing & caterer contract', 'Curate guest list & postal addresses', 'Commission invitations'] },
      { phase: '1-2 Months Before', tasks: ['Dispatch RSVP invitations', 'Finalize theme styling & floral decor', 'Book sound & entertainment'] },
      { phase: '2-3 Weeks Before', tasks: ['Lock final attendee count with caterer', 'Finalize seating arrangement', 'Reconfirm vendor arrival times'] },
      { phase: 'Event Week & Day', tasks: ['Emergency kit packing', 'Morning stage & sound check', 'Celebrate happily!'] },
    ];
  } else if (daysUntil > 30) {
    // 1-4 months away: Mid-term focused planning
    return [
      { phase: 'Immediate (Next 7 Days)', tasks: ['Confirm venue booking & deposit', 'Lock catering menu and guest count estimates'] },
      { phase: '1 Month Before', tasks: ['Send digital invitations with RSVP tracking', 'Book photographer & decorator'] },
      { phase: '2 Weeks Before', tasks: ['Gather dietary needs & seating groups', 'Schedule audio & lighting setup'] },
      { phase: 'Event Week', tasks: ['Final vendor reconfirmations', 'Decor and sound review', 'Event execution'] },
    ];
  } else if (daysUntil > 7) {
    // 1-4 weeks away: Fast-track planning
    return [
      { phase: 'Urgent Actions', tasks: ['Direct call to venue & caterer', 'Broadcast digital invitations via WhatsApp / Email', 'Secure photographer'] },
      { phase: 'Next 5 Days', tasks: ['Confirm floral setup & stage backdrop', 'Collate RSVPs', 'Review music & speech rundown'] },
      { phase: 'Day Before', tasks: ['Venue walk-through', 'Emergency cash & reserve review', 'Host outfit prep'] },
    ];
  } else {
    // Urgent (Less than 7 days)
    return [
      { phase: 'Immediate Priority', tasks: ['Confirm catering quantity & delivery slot', 'Verify sound system & wireless microphones', 'Send RSVP reminder'] },
      { phase: 'Eve of Event', tasks: ['Inspect decor props & lighting', 'Print schedule for coordinators', 'Rest well before celebration'] },
    ];
  }
}
