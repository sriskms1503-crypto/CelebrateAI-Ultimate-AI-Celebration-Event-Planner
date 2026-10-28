import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { EventPlan, VendorItem, BookingStatus, VendorQuotation } from '../../../types/event';
import { formatCurrency } from '../../../utils/budget';

interface VendorsTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({ event, onUpdateEvent }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isVendorModalOpen, setIsVendorModalOpen] = useState<boolean>(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);

  // Vendor Form
  const [vendorName, setVendorName] = useState<string>('');
  const [vendorCategory, setVendorCategory] = useState<string>('Catering');
  const [vendorArea, setVendorArea] = useState<string>('');
  const [vendorContact, setVendorContact] = useState<string>('');
  const [vendorDesc, setVendorDesc] = useState<string>('');
  const [vendorPrice, setVendorPrice] = useState<number>(30000);
  const [vendorStatus, setVendorStatus] = useState<BookingStatus>('Contacted');
  const [vendorNotes, setVendorNotes] = useState<string>('');

  // Quotation Comparison Modal
  const [isQuoteCompareOpen, setIsQuoteCompareOpen] = useState<boolean>(false);
  const [compareCategory, setCompareCategory] = useState<string>('Venue');

  const vendorCategories = [
    'Venue',
    'Catering',
    'Photography',
    'Decoration',
    'Entertainment',
    'Clothing & Styling',
    'Invitations',
    'Transport',
  ];

  const bookingStatuses: BookingStatus[] = [
    'To Research',
    'Contacted',
    'Awaiting Quote',
    'Shortlisted',
    'Negotiating',
    'Booked',
    'Completed',
    'Cancelled',
  ];

  const openAddVendorModal = () => {
    setEditingVendorId(null);
    setVendorName('');
    setVendorCategory('Catering');
    setVendorArea('Local City');
    setVendorContact('');
    setVendorDesc('');
    setVendorPrice(30000);
    setVendorStatus('Contacted');
    setVendorNotes('');
    setIsVendorModalOpen(true);
  };

  const openEditVendorModal = (v: VendorItem) => {
    setEditingVendorId(v.id);
    setVendorName(v.name);
    setVendorCategory(v.category);
    setVendorArea(v.serviceArea || '');
    setVendorContact(v.contactInfo);
    setVendorDesc(v.description);
    setVendorPrice(v.quotedPrice || 0);
    setVendorStatus(v.bookingStatus);
    setVendorNotes(v.notes || '');
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    let updatedVendors: VendorItem[];
    if (editingVendorId) {
      updatedVendors = event.vendors.map((v) =>
        v.id === editingVendorId
          ? {
              ...v,
              name: vendorName,
              category: vendorCategory,
              serviceArea: vendorArea,
              contactInfo: vendorContact,
              description: vendorDesc,
              quotedPrice: vendorPrice,
              bookingStatus: vendorStatus,
              notes: vendorNotes,
            }
          : v
      );
    } else {
      const newVendor: VendorItem = {
        id: `ven-${Date.now()}`,
        name: vendorName,
        category: vendorCategory,
        serviceArea: vendorArea,
        contactInfo: vendorContact,
        description: vendorDesc,
        quotedPrice: vendorPrice,
        bookingStatus: vendorStatus,
        quotations: [],
        notes: vendorNotes,
      };
      updatedVendors = [newVendor, ...event.vendors];
    }

    onUpdateEvent({
      ...event,
      vendors: updatedVendors,
    });

    setIsVendorModalOpen(false);
  };

  const handleDeleteVendor = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove vendor "${name}"?`)) {
      const updated = event.vendors.filter((v) => v.id !== id);
      onUpdateEvent({
        ...event,
        vendors: updated,
      });
    }
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    const updated = event.vendors.map((v) => (v.id === id ? { ...v, bookingStatus: status } : v));
    onUpdateEvent({
      ...event,
      vendors: updated,
    });
  };

  const filteredVendors = event.vendors.filter(
    (v) => activeCategory === 'All' || v.category === activeCategory
  );

  // Collect all quotations for comparison
  const allQuotations: { vendor: VendorItem; quote: VendorQuotation }[] = [];
  event.vendors.forEach((v) => {
    v.quotations.forEach((q) => {
      allQuotations.push({ vendor: v, quote: q });
    });
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Vendor Sourcing & Contracts
          </span>
          <h2 className="text-xl font-bold font-editorial text-[#2D1236] mt-0.5">
            Vendor Directory & Quotation Matrix
          </h2>
          <p className="text-xs text-[#7A6A7E] mt-1">
            Manage partners across categories and compare quotation deliverables side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuoteCompareOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Compare Quotations</span>
          </button>

          <button
            onClick={openAddVendorModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'All'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-[#5A4A5E] border border-[#D8C7B9] hover:bg-[#FAF8F5]'
          }`}
        >
          All Partners ({event.vendors.length})
        </button>
        {vendorCategories.map((cat) => {
          const count = event.vendors.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-[#5A4A5E] border border-[#D8C7B9] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Vendor Cards Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2D5C8] p-12 text-center text-xs text-[#7A6A7E]">
          <p>No vendors listed in this category yet.</p>
          <button
            onClick={openAddVendorModal}
            className="mt-3 text-purple-700 font-bold hover:underline cursor-pointer"
          >
            + Add New Vendor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-[#E2D5C8] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {vendor.category}
                    </span>
                    <h3 className="text-base font-bold text-[#2D1236] mt-1.5">{vendor.name}</h3>
                    {vendor.serviceArea && (
                      <span className="text-[11px] text-[#7A6A7E] block">{vendor.serviceArea}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-[#2D1236] block">
                      {vendor.quotedPrice
                        ? formatCurrency(vendor.quotedPrice, event.currency)
                        : 'Awaiting Quote'}
                    </span>
                    {vendor.contractRef && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                        {vendor.contractRef}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#5A4A5E] mt-3 leading-relaxed">
                  {vendor.description}
                </p>

                {vendor.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DDD2] text-[11px] text-[#6C5870]">
                    <strong>Notes:</strong> {vendor.notes}
                  </div>
                )}

                <div className="mt-3 text-xs text-[#5A4A5E] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>{vendor.contactInfo}</span>
                  </div>
                </div>
              </div>

              {/* Status and Actions footer */}
              <div className="mt-5 pt-3 border-t border-[#E8DDD2] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-[#7A6A7E]">Status:</span>
                  <select
                    value={vendor.bookingStatus}
                    onChange={(e) =>
                      handleStatusChange(vendor.id, e.target.value as BookingStatus)
                    }
                    className={`text-xs px-2 py-1 rounded-lg font-semibold border cursor-pointer ${
                      vendor.bookingStatus === 'Booked'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : vendor.bookingStatus === 'Shortlisted'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {bookingStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditVendorModal(vendor)}
                    className="p-1 text-slate-500 hover:text-purple-700 cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete vendor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quotation Comparison Matrix Modal */}
      {isQuoteCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#E2D5C8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2D1236]">
                  Side-by-Side Quotation Comparison Matrix
                </h3>
                <p className="text-xs text-[#7A6A7E]">
                  Compare vendor proposals, deliverables, payment terms, and cancellation policies.
                </p>
              </div>
              <button
                onClick={() => setIsQuoteCompareOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {allQuotations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7A6A7E]">
                <p>No vendor quotations recorded yet. Add quotations in vendor profiles to compare.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allQuotations.map(({ vendor, quote }) => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-xl border border-[#E2D5C8] bg-[#FAF8F5] space-y-3 text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                        {vendor.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#2D1236]">{quote.vendorName}</h4>
                      <span className="text-base font-bold font-mono text-purple-950 block mt-1">
                        {formatCurrency(quote.totalPrice, event.currency)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-bold text-[#2D1236] block mb-1">Inclusions:</span>
                      <ul className="space-y-1 text-[11px] text-[#5A4A5E]">
                        {quote.includedServices.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {quote.exclusions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-[#2D1236] block mb-1">Exclusions:</span>
                        <ul className="space-y-1 text-[11px] text-[#7A6A7E]">
                          {quote.exclusions.map((exc, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-rose-500 font-bold">×</span>
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px] text-[#6C5870]">
                      <p>
                        Deposit: <strong>{formatCurrency(quote.deposit, event.currency)}</strong>
                      </p>
                      <p>
                        Terms: <em>{quote.cancellationTerms}</em>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2D5C8]">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#2D1236]">
                {editingVendorId ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D1236] mb-1">
                  Vendor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Krishna Royal Caterers"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Category</label>
                  <select
                    value={vendorCategory}
                    onChange={(e) => setVendorCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {vendorCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">
                    Quoted Price ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={vendorPrice}
                    onChange={(e) => setVendorPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Service Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad & Secunderabad"
                    value={vendorArea}
                    onChange={(e) => setVendorArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Booking Status</label>
                  <select
                    value={vendorStatus}
                    onChange={(e) => setVendorStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {bookingStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Contact Information</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98490 12345 | contact@caterer.in"
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Description / Services</label>
                <textarea
                  rows={2}
                  placeholder="Included services, team size, equipment, specialties"
                  value={vendorDesc}
                  onChange={(e) => setVendorDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Notes / Terms</label>
                <input
                  type="text"
                  placeholder="e.g. 50% advance required, contract signed"
                  value={vendorNotes}
                  onChange={(e) => setVendorNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DDD2]">
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
