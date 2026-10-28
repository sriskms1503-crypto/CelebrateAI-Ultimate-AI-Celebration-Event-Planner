import { describe, it, expect } from 'vitest';
import {
  getDaysRemaining,
  isPastDate,
  formatEventDate,
  formatShortDate,
  generateAdaptiveMilestones,
} from './date';

describe('Date & Timeline Utility', () => {
  it('correctly calculates days remaining for a future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const dateStr = future.toISOString().split('T')[0];
    expect(getDaysRemaining(dateStr)).toBe(10);
  });

  it('identifies past dates vs future dates', () => {
    expect(isPastDate('2020-01-01')).toBe(true);
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isPastDate(future.toISOString().split('T')[0])).toBe(false);
  });

  it('formats dates in readable human strings', () => {
    const formatted = formatEventDate('2026-11-28');
    expect(formatted).toContain('November');
    expect(formatted).toContain('2026');
  });

  it('generates adaptive planning milestones based on lead time', () => {
    // 6 months away
    const farDate = new Date();
    farDate.setDate(farDate.getDate() + 180);
    const longTermMilestones = generateAdaptiveMilestones(farDate.toISOString().split('T')[0], 'Wedding');
    expect(longTermMilestones.length).toBeGreaterThanOrEqual(4);
    expect(longTermMilestones[0].phase).toContain('Months');

    // 5 days away (urgent)
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 4);
    const urgentMilestones = generateAdaptiveMilestones(soonDate.toISOString().split('T')[0], 'Birthday');
    expect(urgentMilestones[0].phase).toContain('Immediate');
  });
});
