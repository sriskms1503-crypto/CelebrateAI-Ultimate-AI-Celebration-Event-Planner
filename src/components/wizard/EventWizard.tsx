import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Palette,
  SlidersHorizontal,
  FileCheck2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { EventPlan, EventType, CurrencyCode } from '../../types/event';
import { formatCurrency } from '../../utils/budget';
import { isPastDate } from '../../utils/date';
import { INITIAL_INSPIRATION_ITEMS } from '../../services/storage';

interface EventWizardProps {
  onEventCreated: (event: EventPlan) => void;
  onCancel: () => void;
}

export const EventWizard: React.FC<EventWizardProps> = ({ onEventCreated, onCancel }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('18:00');
  const [city, setCity] = useState<string>('Hyderabad');
  const [venue, setVenue] = useState<string>('Grand Pavilion Banquet');
  const [isOutdoor, setIsOutdoor] = useState<boolean>(false);
  const [guestCount, setGuestCount] = useState<number>(120);
  const [duration, setDuration] = useState<string>('Full Day');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [culturalPreferences, setCulturalPreferences] = useState<string>(
    'Traditional celebration with modern hospitality'
  );

  // Budget
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [budgetAmount, setBudgetAmount] = useState<number>(200000);
  const [selectedBudgetPreset, setSelectedBudgetPreset] = useState<string>('₹1,00,000–₹5,00,000');

  // Style & Theme
  const [styleTheme, setStyleTheme] = useState<string>('Royal Luxury');

  // Priorities
  const [priorities, setPriorities] = useState<string[]>([
    'Catering',
    'Photography',
    'Decoration',
    'Guest experience',
  ]);

  const eventTypes: { type: EventType; desc: string }[] = [
    { type: 'Wedding', desc: 'Mandap, sangeet, banquet & rituals' },
    { type: 'Birthday', desc: 'Milestones, themes, music & cakes' },
    { type: 'Engagement', desc: 'Ring exchange, cocktails & dinner' },
    { type: 'Anniversary', desc: 'Vow renewal, reunion & celebration' },
    { type: 'Baby shower', desc: 'Blessings, games & family feast' },
    { type: 'Graduation', desc: 'Degree honors, toasts & gathering' },
    { type: 'College festival', desc: 'Concerts, competitions & stages' },
    { type: 'Community event', desc: 'Neighborhood gathering & festival' },
    { type: 'Corporate gathering', desc: 'Awards, gala dinner & executive meetup' },
    { type: 'Cultural festival', desc: 'Regional traditions, music & food' },
    { type: 'Custom event', desc: 'Tailored celebration from scratch' },
  ];

  const budgetPresets = [
    { label: '₹10,000–₹25,000', amount: 20000 },
    { label: '₹25,000–₹50,000', amount: 40000 },
    { label: '₹50,000–₹1,00,000', amount: 75000 },
    { label: '₹1,00,000–₹5,00,000', amount: 200000 },
    { label: '₹5,00,000 and above', amount: 650000 },
  ];

  const themeOptions = [
    { name: 'Royal Luxury', desc: 'Opulent drapes, chandeliers & gold accents' },
    { name: 'Traditional Indian', desc: 'Marigold cascades, brass diyas & silk drapes' },
    { name: 'Minimalist Modern', desc: 'Clean architectural lines & monochrome chic' },
    { name: 'Romantic Garden', desc: 'Fairy lights, pastel florals & rustic wood' },
    { name: 'Floral Pastel', desc: 'Soft blush, lavender & blooming arches' },
    { name: 'Bohemian Outdoor', desc: 'Earthy textures, pampas grass & rugs' },
    { name: 'Colourful & Playful', desc: 'Vibrant palettes, festive balloons & confetti' },
    { name: 'Eco-Friendly & Green', desc: 'Potted plants, zero plastic & food rescue' },
    { name: 'Contemporary Elegant', desc: 'Sophisticated ambient lighting & sleek decor' },
  ];

  const priorityOptions = [
    'Budget savings',
    'Venue',
    'Catering',
    'Photography',
    'Decoration',
    'Entertainment',
    'Guest experience',
    'Sustainability',
    'Accessibility',
    'Cultural requirements',
  ];

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter((item) => item !== p));
      }
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const validateStep2 = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter a name for your celebration.');
      return false;
    }
    if (!date) {
      setErrorMsg('Please select a valid event date.');
      return false;
    }
    if (guestCount <= 0) {
      setErrorMsg('Guest count must be at least 1.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) {
      return;
    }
    setErrorMsg(null);
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      eventType,
      name: name || `${styleTheme} ${eventType}`,
      date,
      startTime,
      endTime,
      city,
      venue,
      isOutdoor,
      guestCount,
      duration,
      preferredLanguage,
      culturalPreferences,
      budgetAmount,
      currency,
      styleTheme,
      priorities,
    };

    try {
      const response = await fetch('/api/ai/plan-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success || !data.plan) {
        throw new Error(data.error || 'Failed to synthesize celebration blueprint');
      }

      const generated = data.plan;

      // Construct complete EventPlan object
      const newEvent: EventPlan = {
        id: `event-${Date.now()}`,
        name: payload.name,
        eventType,
        date,
        startTime,
        endTime,
        city,
        venue,
        isOutdoor,
        guestCount,
        duration,
        preferredLanguage,
        culturalPreferences,
        currency,
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        budget: {
          total: budgetAmount,
          emergencyReserve: Math.round(budgetAmount * 0.05),
          categories: generated.budgetCategories || [],
          expenses: [],
        },
        styleTheme,
        priorities,
        concept: generated.concept,
        schedule: generated.schedule || [],
        checklist: (generated.checklist || []).map((t: any, idx: number) => ({
          ...t,
          id: `task-gen-${idx + 1}`,
          status: 'Pending',
        })),
        vendors: (generated.vendorRequirements || []).map((v: any, idx: number) => ({
          id: `ven-gen-${idx + 1}`,
          name: `${v.category} Specialist`,
          category: v.category,
          contactInfo: 'To be shortlisted',
          description: v.selectionCriteria || 'Recommended vendor criteria',
          bookingStatus: 'To Research',
          quotations: [],
          notes: `Suggested questions: ${(v.suggestedQuestions || []).join('; ')}`,
        })),
        guests: [
          {
            id: 'g-host',
            name: 'Primary Host / Family',
            contact: 'Primary Contact',
            attendeesCount: 2,
            invitationStatus: 'Draft',
            rsvpStatus: 'Attending',
            dietary: 'Standard',
            seatingGroup: 'Host Table',
            accessibility: 'None',
          },
        ],
        inspiration: INITIAL_INSPIRATION_ITEMS,
        moodBoards: [],
        invitation: {
          templateId: 'modern-celebration',
          title: payload.name,
          hostNames: 'You & Your Family',
          date: date,
          time: `${startTime} to ${endTime}`,
          venue: venue,
          address: `${city}`,
          rsvpDetails: 'Please RSVP by phone or web',
          language: preferredLanguage,
          colorTheme: styleTheme,
          font: 'Playfair Display',
          decorativeBorder: 'Classic Gold Leaf',
        },
        risks: generated.risks || [],
        vendorRequirements: generated.vendorRequirements || [],
        sustainability: generated.sustainability || [],
        notes: `Plan generated by CelebrateAI. Style: ${styleTheme}. Priorities: ${priorities.join(', ')}.`,
      };

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4A154B', '#7C3AED', '#F59E0B', '#FB923C'],
        });
      } catch {
        // Safe if canvas-confetti unsupported
      }

      onEventCreated(newEvent);
    } catch (err: any) {
      console.error('Wizard submission error:', err);
      setErrorMsg(err.message || 'Something went wrong while generating your plan. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Event Type',
    'Event Details',
    'Budget',
    'Style & Theme',
    'Priorities',
    'Review & Generate',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header & Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Celebration Wizard · Step {step} of 6
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#2D1236]">
              {stepTitles[step - 1]}
            </h1>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-[#6C5870] hover:text-[#2D1236] px-3 py-1.5 rounded-lg border border-[#D8C7B9] bg-white cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* 6 Step Progress Indicator */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s <= step
                  ? 'bg-gradient-to-r from-[#4A154B] to-[#7C3AED]'
                  : 'bg-[#E5DCD4]'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Containers */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 sm:p-8 shadow-sm">
        {/* Step 1: Event Type */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-[#5A4A5E]">
              Select the occasion you are celebrating. CelebrateAI will adapt the timeline, checklists, and cultural elements accordingly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {eventTypes.map((item) => (
                <div
                  key={item.type}
                  onClick={() => setEventType(item.type)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    eventType === item.type
                      ? 'border-[#7C3AED] bg-purple-50/70 shadow-sm ring-1 ring-[#7C3AED]'
                      : 'border-[#E2D5C8] hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2D1236]">{item.type}</span>
                    {eventType === item.type && (
                      <Check className="w-4 h-4 text-purple-700" />
                    )}
                  </div>
                  <p className="text-xs text-[#7A6A7E] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#2D1236] mb-1">
                Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Siddhartha & Ananya's Wedding or Aadhya's 5th Birthday"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
                {isPastDate(date) && (
                  <span className="text-[11px] text-amber-700 block mt-1">
                    Note: Selected date is in the past (retrospective mode).
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Mumbai, Bangalore, New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Preferred Venue / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Jubilee Hills Lawn, Community Hall, Home Garden"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">
                  Estimated Guest Count <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Setting</label>
                <select
                  value={isOutdoor ? 'outdoor' : 'indoor'}
                  onChange={(e) => setIsOutdoor(e.target.value === 'outdoor')}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                >
                  <option value="indoor">Indoor (AC Banquet / Hall)</option>
                  <option value="outdoor">Outdoor (Garden / Lawn / Rooftop)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Event Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                >
                  <option value="Half Day (3-4 hrs)">Half Day (3-4 hrs)</option>
                  <option value="Full Day">Full Day (6-8 hrs)</option>
                  <option value="Evening Soirée">Evening Soirée</option>
                  <option value="Multi-Day (2-3 Days)">Multi-Day (2-3 Days)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Preferred Language for Invites</label>
                <input
                  type="text"
                  placeholder="e.g. English, Telugu, Hindi, Tamil, Kannada"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1236] mb-1">Cultural Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. South Indian Telugu rituals, Jain dietary needs"
                  value={culturalPreferences}
                  onChange={(e) => setCulturalPreferences(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A4A5E]">
                Select a preset budget tier or enter your custom celebration limit.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span className="text-[#6C5870]">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="px-2 py-1 rounded-md border border-[#D8C7B9] bg-white font-mono"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {budgetPresets.map((preset) => (
                <div
                  key={preset.label}
                  onClick={() => {
                    setSelectedBudgetPreset(preset.label);
                    setBudgetAmount(preset.amount);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedBudgetPreset === preset.label
                      ? 'border-[#7C3AED] bg-purple-50/70 shadow-sm ring-1 ring-[#7C3AED]'
                      : 'border-[#E2D5C8] hover:border-purple-300 bg-white'
                  }`}
                >
                  <span className="text-sm font-bold font-mono text-[#2D1236]">{preset.label}</span>
                  <p className="text-xs text-[#7A6A7E] mt-1">
                    Approx {formatCurrency(preset.amount, currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E8DDD2]">
              <label className="block text-xs font-bold text-[#2D1236] mb-1">
                Custom Exact Budget Amount ({currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={budgetAmount}
                  onChange={(e) => {
                    setBudgetAmount(Math.max(0, parseInt(e.target.value) || 0));
                    setSelectedBudgetPreset('Custom');
                  }}
                  className="w-full px-4 py-2.5 text-base font-mono font-bold rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-[#FAF8F5]"
                />
              </div>
              <p className="text-xs text-[#7A6A7E] mt-1">
                Formatted: <span className="font-bold text-purple-900">{formatCurrency(budgetAmount, currency)}</span> (Avg {formatCurrency(guestCount > 0 ? Math.round(budgetAmount / guestCount) : 0, currency)} per guest)
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Style & Theme */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-xs text-[#5A4A5E]">
              Choose the aesthetic direction for your event. This guides color palettes, florals, lighting, and stage designs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {themeOptions.map((opt) => (
                <div
                  key={opt.name}
                  onClick={() => setStyleTheme(opt.name)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    styleTheme === opt.name
                      ? 'border-[#7C3AED] bg-purple-50/70 shadow-sm ring-1 ring-[#7C3AED]'
                      : 'border-[#E2D5C8] hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2D1236]">{opt.name}</span>
                    {styleTheme === opt.name && (
                      <Check className="w-4 h-4 text-purple-700" />
                    )}
                  </div>
                  <p className="text-xs text-[#7A6A7E] mt-1 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Priorities */}
        {step === 5 && (
          <div className="space-y-4">
            <p className="text-xs text-[#5A4A5E]">
              Select which areas matter most. When optimizing budgets, CelebrateAI will protect these categories from drastic cuts.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {priorityOptions.map((opt) => {
                const isSelected = priorities.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => togglePriority(opt)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#7C3AED] bg-purple-50 text-[#2D1236] font-semibold'
                        : 'border-[#E2D5C8] text-[#5A4A5E] hover:border-purple-300 bg-white'
                    }`}
                  >
                    <span className="text-xs">{opt}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-purple-700 border-purple-700 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Review & AI Generate */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                Celebration Overview
              </span>
              <h3 className="text-xl font-bold font-editorial text-[#2D1236] mt-1">
                {name || `${styleTheme} ${eventType}`}
              </h3>
              <p className="text-xs text-[#5A4A5E] mt-1">
                {eventType} · {date} · {startTime} to {endTime} ({duration})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2D5C8] space-y-2">
                <span className="font-bold text-[#2D1236]">Logistics & Location</span>
                <p className="text-[#6C5870]">City: <strong className="text-[#2D1236]">{city}</strong></p>
                <p className="text-[#6C5870]">Venue: <strong className="text-[#2D1236]">{venue}</strong> ({isOutdoor ? 'Outdoor' : 'Indoor'})</p>
                <p className="text-[#6C5870]">Guests: <strong className="text-[#2D1236]">{guestCount} people</strong></p>
                <p className="text-[#6C5870]">Language: <strong className="text-[#2D1236]">{preferredLanguage}</strong></p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2D5C8] space-y-2">
                <span className="font-bold text-[#2D1236]">Finances & Styling</span>
                <p className="text-[#6C5870]">Budget: <strong className="text-purple-950 font-mono text-sm">{formatCurrency(budgetAmount, currency)}</strong></p>
                <p className="text-[#6C5870]">Style & Theme: <strong className="text-[#2D1236]">{styleTheme}</strong></p>
                <p className="text-[#6C5870]">Key Priorities: <strong className="text-[#2D1236]">{priorities.join(', ')}</strong></p>
                <p className="text-[#6C5870]">Culture: <strong className="text-[#2D1236]">{culturalPreferences}</strong></p>
              </div>
            </div>

            <p className="text-xs text-[#7A6A7E] italic">
              Clicking generate will invoke CelebrateAI to build your tailored concept, schedule, reconciled budget, checklist, vendor questions, and risk mitigation plan.
            </p>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E8DDD2]">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#5A4A5E] hover:text-[#2D1236] rounded-xl border border-[#D8C7B9] bg-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#7C3AED] hover:from-[#3B1042] hover:to-[#6D28D9] rounded-xl shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#4A154B] via-[#7C3AED] to-[#EA580C] hover:opacity-95 rounded-xl shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Event Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>✨ Generate AI Celebration Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
