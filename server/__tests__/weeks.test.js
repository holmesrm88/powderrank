const { generateWeeks, getWeekEnd, parseWeekDates } = require('../utils/weeks');

describe('generateWeeks', () => {
  const weeks = generateWeeks();

  test('returns approximately 23 weeks', () => {
    expect(weeks.length).toBeGreaterThanOrEqual(22);
    expect(weeks.length).toBeLessThanOrEqual(24);
  });

  test('first week starts at Nov 1', () => {
    expect(weeks[0].week).toBe('11-01');
  });

  test('last week starts before Apr 5', () => {
    const last = weeks[weeks.length - 1];
    const [mm, dd] = last.week.split('-').map(Number);
    // Should be March something or early April
    if (mm === 4) {
      expect(dd).toBeLessThan(5);
    } else {
      expect(mm).toBeLessThanOrEqual(3);
    }
  });

  test('each week has week, label, endMM, endDD fields', () => {
    for (const w of weeks) {
      expect(w).toHaveProperty('week');
      expect(w).toHaveProperty('label');
      expect(w).toHaveProperty('endMM');
      expect(w).toHaveProperty('endDD');
      expect(w.week).toMatch(/^\d{2}-\d{2}$/);
      expect(w.endMM).toMatch(/^\d{2}$/);
      expect(w.endDD).toMatch(/^\d{2}$/);
    }
  });
});

describe('getWeekEnd', () => {
  test('02-07 → 02-14', () => {
    expect(getWeekEnd('02-07')).toBe('02-14');
  });

  test('12-27 → 01-03 (year boundary crossing)', () => {
    expect(getWeekEnd('12-27')).toBe('01-03');
  });

  test('02-28 → correct month-end handling', () => {
    const result = getWeekEnd('02-28');
    // Feb 28 + 7 = Mar 7 (2024 is leap year, so Feb has 29 days → Mar 6)
    // In 2024 (leap year): Feb 28 + 7 = Mar 6
    expect(result).toBe('03-06');
  });

  test('11-01 → 11-08', () => {
    expect(getWeekEnd('11-01')).toBe('11-08');
  });
});

describe('parseWeekDates', () => {
  test('02-07 → correct start and end parts', () => {
    const result = parseWeekDates('02-07');
    expect(result).toEqual({
      startMM: '02',
      startDD: '07',
      endMM: '02',
      endDD: '14'
    });
  });

  test('12-27 → year boundary crossing', () => {
    const result = parseWeekDates('12-27');
    expect(result).toEqual({
      startMM: '12',
      startDD: '27',
      endMM: '01',
      endDD: '03'
    });
  });
});
