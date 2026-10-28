import { CurrencyCode, BudgetCategory, ExpenseItem } from '../types/event';

/**
 * Format currency with internationalization and Indian numbering standard for INR.
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  // Rounded to 2 decimals or integer for neat presentation
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (currency === 'INR') {
    // Format according to Indian lakh/crore numbering: 2,50,000
    formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(absAmount);
  } else {
    formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(absAmount);
  }

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Calculate total planned (estimated) expenses from categories
 */
export function calculatePlannedExpenses(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (Number(cat.estimatedCost) || 0), 0);
}

/**
 * Calculate total actual recorded expenses
 */
export function calculateActualExpenses(expenses: ExpenseItem[]): number {
  return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
}

/**
 * Remaining budget = Total budget - Actual expenses
 */
export function calculateRemainingBudget(totalBudget: number, actualExpenses: number): number {
  return (Number(totalBudget) || 0) - (Number(actualExpenses) || 0);
}

/**
 * Estimated balance = Total budget - Planned expenses
 */
export function calculateEstimatedBalance(totalBudget: number, plannedExpenses: number): number {
  return (Number(totalBudget) || 0) - (Number(plannedExpenses) || 0);
}

/**
 * Category utilization = Category actual expenses / Category budget * 100
 * Handles zero budget safely
 */
export function calculateCategoryUtilization(actual: number, planned: number): number {
  if (!planned || planned <= 0) {
    return actual > 0 ? 100 : 0;
  }
  const pct = (actual / planned) * 100;
  return Math.min(Math.round(pct * 10) / 10, 999);
}

/**
 * Budget variance = Actual expenses - Planned expenses
 * Positive means over budget, negative means under budget
 */
export function calculateBudgetVariance(actual: number, planned: number): number {
  return (Number(actual) || 0) - (Number(planned) || 0);
}

/**
 * Budget utilization percentage = Total actual expenses / Total budget * 100
 */
export function calculateBudgetUtilizationPct(actualExpenses: number, totalBudget: number): number {
  if (!totalBudget || totalBudget <= 0) {
    return actualExpenses > 0 ? 100 : 0;
  }
  const pct = (actualExpenses / totalBudget) * 100;
  return Math.min(Math.round(pct * 10) / 10, 999);
}

/**
 * Calculate actual spent per category
 */
export function calculateCategoryExpenses(categoryName: string, expenses: ExpenseItem[]): number {
  return expenses
    .filter((e) => e.category.toLowerCase().trim() === categoryName.toLowerCase().trim())
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

/**
 * Sum expenses grouped by payment status (Paid, Partial, Pending)
 */
export function calculateExpensesByStatus(expenses: ExpenseItem[]) {
  return expenses.reduce(
    (acc, exp) => {
      const amt = Number(exp.amount) || 0;
      if (exp.paymentStatus === 'Paid') acc.paid += amt;
      else if (exp.paymentStatus === 'Partial') acc.partial += amt;
      else acc.pending += amt;
      return acc;
    },
    { paid: 0, partial: 0, pending: 0 }
  );
}
