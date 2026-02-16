import { useState, useEffect, useCallback } from 'react';
import RankingsList from './components/RankingsList';
import ResortDetail from './components/ResortDetail';
import LoadingProgress from './components/LoadingProgress';

function App() {
  const [rankings, setRankings] = useState(null);
  const [selectedResortId, setSelectedResortId] = useState(null);
  const [selectedResort, setSelectedResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [error, setError] = useState(null);

  const fetchRankings = useCallback(async () => {
    try {
      const res = await fetch('/api/rankings');
      const data = await res.json();

      if (data.rankings) {
        setRankings(data.rankings);
        setLoading(false);
      } else if (data.loading) {
        // Poll progress
        const pollProgress = async () => {
          try {
            const progRes = await fetch('/api/rankings/progress');
            const progData = await progRes.json();
            setProgress(progData);

            if (progData.inProgress) {
              setTimeout(pollProgress, 2000);
            } else {
              // Fetch rankings again
              const res2 = await fetch('/api/rankings');
              const data2 = await res2.json();
              if (data2.rankings) {
                setRankings(data2.rankings);
                setLoading(false);
              }
            }
          } catch (err) {
            setError('Failed to check progress');
          }
        };
        pollProgress();
      }
    } catch (err) {
      setError('Failed to load rankings. Is the server running?');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handleSelectResort = async (resortId) => {
    try {
      const res = await fetch(`/api/resort/${resortId}`);
      const data = await res.json();
      setSelectedResort(data);
      setSelectedResortId(resortId);
    } catch (err) {
      setError('Failed to load resort details');
    }
  };

  const handleBack = () => {
    setSelectedResortId(null);
    setSelectedResort(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">PowderRank</h1>
          <p className="app-subtitle">Historical Feb 7-14 Snowfall Rankings for North American Ski Resorts</p>
        </div>
      </header>
      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <LoadingProgress progress={progress} />
        ) : selectedResortId && selectedResort ? (
          <ResortDetail resort={selectedResort} onBack={handleBack} />
        ) : rankings ? (
          <RankingsList rankings={rankings} onSelect={handleSelectResort} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
