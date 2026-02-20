import { useState, useMemo } from 'react';

const AIRBNB_HOT_TUB_ID = 25;
const AMENITY_OPTIONS = [
  { id: 'hot_tub', label: 'Hot Tub', airbnbId: AIRBNB_HOT_TUB_ID, vrboFilter: 'HOT_TUB' },
  { id: 'pool', label: 'Pool', airbnbId: 7, vrboFilter: 'POOL' },
  { id: 'fireplace', label: 'Fireplace', airbnbId: 27, vrboFilter: 'FIREPLACE' },
  { id: 'wifi', label: 'WiFi', airbnbId: 4, vrboFilter: 'WIFI' },
];

function buildAirbnbUrl(resort, guests, checkin, checkout, amenities) {
  const location = encodeURIComponent(`${resort.city}, ${resort.state}`);
  const params = new URLSearchParams();
  params.set('checkin', checkin);
  params.set('checkout', checkout);
  params.set('adults', guests.toString());
  let url = `https://www.airbnb.com/s/${location}/homes?${params.toString()}`;
  for (const am of amenities) {
    const opt = AMENITY_OPTIONS.find(a => a.id === am);
    if (opt) url += `&amenities[]=${opt.airbnbId}`;
  }
  return url;
}

function buildVrboUrl(resort, guests, checkin, checkout, amenities) {
  const location = encodeURIComponent(`${resort.city}, ${resort.state}`);
  const params = new URLSearchParams();
  params.set('destination', `${resort.city}, ${resort.state}`);
  params.set('startDate', checkin);
  params.set('d1', checkin);
  params.set('endDate', checkout);
  params.set('d2', checkout);
  params.set('adults', guests.toString());
  params.set('latLong', `${resort.latitude},${resort.longitude}`);
  params.set('sort', 'RECOMMENDED');
  let url = `https://www.vrbo.com/search?${params.toString()}`;
  for (const am of amenities) {
    const opt = AMENITY_OPTIONS.find(a => a.id === am);
    if (opt) url += `&amenities=${opt.vrboFilter}`;
  }
  return url;
}

function getWeekLabel(weekStart) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [mm, dd] = weekStart.split('-').map(Number);
  const start = new Date(2024, mm - 1, dd);
  const end = new Date(2024, mm - 1, dd + 7);
  const startLabel = `${months[start.getMonth()]} ${start.getDate()}`;
  const endLabel = start.getMonth() !== end.getMonth()
    ? `${months[end.getMonth()]} ${end.getDate()}`
    : `${end.getDate()}`;
  return `${startLabel}-${endLabel}`;
}

function getNextTripDates(weekStart) {
  const [mm, dd] = weekStart.split('-').map(Number);
  const now = new Date();
  let year = now.getFullYear();

  // Build the end date from the week
  const endDate = new Date(year, mm - 1, dd + 7);

  // If we're past the end of this week's window, use next year
  if (now > endDate) {
    year++;
  }

  const checkin = `${year}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  const end = new Date(year, mm - 1, dd + 7);
  const checkout = `${year}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

  return { checkin, checkout, year };
}

