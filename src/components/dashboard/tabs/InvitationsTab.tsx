import React, { useState } from 'react';
import {
  Palette,
  Printer,
  Copy,
  Sparkles,
  Check,
  Download,
  Share2,
  FileText,
} from 'lucide-react';
import { EventPlan, InvitationConfig } from '../../../types/event';

interface InvitationsTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ event, onUpdateEvent }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [invitation, setInvitation] = useState<InvitationConfig>(event.invitation);

  const templates = [
    { id: 'royal-floral', name: 'Royal Gold & Mandap Arch', bg: 'bg-[#FFFDF9] border-[#D4AF37]', accent: 'text-[#4A154B]' },
    { id: 'midnight-champagne', name: 'Midnight Violet & Gold', bg: 'bg-[#2A0832] border-[#F59E0B] text-white', accent: 'text-amber-300' },
    { id: 'botanical-garden', name: 'Enchanted Botanical Sage', bg: 'bg-[#F4F7F4] border-[#166534]', accent: 'text-[#166534]' },
    { id: 'modern-clean', name: 'Minimalist Ivory Elegance', bg: 'bg-white border-slate-300', accent: 'text-slate-900' },
  ];

  const handleFieldChange = (field: keyof InvitationConfig, val: string) => {
    const updated = { ...invitation, [field]: val };
    setInvitation(updated);
    onUpdateEvent({
      ...event,
      invitation: updated,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `${invitation.title}
Together with their families:
${invitation.hostNames}

cordially invite you to celebrate:
Date: ${invitation.date}
Time: ${invitation.time}
Venue: ${invitation.venue}, ${invitation.address}

RSVP: ${invitation.rsvpDetails}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTemplate = templates.find((t) => t.id === invitation.templateId) || templates[0];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Stationery & Digital Studio
          </span>
          <h2 className="text-xl font-bold font-editorial text-[#2D1236] mt-0.5">
            Customizable Invitation & Poster Studio
          </h2>
          <p className="text-xs text-[#7A6A7E] mt-1">
            Personalize your formal invitation card, choose typography, and print or broadcast via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D8C7B9] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#5A4A5E] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-700" />}
            <span>{copied ? 'Copied Wording' : 'Copy Message'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invitation Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customizer Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#2D1236] border-b border-[#E8DDD2] pb-2">
            Customize Invitation Details
          </h3>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">Theme Template</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleFieldChange('templateId', tpl.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    invitation.templateId === tpl.id
                      ? 'border-purple-600 bg-purple-50 font-bold text-purple-950 ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="block truncate text-[11px]">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">Event Header / Title</label>
            <input
              type="text"
              value={invitation.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">Host Family Names</label>
            <input
              type="text"
              value={invitation.hostNames}
              onChange={(e) => handleFieldChange('hostNames', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D1236] mb-1">Date Display</label>
              <input
                type="text"
                value={invitation.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D1236] mb-1">Time</label>
              <input
                type="text"
                value={invitation.time}
                onChange={(e) => handleFieldChange('time', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">Venue Name</label>
            <input
              type="text"
              value={invitation.venue}
              onChange={(e) => handleFieldChange('venue', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">Address / Landmark</label>
            <input
              type="text"
              value={invitation.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D1236] mb-1">RSVP Contact Details</label>
            <input
              type="text"
              value={invitation.rsvpDetails}
              onChange={(e) => handleFieldChange('rsvpDetails', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Right: Live Interactive Card Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border-4 shadow-2xl relative transition-all duration-300 text-center space-y-6 print:shadow-none print:border-none print:m-0"
               style={{
                 backgroundColor: invitation.templateId === 'midnight-champagne' ? '#220729' : '#FAF8F5',
                 color: invitation.templateId === 'midnight-champagne' ? '#FDF4FF' : '#2D1236',
                 borderColor: invitation.templateId === 'midnight-champagne' ? '#D4AF37' : '#D4AF37',
               }}>
            
            {/* Ornate corner motifs */}
            <div className="w-8 h-8 border-t-2 border-l-2 border-amber-500 absolute top-4 left-4" />
            <div className="w-8 h-8 border-t-2 border-r-2 border-amber-500 absolute top-4 right-4" />
            <div className="w-8 h-8 border-b-2 border-l-2 border-amber-500 absolute bottom-4 left-4" />
            <div className="w-8 h-8 border-b-2 border-r-2 border-amber-500 absolute bottom-4 right-4" />

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-amber-600 block">
                Together With Our Families
              </span>
              <p className="text-xs italic text-[#5A4A5E] max-w-xs mx-auto leading-relaxed"
                 style={{ color: invitation.templateId === 'midnight-champagne' ? '#E9D5FF' : '#5A4A5E' }}>
                {invitation.hostNames}
              </p>
            </div>

            <div className="py-2">
              <span className="text-xs uppercase tracking-widest text-[#7A6A7E] block mb-1">
                Cordially Invite You To Celebrate
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial leading-tight text-balance"
                  style={{ color: invitation.templateId === 'midnight-champagne' ? '#FEF08A' : '#4A154B' }}>
                {invitation.title}
              </h2>
            </div>

            <div className="py-3 border-y border-amber-400/50 space-y-1">
              <p className="text-sm font-bold tracking-wide">{invitation.date}</p>
              <p className="text-xs font-mono text-amber-700"
                 style={{ color: invitation.templateId === 'midnight-champagne' ? '#FDE047' : '#B45309' }}>
                {invitation.time}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-sm">{invitation.venue}</p>
              <p className="text-[11px] text-[#6C5870]"
                 style={{ color: invitation.templateId === 'midnight-champagne' ? '#D8B4FE' : '#6C5870' }}>
                {invitation.address}
              </p>
            </div>

            <div className="pt-4 border-t border-amber-400/30 text-[10px]">
              <span className="font-bold uppercase tracking-wider block mb-0.5">Please RSVP</span>
              <p className="font-mono text-xs">{invitation.rsvpDetails}</p>
            </div>
          </div>

          <span className="text-[11px] text-[#7A6A7E] mt-4">
            Live preview rendered with print styling. Click "Print Invitation Card" to save as PDF or physical printout.
          </span>
        </div>
      </div>
    </div>
  );
};
