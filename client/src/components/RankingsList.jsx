import { useState, useMemo } from 'react';
import ResortCard from './ResortCard';

const REGIONS = [
  'All',
  'Colorado',
  'Utah',
  'Wyoming',
  'Montana',
  'Idaho',
  'California',
  'Pacific NW',
  'New Mexico',
  'Northeast',
  'Ontario',
  'British Columbia',
  'Alberta',
  'Quebec',
  'Japan',
  'Alps',
  'Australia/NZ',
  'South America',
];

const SORT_OPTIONS = [
  { key: 'compositeScore', label: 'Composite Score' },
  { key: 'avgSnowfall', label: 'Avg Snowfall' },
  { key: 'consistency', label: 'Consistency' }
];

function generateWeekOptions() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeks = [];
  let current = new Date(2024, 10, 1); // Nov 1
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

    weeks.push({ week: weekKey, label: `${startLabel}-${endLabel}` });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

const WEEK_OPTIONS = generateWeekOptions();

function RankingsList({ rankings, onSelect, week, onWeekChange, cachedWeeks }) {
  const [region, setRegion] = useState('All');
  const [sortBy, setSortBy] = useState('compositeScore');
  const [passFilter, setPassFilter] = useState('All'); // 'All' | 'Ikon' | 'Epic'

  const cachedSet = useMemo(() => {
    const s = new Set();
    for (const w of cachedWeeks) {
      if (w.cached) s.add(w.week);
    }
    return s;
  }, [cachedWeeks]);

  const filtered = useMemo(() => {
    let list = rankings;
    if (region !== 'All') {
      list = list.filter(r => r.region === region);
    }
    if (passFilter === 'Ikon') {
      list = list.filter(r => r.ikonPass === true);
    } else if (passFilter === 'Epic') {
      list = list.filter(r => r.epicPass === true);
    }
    if (sortBy !== 'compositeScore') {
      list = [...list].sort((a, b) => b[sortBy] - a[sortBy]);
    }
    return list;
  }, [rankings, region, sortBy, passFilter]);

  return (
    <div className="rankings-list">
      <div className="filters-bar">
        <div className="filter-group">
          <label>Week</label>
          <select value={week} onChange={e => onWeekChange(e.target.value)}>
            {WEEK_OPTIONS.map(w => (
              <option key={w.week} value={w.week}>
                {w.label}{!cachedSet.has(w.week) && w.week !== week ? ' (loading...)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Pass</label>
          <div className="pass-toggles">
            <button
              className={`pass-btn ikon-btn ${passFilter === 'Ikon' ? 'active' : ''}`}
              onClick={() => setPassFilter(passFilter === 'Ikon' ? 'All' : 'Ikon')}
            >
              Ikon
            </button>
            <button
              className={`pass-btn epic-btn ${passFilter === 'Epic' ? 'active' : ''}`}
              onClick={() => setPassFilter(passFilter === 'Epic' ? 'All' : 'Epic')}
            >
              Epic
            </button>
          </div>
        </div>
        <div className="filter-group">
          <label>Sort by</label>
          <div className="sort-toggles">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`sort-btn ${sortBy === opt.key ? 'active' : ''}`}
                onClick={() => setSortBy(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="results-count">{filtered.length} resorts</div>
      </div>
      <div className="cards-grid">
        {filtered.map((resort, idx) => (
          <ResortCard
            key={resort.id}
            resort={resort}
            displayRank={sortBy === 'compositeScore' ? resort.rank : idx + 1}
            onClick={() => onSelect(resort.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default RankingsList;
