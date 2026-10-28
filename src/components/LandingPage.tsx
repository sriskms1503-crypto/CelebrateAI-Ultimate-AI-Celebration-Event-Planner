import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Users,
  Compass,
  Leaf,
  ShieldCheck,
  ChevronDown,
  Gift,
  PartyPopper,
  Music,
  Camera,
  Layers,
  Heart,
  Clock,
} from 'lucide-react';
import { INITIAL_INSPIRATION_ITEMS } from '../services/storage';

interface LandingPageProps {
  onPlanEvent: () => void;
  onExploreInspiration: () => void;
  onOpenWorkspace: () => void;
  onOpenCopilot: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlanEvent,
  onExploreInspiration,
  onOpenWorkspace,
  onOpenCopilot,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { title: 'Luxury & Royal Weddings', count: 'Mandaps, Catering & Sangeet', icon: Sparkles, color: 'from-purple-900 to-indigo-900' },
    { title: 'Milestone Birthdays', count: 'Themed Parties, Decor & DJs', icon: PartyPopper, color: 'from-amber-600 to-orange-600' },
    { title: 'Engagements & Ring Ceremonies', count: 'Intimate Soirées & Banquets', icon: Heart, color: 'from-pink-700 to-rose-900' },
    { title: 'Anniversary Celebrations', count: 'Silver, Golden & Vow Renewals', icon: Gift, color: 'from-amber-700 to-yellow-800' },
    { title: 'Cultural Festivals & Poojas', count: 'Auspicious Rites & Prasadam', icon: Layers, color: 'from-orange-800 to-red-900' },
    { title: 'Corporate Galas & Awards', count: 'Keynotes, Dinners & Stages', icon: Users, color: 'from-slate-800 to-indigo-950' },
  ];

  const faqs = [
    {
      q: 'How does CelebrateAI generate a personalized event plan?',
      a: 'CelebrateAI combines your specific guest count, location, cultural customs, and budget with server-side Gemini AI intelligence. It creates reconciled category budgets, realistic hour-by-hour schedules, custom checklists, vendor criteria, and contingency plans in seconds.',
    },
    {
      q: 'Can I customize the generated budget and task timeline?',
      a: 'Absolutely! Every aspect is fully interactive. You can modify category budgets, log actual expenses with payment statuses (Paid/Pending), add or check off tasks, and recalculate remaining funds deterministically without arithmetic errors.',
    },
    {
      q: 'Does CelebrateAI work without an active AI API key?',
      a: 'Yes. CelebrateAI includes an Intelligent Local Engine and a complete pre-configured Demo Mode (an Elegant Garden Wedding in Hyderabad for 150 guests under ₹2,50,000) so you can explore all features smoothly anytime.',
    },
    {
      q: 'How are vendor quotations compared?',
      a: 'You can input quotations from caterers, decorators, venues, and photographers side-by-side to review included services, exclusions, deposit requirements, cancellation policies, and calculate cost variances.',
    },
    {
      q: 'Can I design and share custom invitations?',
      a: 'Yes! The built-in Invitation Studio provides customizable templates across occasions with typography, color palettes, venue details, and print or export support.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D1236]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#E8DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Next-Gen Celebration Intelligence · Challenge 5</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2D1236] leading-[1.15] font-editorial text-balance">
                Every Celebration Deserves a <span className="bg-gradient-to-r from-[#4A154B] via-[#7C3AED] to-[#EA580C] bg-clip-text text-transparent">Perfect Plan.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#5A4A5E] font-normal leading-relaxed max-w-2xl">
                Create unforgettable moments without the planning stress. Your AI event planner brings budgets, schedules, vendors, and creative ideas together in one beautiful workspace.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onPlanEvent}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#7C3AED] hover:from-[#3B1042] hover:to-[#6D28D9] text-white font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>✨ Plan My Event</span>
                </button>

                <button
                  onClick={onOpenWorkspace}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#D8C7B9] hover:bg-[#F5EFE8] text-[#3D2545] font-medium shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <span>Open Demo Event</span>
                </button>

                <button
                  onClick={onExploreInspiration}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm text-[#6C5870] hover:text-[#4A154B] transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Inspiration</span>
                </button>
              </div>

              {/* Trust signals */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#7A6A7E] border-t border-[#E8DDD2]/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Deterministic Budgeting & Variance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Eco-Friendly & Food Rescue Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Server-Side Gemini 3.8 Flash</span>
                </div>
              </div>
            </div>

            {/* Right Media Hero with Floating Planning Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 group">
                <img
                  src="/src/assets/images/hero_grand_celebration_1793190297590.jpg"
                  alt="Grand celebration floral ceiling and ballroom"
                  referrerPolicy="no-referrer"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Planning Preview Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-[#2D1236]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Live Event Synthesis
                    </span>
                    <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ₹2,50,000 Budget
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2D1236]">Your celebration is coming together!</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-[#5A4A5E]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Budget Organized</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Timeline Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tasks Prioritized</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Vendors to Explore</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Event Categories */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2] bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-editorial text-[#2D1236]">Celebrations Tailored for Every Milestone</h2>
            <p className="text-sm text-[#6C5870] mt-2">
              From grand cultural multi-day weddings to intimate birthday dinners, CelebrateAI crafts bespoke concepts and realistic financial frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  onClick={onPlanEvent}
                  className="group bg-white rounded-2xl p-6 border border-[#E2D5C8] hover:border-[#7C3AED]/40 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-800 transition-colors">
                      <Icon className="w-6 h-6 text-purple-700" />
                    </div>
                    <span className="text-xs text-purple-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                      Plan <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-[#2D1236] group-hover:text-purple-900 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#7A6A7E] mt-1">{cat.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How CelebrateAI Works */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Simple 3-Step Process</span>
            <h2 className="text-3xl font-bold font-editorial text-[#2D1236] mt-1">How CelebrateAI Brings Your Vision to Life</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#E2D5C8] relative">
              <span className="text-3xl font-bold text-amber-500/80 font-mono">01</span>
              <h3 className="text-lg font-bold text-[#2D1236] mt-3">Share Your Event Blueprint</h3>
              <p className="text-xs text-[#6C5870] mt-2 leading-relaxed">
                Specify your occasion, desired date, location, guest headcount, budget cap, cultural preferences, and priorities (e.g. food over decor).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E2D5C8] relative">
              <span className="text-3xl font-bold text-purple-500/80 font-mono">02</span>
              <h3 className="text-lg font-bold text-[#2D1236] mt-3">AI Architect Synthesizes Plan</h3>
              <p className="text-xs text-[#6C5870] mt-2 leading-relaxed">
                Gemini 3.8 Flash structures a full concept, reconciled budget allocations, chronological day-of schedule, risk assessment, and tasks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E2D5C8] relative">
              <span className="text-3xl font-bold text-emerald-600/80 font-mono">03</span>
              <h3 className="text-lg font-bold text-[#2D1236] mt-3">Track & Execute Seamlessly</h3>
              <p className="text-xs text-[#6C5870] mt-2 leading-relaxed">
                Manage RSVPs, track quotation differences, design invitations, optimize expenses by 15%, and consult your Copilot anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured HD Inspiration Gallery Preview */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2] bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Editorial Photography</span>
              <h2 className="text-3xl font-bold font-editorial text-[#2D1236] mt-1">High-Definition Celebration Inspiration</h2>
              <p className="text-sm text-[#6C5870] mt-1">Explore authentic decor, stages, lighting, and floral concepts for your mood board.</p>
            </div>
            <button
              onClick={onExploreInspiration}
              className="text-sm font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>View All 5 Themes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_INSPIRATION_ITEMS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={onExploreInspiration}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E2D5C8] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white">
                    {item.indicativeBudget}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-[#2D1236] mt-1 group-hover:text-purple-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6C5870] mt-1.5 line-clamp-2">{item.description}</p>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-[#7A6A7E]">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {item.colorPalette.map((c, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sustainability & Green Celebrations */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>Eco-Mindful Celebrations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-white">
                Celebrate Happily without Leaving a Heavy Footprint
              </h2>
              <p className="text-emerald-100/90 text-sm leading-relaxed">
                Every CelebrateAI plan generates localized sustainable suggestions: partnering with surplus food rescue NGOs, eliminating single-use plastic bottles, and using plantable seed paper invitations.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenWorkspace}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
                >
                  Explore Green Features in Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials (Clearly labeled sample stories) */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2] bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Sample Celebration Stories</span>
            <h2 className="text-3xl font-bold font-editorial text-[#2D1236] mt-1">Loved by Hosts & Coordinators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2D5C8] space-y-3">
              <p className="text-xs text-[#5A4A5E] italic leading-relaxed">
                "Planning our Hyderabad garden wedding within ₹2.5 Lakhs seemed daunting until CelebrateAI reconciled every single expense item and gave us a rain contingency plan that actually worked."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <p className="font-bold text-[#2D1236]">Ananya & Siddharth</p>
                <p className="text-[#7A6A7E]">Wedding in Hyderabad · 150 Guests</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2D5C8] space-y-3">
              <p className="text-xs text-[#5A4A5E] italic leading-relaxed">
                "The 15% budget optimizer saved us ₹45,000 without cutting our lead photographer. The quotation comparison table made choosing our caterer painless."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <p className="font-bold text-[#2D1236]">Rahul & Meera Varma</p>
                <p className="text-[#7A6A7E]">25th Silver Anniversary Gala</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2D5C8] space-y-3">
              <p className="text-xs text-[#5A4A5E] italic leading-relaxed">
                "Generated an entire dinosaur birthday timeline and invitation wording in 2 minutes. The task checklists and RSVP headcount tracker kept everything stress-free."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <p className="font-bold text-[#2D1236]">Sneha Kapoor</p>
                <p className="text-[#7A6A7E]">5th Birthday Celebration Host</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#E8DDD2]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-editorial text-[#2D1236]">Frequently Asked Questions</h2>
            <p className="text-xs text-[#6C5870] mt-1">Everything you need to know about planning with CelebrateAI.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E2D5C8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-bold text-[#2D1236] hover:text-purple-800 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-700 transition-transform ${
                      activeFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-4 text-xs text-[#5A4A5E] leading-relaxed border-t border-slate-50 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-[#4A154B] via-[#3B1042] to-[#1F0724] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ready to plan your milestone?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-editorial text-white leading-tight">
            Plan Beautifully. Celebrate Happily.
          </h2>

          <p className="text-purple-100 text-base max-w-xl mx-auto">
            Join thousands of happy hosts. Let our intelligent celebration engine handle the numbers, timelines, and logistics so you can cherish the memories.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onPlanEvent}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-[#2D1236] font-bold shadow-lg transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-purple-950" />
              <span>✨ Start Planning Now</span>
            </button>
            <button
              onClick={onOpenWorkspace}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-colors cursor-pointer"
            >
              Explore Sample Event
            </button>
          </div>
        </div>
      </section>

      {/* 9. Clean Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-[#E8DDD2] text-xs text-[#7A6A7E] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold font-editorial text-sm text-[#2D1236]">CelebrateAI</span>
            <span>· Challenge 5: Celebration & Event Planner</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Server-Side Gemini 3.8 Flash</span>
            <span>100% Deterministic Financial Arithmetic</span>
            <span>Zero-Waste Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
