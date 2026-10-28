import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  calculatePlannedExpenses,
  calculateActualExpenses,
  calculateRemainingBudget,
  calculateEstimatedBalance,
  calculateCategoryUtilization,
  calculateBudgetVariance,
  calculateBudgetUtilizationPct,
  calculateExpensesByStatus,
} from './budget';
import { ExpenseItem, BudgetCategory } from '../types/event';

describe('Budget Utility - Calculations & Financial Precision', () => {
  it('formats INR currency with Indian numbering notation', () => {
    const formatted = formatCurrency(250000, 'INR');
    expect(formatted).toContain('2,50,000');
    expect(formatted).toContain('₹');
  });

  it('formats USD, EUR and handles zero and negative numbers', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0');
    expect(formatCurrency(-5000, 'USD')).toContain('-$5,000');
    expect(formatCurrency(1200, 'EUR')).toContain('1,200');
  });

  it('calculates planned expenses accurately from category array', () => {
    const categories: BudgetCategory[] = [
      { category: 'Venue', estimatedCost: 60000, percentage: 30, reasoning: '', lowerCostAlternative: '' },
      { category: 'Catering', estimatedCost: 75000, percentage: 37.5, reasoning: '', lowerCostAlternative: '' },
      { category: 'Decoration', estimatedCost: 40000, percentage: 20, reasoning: '', lowerCostAlternative: '' },
    ];
    expect(calculatePlannedExpenses(categories)).toBe(175000);
  });

  it('calculates actual expenses from recorded items', () => {
    const expenses: ExpenseItem[] = [
      { id: '1', category: 'Venue', name: 'Deposit', amount: 30000, date: '2026-10-01', paymentStatus: 'Paid' },
      { id: '2', category: 'Catering', name: 'Deposit', amount: 35000, date: '2026-10-05', paymentStatus: 'Paid' },
      { id: '3', category: 'Decoration', name: 'Advance', amount: 15000, date: '2026-10-10', paymentStatus: 'Paid' },
    ];
    expect(calculateActualExpenses(expenses)).toBe(80000);
  });

  it('calculates remaining budget (Total Budget - Actual Expenses)', () => {
    // Total: 2,50,000; Actual: 80,000 -> Remaining: 1,70,000
    expect(calculateRemainingBudget(250000, 80000)).toBe(170000);
    // Overspend edge case: Total: 1,00,000; Actual: 1,20,000 -> Remaining: -20,000
    expect(calculateRemainingBudget(100000, 120000)).toBe(-20000);
  });

  it('calculates estimated balance (Total Budget - Planned Expenses)', () => {
    expect(calculateEstimatedBalance(200000, 180000)).toBe(20000);
    expect(calculateEstimatedBalance(200000, 200000)).toBe(0);
  });

  it('calculates category utilization and handles zero budgets without dividing by zero', () => {
    expect(calculateCategoryUtilization(30000, 60000)).toBe(50);
    expect(calculateCategoryUtilization(60000, 60000)).toBe(100);
    expect(calculateCategoryUtilization(75000, 50000)).toBe(150);
    expect(calculateCategoryUtilization(1000, 0)).toBe(100);
    expect(calculateCategoryUtilization(0, 0)).toBe(0);
  });

  it('calculates budget variance (Actual - Planned)', () => {
    // 35,000 actual vs 30,000 planned = +5,000 over budget
    expect(calculateBudgetVariance(35000, 30000)).toBe(5000);
    // 25,000 actual vs 30,000 planned = -5,000 under budget
    expect(calculateBudgetVariance(25000, 30000)).toBe(-5000);
  });

  it('calculates overall budget utilization percentage', () => {
    expect(calculateBudgetUtilizationPct(100000, 250000)).toBe(40);
    expect(calculateBudgetUtilizationPct(0, 250000)).toBe(0);
    expect(calculateBudgetUtilizationPct(5000, 0)).toBe(100);
  });

  it('sums expenses grouped by payment status correctly', () => {
    const expenses: ExpenseItem[] = [
      { id: '1', category: 'Venue', name: 'A', amount: 20000, date: '', paymentStatus: 'Paid' },
      { id: '2', category: 'Catering', name: 'B', amount: 15000, date: '', paymentStatus: 'Partial' },
      { id: '3', category: 'Decor', name: 'C', amount: 5000, date: '', paymentStatus: 'Pending' },
    ];
    const grouped = calculateExpensesByStatus(expenses);
    expect(grouped.paid).toBe(20000);
    expect(grouped.partial).toBe(15000);
    expect(grouped.pending).toBe(5000);
  });
});
