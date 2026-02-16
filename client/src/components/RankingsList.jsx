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
  'British Columbia',
  'Alberta',
  'Quebec'
];

const SORT_OPTIONS = [
  { key: 'compositeScore', label: 'Composite Score' },
  { key: 'avgSnowfall', label: 'Avg Snowfall' },
  { key: 'consistency', label: 'Consistency' }
];

function RankingsList({ rankings, onSelect }) {
  const [region, setRegion] = useState('All');
  const [sortBy, setSortBy] = useState('compositeScore');

  const filtered = useMemo(() => {
    let list = rankings;
    if (region !== 'All') {
      list = list.filter(r => r.region === region);
    }
    if (sortBy !== 'compositeScore') {
      list = [...list].sort((a, b) => b[sortBy] - a[sortBy]);
    }
    return list;
  }, [rankings, region, sortBy]);

  return (
    <div className="rankings-list">
      <div className="filters-bar">
        <div className="filter-group">
          <label>Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
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
