import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Accessibility,
  Utensils,
  X,
  AlertCircle,
} from 'lucide-react';
import { EventPlan, GuestItem, RSVPStatus, InvitationDeliveryStatus } from '../../../types/event';

interface GuestsTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({ event, onUpdateEvent }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRsvp, setFilterRsvp] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');

  // Modal State
  const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);

  const [guestName, setGuestName] = useState<string>('');
  const [guestContact, setGuestContact] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [invStatus, setInvStatus] = useState<InvitationDeliveryStatus>('Sent');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('Pending');
  const [dietary, setDietary] = useState<string>('Standard');
  const [seatingGroup, setSeatingGroup] = useState<string>('General Guests');
  const [accessibility, setAccessibility] = useState<string>('None');
  const [notes, setNotes] = useState<string>('');

  // Calculations
  const totalHeadsExpected = event.guests.reduce((sum, g) => sum + g.attendeesCount, 0);
  const attendingHeads = event.guests
    .filter((g) => g.rsvpStatus === 'Attending')
    .reduce((sum, g) => sum + g.attendeesCount, 0);
  const pendingHeads = event.guests
    .filter((g) => g.rsvpStatus === 'Pending')
    .reduce((sum, g) => sum + g.attendeesCount, 0);
  const declinedHeads = event.guests
    .filter((g) => g.rsvpStatus === 'Declined')
    .reduce((sum, g) => sum + g.attendeesCount, 0);

  const groups = Array.from(new Set(event.guests.map((g) => g.seatingGroup).filter(Boolean)));

  const openAddGuestModal = () => {
    setEditingGuestId(null);
    setGuestName('');
    setGuestContact('');
    setGuestCount(2);
    setInvStatus('Sent');
    setRsvpStatus('Pending');
    setDietary('Standard');
    setSeatingGroup('General Guests');
    setAccessibility('None');
    setNotes('');
    setIsGuestModalOpen(true);
  };

  const openEditGuestModal = (g: GuestItem) => {
    setEditingGuestId(g.id);
    setGuestName(g.name);
    setGuestContact(g.contact);
    setGuestCount(g.attendeesCount);
    setInvStatus(g.invitationStatus);
    setRsvpStatus(g.rsvpStatus);
    setDietary(g.dietary);
    setSeatingGroup(g.seatingGroup);
    setAccessibility(g.accessibility);
    setNotes(g.notes || '');
    setIsGuestModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    let updatedGuests: GuestItem[];
    if (editingGuestId) {
      updatedGuests = event.guests.map((g) =>
        g.id === editingGuestId
          ? {
              ...g,
              name: guestName,
              contact: guestContact,
              attendeesCount: guestCount,
              invitationStatus: invStatus,
              rsvpStatus: rsvpStatus,
              dietary,
              seatingGroup,
              accessibility,
              notes,
            }
          : g
      );
    } else {
      const newGuest: GuestItem = {
        id: `g-${Date.now()}`,
        name: guestName,
        contact: guestContact,
        attendeesCount: guestCount,
        invitationStatus: invStatus,
        rsvpStatus: rsvpStatus,
        dietary,
        seatingGroup,
        accessibility,
        notes,
      };
      updatedGuests = [newGuest, ...event.guests];
    }

    onUpdateEvent({
      ...event,
      guests: updatedGuests,
    });

    setIsGuestModalOpen(false);
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove guest "${name}"?`)) {
      const updated = event.guests.filter((g) => g.id !== id);
      onUpdateEvent({
        ...event,
        guests: updated,
      });
    }
  };

  // Export authorized guest list to CSV
  const handleExportCSV = () => {
    const headers = [
      'Guest Name',
      'Contact',
      'Attendees Count',
      'Invitation Status',
      'RSVP Status',
      'Dietary Preferences',
      'Seating Group',
      'Accessibility Requirements',
      'Notes',
    ];

    const rows = event.guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.contact.replace(/"/g, '""')}"`,
      g.attendeesCount,
      `"${g.invitationStatus}"`,
      `"${g.rsvpStatus}"`,
      `"${g.dietary.replace(/"/g, '""')}"`,
      `"${g.seatingGroup.replace(/"/g, '""')}"`,
      `"${g.accessibility.replace(/"/g, '""')}"`,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = event.guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.seatingGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRsvp = filterRsvp === 'All' || g.rsvpStatus === filterRsvp;
    const matchGroup = filterGroup === 'All' || g.seatingGroup === filterGroup;
    return matchSearch && matchRsvp && matchGroup;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header & RSVP Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] block">Target Capacity</span>
          <span className="text-xl font-bold font-mono text-[#2D1236] mt-1 block">
            {event.guestCount}
          </span>
          <span className="text-[10px] text-purple-700 font-medium">Planned Capacity</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span>Confirmed Attending</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
            {attendingHeads} heads
          </span>
          <span className="text-[10px] text-[#7A6A7E]">
            {Math.round((attendingHeads / (event.guestCount || 1)) * 100)}% of hall capacity
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-800">
            <span>Awaiting RSVP</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
            {pendingHeads} heads
          </span>
          <span className="text-[10px] text-[#7A6A7E]">Requires follow-up</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-rose-800">
            <span>Declined</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-xl font-bold font-mono text-rose-800 mt-1 block">
            {declinedHeads} heads
          </span>
          <span className="text-[10px] text-[#7A6A7E]">Cannot attend</span>
        </div>
      </div>

      {/* 2. Actions & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDD2]">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guest name, phone, or seating group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D8C7B9] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#5A4A5E] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-700" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={openAddGuestModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A6A7E]">RSVP:</span>
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All RSVPs</option>
              <option value="Attending">Attending</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#7A6A7E]">Seating Group:</span>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All Groups</option>
              {groups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-[#7A6A7E] ml-auto">
            Showing {filteredGuests.length} of {event.guests.length} guest records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8DDD2] text-[#7A6A7E] font-semibold">
                <th className="py-2.5 px-3">Guest / Family</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3 text-center">Attendees</th>
                <th className="py-2.5 px-3">Seating Group</th>
                <th className="py-2.5 px-3">RSVP Status</th>
                <th className="py-2.5 px-3">Dietary & Accessibility</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E0]">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#2D1236]">
                    {guest.name}
                    {guest.notes && (
                      <span className="block text-[10px] text-[#7A6A7E] font-normal truncate max-w-xs">
                        {guest.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#5A4A5E]">{guest.contact}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-purple-900">
                    {guest.attendeesCount}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                      {guest.seatingGroup}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        guest.rsvpStatus === 'Attending'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : guest.rsvpStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {guest.rsvpStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#5A4A5E]">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px]" title="Dietary">
                        <Utensils className="w-3 h-3 text-amber-600" />
                        {guest.dietary}
                      </span>
                      {guest.accessibility !== 'None' && (
                        <span
                          className="flex items-center gap-1 text-[11px] text-purple-800 bg-purple-50 px-1 rounded"
                          title="Accessibility requirement"
                        >
                          <Accessibility className="w-3 h-3 text-purple-700" />
                          {guest.accessibility}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditGuestModal(guest)}
                      className="p-1 text-slate-500 hover:text-purple-700 cursor-pointer mr-1"
                      title="Edit guest"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGuest(guest.id, guest.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete guest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isGuestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2D5C8]">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#2D1236]">
                {editingGuestId ? 'Edit Guest Record' : 'Add Guest to List'}
              </h3>
              <button
                onClick={() => setIsGuestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D1236] mb-1">
                  Guest / Family Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh & Lalitha Rao"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Contact Info</label>
                  <input
                    type="text"
                    placeholder="Phone or email"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">
                    Attendees Headcount <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">RSVP Status</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as RSVPStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Attending">Attending (Confirmed)</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Seating Group</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Table, Groom Family, College Friends"
                    value={seatingGroup}
                    onChange={(e) => setSeatingGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Dietary Preferences</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Jain, Vegan, Low Sugar"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Accessibility</label>
                  <input
                    type="text"
                    placeholder="e.g. Wheelchair ramp, Ground floor"
                    value={accessibility}
                    onChange={(e) => setAccessibility(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Bride maternal uncle; staying at hotel"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DDD2]">
                <button
                  type="button"
                  onClick={() => setIsGuestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
