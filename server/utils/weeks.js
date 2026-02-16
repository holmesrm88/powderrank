function generateWeeks() {
  const weeks = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Start Nov 1, end around Apr 5, step 7 days
  let current = new Date(2024, 10, 1); // Nov 1 (month is 0-indexed)
  const end = new Date(2025, 3, 5);    // Apr 5

  while (current < end) {
    const startMonth = current.getMonth();
    const startDay = current.getDate();
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const endMonth = weekEnd.getMonth();
    const endDay = weekEnd.getDate();

    const weekKey = `${String(startMonth + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const startLabel = `${months[startMonth]} ${startDay}`;
    const endLabel = endMonth !== startMonth
      ? `${months[endMonth]} ${endDay}`
      : `${endDay}`;
    const label = `${startLabel}-${endLabel}`;

    weeks.push({ week: weekKey, label, endMM: String(endMonth + 1).padStart(2, '0'), endDD: String(endDay).padStart(2, '0') });

    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

function getWeekEnd(weekStart) {
  const [mm, dd] = weekStart.split('-').map(Number);
  const d = new Date(2024, mm - 1, dd);
  d.setDate(d.getDate() + 7);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseWeekDates(weekStart) {
  const [startMM, startDD] = weekStart.split('-');
  const endKey = getWeekEnd(weekStart);
  const [endMM, endDD] = endKey.split('-');
  return { startMM, startDD, endMM, endDD };
}

module.exports = { generateWeeks, getWeekEnd, parseWeekDates };
