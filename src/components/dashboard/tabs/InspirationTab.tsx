import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  Check,
  Plus,
  Palette,
  Sparkles,
  Layers,
  Heart,
  X,
} from 'lucide-react';
import { EventPlan, InspirationItem, MoodBoard } from '../../../types/event';

interface InspirationTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const InspirationTab: React.FC<InspirationTabProps> = ({ event, onUpdateEvent }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState<boolean>(false);
  const [boardName, setBoardName] = useState<string>('');
  const [boardDesc, setBoardDesc] = useState<string>('');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(
    event.moodBoards[0]?.id || null
  );

  const categories = [
    'All',
    'Wedding decoration',
    'Garden venues',
    'Birthday themes',
    'Stage design',
    'Lighting',
  ];

  const handleToggleSave = (item: InspirationItem) => {
    const updatedInspiration = event.inspiration.map((insp) =>
      insp.id === item.id ? { ...insp, isSaved: !insp.isSaved } : insp
    );

    onUpdateEvent({
      ...event,
      inspiration: updatedInspiration,
    });
  };

  const handleApplyThemeToEvent = (item: InspirationItem) => {
    if (
      window.confirm(
        `Apply "${item.title}" to your active celebration? This will set your theme and color palette.`
      )
    ) {
      onUpdateEvent({
        ...event,
        styleTheme: item.title,
        concept: {
          ...event.concept,
          colorPalette: item.colorPalette,
          description: `${event.concept.description} Styled after ${item.title}.`,
        },
      });
      alert(`Applied theme "${item.title}" to ${event.name}!`);
    }
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    const newBoard: MoodBoard = {
      id: `mb-${Date.now()}`,
      name: boardName,
      description: boardDesc,
      inspirationIds: [],
      createdAt: new Date().toISOString(),
    };

    onUpdateEvent({
      ...event,
      moodBoards: [...event.moodBoards, newBoard],
    });

    setSelectedBoardId(newBoard.id);
    setIsNewBoardModalOpen(false);
    setBoardName('');
    setBoardDesc('');
  };

  const filteredItems = event.inspiration.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Aesthetic Inspiration & Visual Curations
          </span>
          <h2 className="text-xl font-bold font-editorial text-[#2D1236] mt-0.5">
            HD Inspiration Gallery & Mood Boards
          </h2>
          <p className="text-xs text-[#7A6A7E] mt-1">
            Browse high-resolution setups, color harmonies, and apply them directly to your celebration concept.
          </p>
        </div>

        <button
          onClick={() => setIsNewBoardModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Mood Board</span>
        </button>
      </div>

      {/* Mood Boards Bar */}
      {event.moodBoards.length > 0 && (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D5C8] space-y-2">
          <span className="text-xs font-bold text-[#2D1236]">My Saved Mood Boards:</span>
          <div className="flex flex-wrap items-center gap-2">
            {event.moodBoards.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoardId(selectedBoardId === b.id ? null : b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  selectedBoardId === b.id
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-[#5A4A5E] border-[#D8C7B9] hover:bg-purple-50'
                }`}
              >
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-[#5A4A5E] border border-[#D8C7B9] hover:bg-[#FAF8F5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-[#E2D5C8] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-white">
                  {item.category}
                </div>
                <button
                  onClick={() => handleToggleSave(item)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md cursor-pointer transition-colors ${
                    item.isSaved
                      ? 'bg-purple-700 text-amber-300'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title={item.isSaved ? 'Saved in mood board' : 'Save to mood board'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-[#2D1236] group-hover:text-purple-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5A4A5E] mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Color Palette */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6A7E] block mb-1.5">
                    Palette Harmony
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.colorPalette.map((col, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                        title={`${col.name} (${col.hex})`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#7A6A7E]">
                  <span>Indicative:</span>
                  <span className="font-mono font-bold text-[#2D1236]">
                    {item.indicativeBudget}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleApplyThemeToEvent(item)}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Apply Theme to Celebration</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Mood Board Modal */}
      {isNewBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2D5C8]">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#2D1236]">Create New Mood Board</h3>
              <button
                onClick={() => setIsNewBoardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D1236] mb-1">
                  Board Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Royal Violet & Jasmine"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Styling vibe, fabrics, flower ideas"
                  value={boardDesc}
                  onChange={(e) => setBoardDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DDD2]">
                <button
                  type="button"
                  onClick={() => setIsNewBoardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
