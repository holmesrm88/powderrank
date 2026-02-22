function ResortCard({ resort, displayRank, onClick }) {
  const rankClass = displayRank === 1 ? 'gold' : displayRank === 2 ? 'silver' : displayRank === 3 ? 'bronze' : '';

  return (
    <div className="resort-card" onClick={onClick}>
      <div className={`rank-badge ${rankClass}`}>
        #{displayRank}
      </div>
      <div className="card-body">
        <div className="card-header">
          <h3 className="resort-name">{resort.name}</h3>
          <span className="resort-location">{resort.city}, {resort.state}</span>
          <span className="region-tag">{resort.region}</span>
          {resort.ikonPass && <span className="pass-tag ikon-tag">Ikon</span>}
          {resort.epicPass && <span className="pass-tag epic-tag">Epic</span>}
        </div>
        <div className="card-stats">
          <div className="stat">
            <span className="stat-value snowfall-value">{resort.avgSnowfall}"</span>
            <span className="stat-label">Avg Snowfall</span>
          </div>
          <div className="stat">
            <div className="consistency-bar-container">
              <div className="consistency-bar" style={{ width: `${resort.consistency}%` }}></div>
            </div>
            <span className="stat-value">{resort.consistency}%</span>
            <span className="stat-label">Consistency</span>
          </div>
          <div className="stat">
            <span className="stat-value">{resort.nearbyCount}</span>
            <span className="stat-label">Nearby Resorts</span>
          </div>
        </div>
        <div className="card-footer">
          <span className="composite-score">Score: {resort.compositeScore}</span>
        </div>
      </div>
    </div>
  );
}

export default ResortCard;
