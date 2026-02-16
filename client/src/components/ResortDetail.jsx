import { useState } from 'react';

function ResortDetail({ resort, onBack }) {
  const [showTable, setShowTable] = useState(false);

  const yearlyData = resort.yearlyData || [];
  const maxSnowfall = Math.max(...yearlyData.map(y => y.snowfall), 1);
  const chartHeight = 200;
  const barWidth = Math.max(12, Math.floor(700 / yearlyData.length) - 4);

  return (
    <div className="resort-detail">
      <button className="back-btn" onClick={onBack}>Back to Rankings</button>

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
          <span className="metric-label">Avg Feb 7-14 Snowfall</span>
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
        <h3>Feb 7-14 Snowfall by Year (inches)</h3>
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
