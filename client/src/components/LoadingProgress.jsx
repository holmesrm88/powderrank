function LoadingProgress({ progress }) {
  const pct = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="loading-container">
      <div className="loading-card">
        <div className="loading-spinner"></div>
        <h2 className="loading-title">Loading Historical Snowfall Data</h2>
        <p className="loading-hint">First load takes ~2 minutes. Future loads are instant.</p>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${pct}%` }}></div>
        </div>
        <p className="progress-pct">{pct}%</p>

        {progress.status && (
          <p className="progress-status">{progress.status}</p>
        )}
      </div>
    </div>
  );
}

export default LoadingProgress;