function ResortDetail({ resort, onBack, week = '02-07' }) {
  const [showTable, setShowTable] = useState(false);
  const [guests, setGuests] = useState(4);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const weekLabel = useMemo(() => getWeekLabel(week), [week]);
  const { checkin, checkout, year: tripYear } = useMemo(() => getNextTripDates(week), [week]);

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const airbnbUrl = useMemo(
    () => buildAirbnbUrl(resort, guests, checkin, checkout, selectedAmenities),
    [resort, guests, checkin, checkout, selectedAmenities]
  );
  const vrboUrl = useMemo(
    () => buildVrboUrl(resort, guests, checkin, checkout, selectedAmenities),
    [resort, guests, checkin, checkout, selectedAmenities]
  );

  const yearlyData = resort.yearlyData || [];
  const maxSnowfall = Math.max(...yearlyData.map(y => y.snowfall), 1);
  const chartHeight = 200;
  const barWidth = Math.max(12, Math.floor(700 / yearlyData.length) - 4);

  return (
    <div className="resort-detail">
      <button className="back-btn" onClick={onBack}>Back to Rankings</button>

      <div className="resort-hero">
        <img
          src={`/images/resorts/${resort.id}.jpg`}
          alt={`${resort.name} scenic view`}
          onError={(e) => { e.target.src = '/images/resorts/default.jpg'; }}
        />
      </div>

      <div className="detail-header">
        <div className="detail-rank">#{resort.rank}</div>
        <div>
          <h2 className="detail-name">{resort.name}</h2>
          <p className="detail-location">
            {resort.city}, {resort.state} &middot; {resort.region}
          </p>
          <p className="detail-elevation">
            Base: {resort.baseElevation?.toLocaleString()}' &middot; Summit: {resort.summitElevation?.toLocaleString()}'
          </p>
        </div>
        <div className="detail-score">
          <span className="score-number">{resort.compositeScore}</span>
          <span className="score-label">Composite Score</span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-value snowfall-value">{resort.avgSnowfall}"</span>
          <span className="metric-label">Avg {weekLabel} Snowfall</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{resort.consistency}%</span>
          <span className="metric-label">Consistency (&gt;2" weeks)</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{resort.nearbyCount}</span>
          <span className="metric-label">Resorts Within 2hr</span>
        </div>
        <div className="metric-card">
          <span className="metric-value best">{resort.bestYear?.snowfall}"</span>
          <span className="metric-label">Best Year ({resort.bestYear?.year})</span>
        </div>
        <div className="metric-card">
          <span className="metric-value worst">{resort.worstYear?.snowfall}"</span>
          <span className="metric-label">Worst Year ({resort.worstYear?.year})</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{resort.clusterBonus}</span>
          <span className="metric-label">Cluster Bonus</span>
        </div>
      </div>

      <div className="chart-section">
        <h3>{weekLabel} Snowfall by Year (inches)</h3>
        <div className="bar-chart">
          <svg width={yearlyData.length * (barWidth + 4) + 40} height={chartHeight + 40} className="chart-svg">
            {yearlyData.map((y, i) => {
              const barHeight = (y.snowfall / maxSnowfall) * chartHeight;
              const x = i * (barWidth + 4) + 20;
              return (
                <g key={y.year}>
                  <rect
                    x={x}
                    y={chartHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    className="chart-bar"
                    rx="2"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - barHeight - 4}
                    textAnchor="middle"
                    className="bar-value"
                  >
                    {y.snowfall > 0 ? y.snowfall : ''}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 16}
                    textAnchor="middle"
                    className="bar-label"
                    transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 16})`}
                  >
                    {y.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {resort.nearbyResorts && resort.nearbyResorts.length > 0 && (
        <div className="nearby-section">
          <h3>Resorts Within 2 Hours ({resort.nearbyResorts.length})</h3>
          <div className="nearby-list">
            {resort.nearbyResorts.map(nr => (
              <div key={nr.id} className="nearby-item">
                <span className="nearby-name">{nr.name}</span>
                <span className="nearby-distance">{nr.distance} mi</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rentals-section">
        <h3>Find Rentals Near {resort.name}</h3>
        <p className="rentals-subtitle">{weekLabel}, {tripYear} &middot; Opens Airbnb / VRBO with your filters pre-set</p>

        <div className="rentals-controls">
          <div className="rental-control">
            <label>Guests</label>
            <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
              {Array.from({ length: 15 }, (_, i) => i + 2).map(n => (
                <option key={n} value={n}>{n} guests</option>
              ))}
            </select>
          </div>
          <div className="rental-control">
            <label>Amenities (optional)</label>
            <div className="amenity-toggles">
              {AMENITY_OPTIONS.map(am => (
                <button
                  key={am.id}
                  className={`amenity-btn ${selectedAmenities.includes(am.id) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(am.id)}
                >
                  {am.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rental-links">
          <a href={airbnbUrl} target="_blank" rel="noopener noreferrer" className="rental-link airbnb">
            Search Airbnb
          </a>
          <a href={vrboUrl} target="_blank" rel="noopener noreferrer" className="rental-link vrbo">
            Search VRBO
          </a>
        </div>
      </div>

      <div className="yearly-section">
        <button className="toggle-table" onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown
        </button>
        {showTable && (
          <table className="yearly-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Snowfall</th>
                <th>Avg High</th>
                <th>Avg Low</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map(y => (
                <tr key={y.year}>
                  <td>{y.year}</td>
                  <td>{y.snowfall}"</td>
                  <td>{y.avgTempMax !== null ? `${y.avgTempMax}°F` : '—'}</td>
                  <td>{y.avgTempMin !== null ? `${y.avgTempMin}°F` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ResortDetail;
