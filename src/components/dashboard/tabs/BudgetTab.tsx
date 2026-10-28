import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Layers,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { EventPlan, ExpenseItem, PaymentStatus, BudgetCategory } from '../../../types/event';
import {
  formatCurrency,
  calculatePlannedExpenses,
  calculateActualExpenses,
  calculateRemainingBudget,
  calculateCategoryUtilization,
  calculateBudgetVariance,
  calculateBudgetUtilizationPct,
  calculateCategoryExpenses,
  calculateExpensesByStatus,
} from '../../../utils/budget';

interface BudgetTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ event, onUpdateEvent }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Add/Edit Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const [expenseName, setExpenseName] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<string>(
    event.budget.categories[0]?.category || 'Venue'
  );
  const [expenseAmount, setExpenseAmount] = useState<number>(5000);
  const [expenseDate, setExpenseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [expenseStatus, setExpenseStatus] = useState<PaymentStatus>('Paid');
  const [expenseVendor, setExpenseVendor] = useState<string>('');
  const [expenseNotes, setExpenseNotes] = useState<string>('');

  // AI Optimizer State
  const [isOptimizerOpen, setIsOptimizerOpen] = useState<boolean>(false);
  const [reductionPct, setReductionPct] = useState<number>(15);
  const [protectedCats, setProtectedCats] = useState<string[]>(event.priorities);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  // Financial Calculations
  const totalBudget = event.budget.total;
  const plannedExpenses = calculatePlannedExpenses(event.budget.categories);
  const actualExpenses = calculateActualExpenses(event.budget.expenses);
  const remainingBudget = calculateRemainingBudget(totalBudget, actualExpenses);
  const utilizationPct = calculateBudgetUtilizationPct(actualExpenses, totalBudget);
  const variance = calculateBudgetVariance(actualExpenses, plannedExpenses);
  const emergencyReserve = event.budget.emergencyReserve || 0;
  const statusTotals = calculateExpensesByStatus(event.budget.expenses);

  const openAddExpenseModal = () => {
    setEditingExpenseId(null);
    setExpenseName('');
    setExpenseCategory(event.budget.categories[0]?.category || 'Venue');
    setExpenseAmount(5000);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setExpenseStatus('Paid');
    setExpenseVendor('');
    setExpenseNotes('');
    setIsExpenseModalOpen(true);
  };

  const openEditExpenseModal = (exp: ExpenseItem) => {
    setEditingExpenseId(exp.id);
    setExpenseName(exp.name);
    setExpenseCategory(exp.category);
    setExpenseAmount(exp.amount);
    setExpenseDate(exp.date);
    setExpenseStatus(exp.paymentStatus);
    setExpenseVendor(exp.vendorName || '');
    setExpenseNotes(exp.notes || '');
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName.trim() || expenseAmount <= 0) return;

    let updatedExpenses: ExpenseItem[];
    if (editingExpenseId) {
      updatedExpenses = event.budget.expenses.map((exp) =>
        exp.id === editingExpenseId
          ? {
              ...exp,
              name: expenseName,
              category: expenseCategory,
              amount: expenseAmount,
              date: expenseDate,
              paymentStatus: expenseStatus,
              vendorName: expenseVendor,
              notes: expenseNotes,
            }
          : exp
      );
    } else {
      const newExp: ExpenseItem = {
        id: `exp-${Date.now()}`,
        name: expenseName,
        category: expenseCategory,
        amount: expenseAmount,
        date: expenseDate,
        paymentStatus: expenseStatus,
        vendorName: expenseVendor,
        notes: expenseNotes,
      };
      updatedExpenses = [newExp, ...event.budget.expenses];
    }

    onUpdateEvent({
      ...event,
      budget: {
        ...event.budget,
        expenses: updatedExpenses,
      },
    });

    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete expense "${name}"?`)) {
      const updated = event.budget.expenses.filter((e) => e.id !== id);
      onUpdateEvent({
        ...event,
        budget: {
          ...event.budget,
          expenses: updated,
        },
      });
    }
  };

  // AI Optimizer Handlers
  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    setOptimizationResult(null);
    try {
      const res = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetReductionPct: reductionPct,
          currentBudget: totalBudget,
          protectedCategories: protectedCats,
          categories: event.budget.categories,
        }),
      });
      const data = await res.json();
      if (data.success && data.optimization) {
        setOptimizationResult(data.optimization);
      }
    } catch (err) {
      console.error('Failed to run AI optimizer:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    if (
      !window.confirm(
        `Apply proposed optimized budget of ${formatCurrency(
          optimizationResult.targetBudget,
          event.currency
        )}? Your category allocations will be updated.`
      )
    ) {
      return;
    }

    // Update category estimated amounts
    const updatedCategories: BudgetCategory[] = event.budget.categories.map((cat) => {
      const rec = optimizationResult.recommendations.find(
        (r: any) => r.category.toLowerCase() === cat.category.toLowerCase()
      );
      if (rec) {
        const newPct = Math.round((rec.proposedCost / optimizationResult.targetBudget) * 100);
        return {
          ...cat,
          estimatedCost: rec.proposedCost,
          percentage: newPct,
          reasoning: `${cat.reasoning} · Optimized: ${rec.actionableStrategy}`,
        };
      }
      return cat;
    });

    onUpdateEvent({
      ...event,
      budget: {
        ...event.budget,
        total: optimizationResult.targetBudget,
        categories: updatedCategories,
      },
    });

    setIsOptimizerOpen(false);
    setOptimizationResult(null);
  };

  const filteredExpenses = event.budget.expenses.filter((exp) => {
    const matchCat = filterCategory === 'All' || exp.category === filterCategory;
    const matchStatus = filterStatus === 'All' || exp.paymentStatus === filterStatus;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* 1. Overview Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Total Planned</span>
          <span className="text-xl font-bold font-mono text-[#2D1236] mt-1 block">
            {formatCurrency(totalBudget, event.currency)}
          </span>
          <span className="text-[10px] text-purple-700 font-medium">Original Cap</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Actual Spent</span>
          <span className="text-xl font-bold font-mono text-purple-900 mt-1 block">
            {formatCurrency(actualExpenses, event.currency)}
          </span>
          <span className="text-[10px] text-[#7A6A7E]">
            {event.budget.expenses.length} expenses
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Remaining</span>
          <span
            className={`text-xl font-bold font-mono mt-1 block ${
              remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {formatCurrency(remainingBudget, event.currency)}
          </span>
          <span className="text-[10px] text-[#7A6A7E]">
            {remainingBudget < 0 ? 'Budget exceeded' : 'Available balance'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Utilization</span>
          <span className="text-xl font-bold font-mono text-[#2D1236] mt-1 block">
            {utilizationPct}%
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                utilizationPct > 100 ? 'bg-rose-500' : 'bg-purple-600'
              }`}
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Paid Out</span>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
            {formatCurrency(statusTotals.paid, event.currency)}
          </span>
          <span className="text-[10px] text-amber-700">
            {formatCurrency(statusTotals.pending, event.currency)} pending
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2D5C8] shadow-sm">
          <span className="text-[11px] text-[#7A6A7E] font-medium block">Emergency Cushion</span>
          <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
            {formatCurrency(emergencyReserve, event.currency)}
          </span>
          <span className="text-[10px] text-[#7A6A7E]">Contingency reserve</span>
        </div>
      </div>

      {/* 2. AI Budget Optimizer Action Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold font-editorial text-white">Smart Budget Optimizer</h3>
          </div>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Want to reduce costs by 10-25% without sacrificing catering quality, photography, or guest experience? Run our AI trade-off optimizer.
          </p>
        </div>
        <button
          onClick={() => {
            setIsOptimizerOpen(true);
            setOptimizationResult(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-[#2D1236] font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          ✨ Propose Budget Optimization
        </button>
      </div>

      {/* 3. Category Allocation Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold font-editorial text-[#2D1236]">
              Category Allocation & Variance
            </h3>
            <p className="text-xs text-[#7A6A7E]">
              Track planned allocation against recorded actual vendor expenses.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {event.budget.categories.map((cat, idx) => {
            const actual = calculateCategoryExpenses(cat.category, event.budget.expenses);
            const util = calculateCategoryUtilization(actual, cat.estimatedCost);
            const diff = actual - cat.estimatedCost;

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DDD2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2D1236]">{cat.category}</span>
                    <span className="text-[11px] text-[#7A6A7E] font-mono">({cat.percentage}%)</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-[#6C5870]">
                      Planned: <strong>{formatCurrency(cat.estimatedCost, event.currency)}</strong>
                    </span>
                    <span className="text-purple-900">
                      Actual: <strong>{formatCurrency(actual, event.currency)}</strong>
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        diff > 0 ? 'text-rose-600' : diff < 0 ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {diff > 0 ? `+${formatCurrency(diff, event.currency)}` : formatCurrency(diff, event.currency)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      util > 100 ? 'bg-rose-500' : 'bg-[#7C3AED]'
                    }`}
                    style={{ width: `${Math.min(util, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7A6A7E] mt-1.5">
                  <span className="italic">{cat.reasoning}</span>
                  <span className="font-medium text-purple-900 shrink-0 ml-2">{util}% spent</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recorded Expenses Table & Tracker */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold font-editorial text-[#2D1236]">
              Expense Ledger & Payment Tracking
            </h3>
            <p className="text-xs text-[#7A6A7E]">
              Add deposits, milestone payments, and track vendor receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddExpenseModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#E8DDD2] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6C5870]">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All Categories</option>
              {event.budget.categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6C5870]">Payment Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <span className="text-[11px] text-[#7A6A7E] ml-auto">
            Showing {filteredExpenses.length} of {event.budget.expenses.length} records
          </span>
        </div>

        {/* Table */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#7A6A7E]">
            <p>No expenses recorded matching the current filter.</p>
            <button
              onClick={openAddExpenseModal}
              className="mt-3 text-purple-700 font-bold hover:underline cursor-pointer"
            >
              + Record First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8DDD2] text-[#7A6A7E] font-semibold">
                  <th className="py-2.5 px-3">Expense Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8E0]">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#2D1236]">
                      {exp.name}
                      {exp.notes && (
                        <span className="block text-[10px] text-[#7A6A7E] font-normal truncate max-w-xs">
                          {exp.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5A4A5E]">{exp.vendorName || '—'}</td>
                    <td className="py-3 px-3 font-mono text-[#7A6A7E]">{exp.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          exp.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : exp.paymentStatus === 'Partial'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {exp.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-[#2D1236]">
                      {formatCurrency(exp.amount, event.currency)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditExpenseModal(exp)}
                        className="p-1 text-slate-500 hover:text-purple-700 cursor-pointer mr-1"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id, exp.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2D5C8]">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#2D1236]">
                {editingExpenseId ? 'Edit Expense Record' : 'Record New Expense'}
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D1236] mb-1">
                  Expense Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawn Advance Deposit, Caterer Starter Tasting"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {event.budget.categories.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">
                    Amount ({event.currency}) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Payment Status</label>
                  <select
                    value={expenseStatus}
                    onChange={(e) => setExpenseStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Partial">Partial Deposit</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Krishna Royal Caterers"
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Notes / Receipt Ref</label>
                <input
                  type="text"
                  placeholder="e.g. Cheque #4029 cleared or Bank UPI reference"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DDD2]">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Budget Optimizer Modal */}
      {isOptimizerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2D5C8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-[#2D1236]">
                  AI Budget Optimization Strategy
                </h3>
              </div>
              <button
                onClick={() => setIsOptimizerOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#5A4A5E]">
                Target reduction percentage without reducing guest satisfaction:
              </p>

              <div className="flex items-center gap-3">
                {[10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setReductionPct(pct)}
                    className={`px-3 py-1.5 rounded-lg border font-mono font-bold cursor-pointer ${
                      reductionPct === pct
                        ? 'bg-purple-700 border-purple-700 text-white shadow-sm'
                        : 'border-[#D8C7B9] text-[#2D1236] bg-white'
                    }`}
                  >
                    -{pct}% (~{formatCurrency(Math.round(totalBudget * (pct / 100)), event.currency)})
                  </button>
                ))}
              </div>

              <div>
                <span className="block font-bold text-[#2D1236] mb-1.5">
                  Protect High-Priority Categories (Zero Reductions):
                </span>
                <div className="flex flex-wrap gap-2">
                  {event.budget.categories.map((c) => {
                    const isProt = protectedCats.includes(c.category);
                    return (
                      <button
                        key={c.category}
                        type="button"
                        onClick={() => {
                          if (isProt) {
                            setProtectedCats(protectedCats.filter((cat) => cat !== c.category));
                          } else {
                            setProtectedCats([...protectedCats, c.category]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg border cursor-pointer text-xs ${
                          isProt
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {isProt ? '✓ ' : ''}
                        {c.category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRunOptimizer}
                  disabled={isOptimizing}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Analyzing Trade-Offs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Synthesize Revised Budget Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Optimization Result Display */}
              {optimizationResult && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <span className="font-bold text-purple-950">Proposed Optimization Plan</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      Target: {formatCurrency(optimizationResult.targetBudget, event.currency)} (Saved{' '}
                      {formatCurrency(optimizationResult.totalSavings, event.currency)})
                    </span>
                  </div>

                  <p className="text-xs text-[#5A4A5E] italic">
                    {optimizationResult.overallAdvice}
                  </p>

                  <div className="space-y-2 mt-2">
                    {optimizationResult.recommendations.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white border border-purple-100 flex items-start justify-between gap-3 text-[11px]"
                      >
                        <div>
                          <strong className="text-[#2D1236]">{rec.category}</strong>: {rec.actionableStrategy}
                        </div>
                        <div className="text-right font-mono shrink-0">
                          <span className="text-slate-400 line-through mr-1">
                            {formatCurrency(rec.originalCost, event.currency)}
                          </span>
                          <span className="font-bold text-purple-900">
                            {formatCurrency(rec.proposedCost, event.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-purple-200 flex justify-end gap-2">
                    <button
                      onClick={() => setIsOptimizerOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={handleApplyOptimization}
                      className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Apply to Saved Budget</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
