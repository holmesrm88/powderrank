import { useState, useEffect, useCallback, useRef } from 'react';
import RankingsList from './components/RankingsList';
import ResortDetail from './components/ResortDetail';
import LoadingProgress from './components/LoadingProgress';

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

function App() {
  const [rankings, setRankings] = useState(null);
  const [selectedResortId, setSelectedResortId] = useState(null);
  const [selectedResort, setSelectedResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [error, setError] = useState(null);
  const [week, setWeek] = useState('02-07');
  const [cachedWeeks, setCachedWeeks] = useState([]);
  const pollRef = useRef(null);

  const fetchWeeksList = useCallback(async () => {
    try {
      const res = await fetch('/api/weeks');
      const data = await res.json();
      setCachedWeeks(data);
    } catch {
      // Non-critical
    }
  }, []);

  const fetchRankings = useCallback(async (weekStart) => {
    // Clear any existing poll
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }

    try {
      const res = await fetch(`/api/rankings?week=${weekStart}`);
      const data = await res.json();

      if (data.rankings) {
        setRankings(data.rankings);
        setLoading(false);
      } else if (data.loading) {
        setLoading(true);
        const pollProgress = async () => {
          try {
            const progRes = await fetch(`/api/rankings/progress?week=${weekStart}`);
            const progData = await progRes.json();
            setProgress(progData);

            if (progData.inProgress) {
              pollRef.current = setTimeout(pollProgress, 2000);
            } else {
              const res2 = await fetch(`/api/rankings?week=${weekStart}`);
              const data2 = await res2.json();
              if (data2.rankings) {
                setRankings(data2.rankings);
                setLoading(false);
              }
              fetchWeeksList();
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
  }, [fetchWeeksList]);

  useEffect(() => {
    fetchWeeksList();
    fetchRankings(week);
  }, []);

  // Periodically refresh cached weeks list while any are uncached
  useEffect(() => {
    const hasUncached = cachedWeeks.some(w => !w.cached);
    if (!hasUncached) return;
    const interval = setInterval(fetchWeeksList, 10000);
    return () => clearInterval(interval);
  }, [cachedWeeks, fetchWeeksList]);

  const handleWeekChange = (newWeek) => {
    setWeek(newWeek);
    setSelectedResortId(null);
    setSelectedResort(null);
    setError(null);
    setRankings(null);
    setLoading(true);
    fetchRankings(newWeek);
  };

  const handleSelectResort = async (resortId) => {
    try {
      const res = await fetch(`/api/resort/${resortId}?week=${week}`);
      const data = await res.json();
      setSelectedResort(data);
      setSelectedResortId(resortId);
      window.history.pushState({ resortId }, '', `#${resortId}`);
    } catch (err) {
      setError('Failed to load resort details');
    }
  };

  const handleBack = () => {
    setSelectedResortId(null);
    setSelectedResort(null);
    window.history.pushState(null, '', '/');
  };

  useEffect(() => {
    const onPopState = () => {
      setSelectedResortId(null);
      setSelectedResort(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const weekLabel = getWeekLabel(week);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">PowderRank</h1>
          <p className="app-subtitle">Historical {weekLabel} Snowfall Rankings for North American Ski Resorts</p>
        </div>
      </header>
      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <LoadingProgress progress={progress} />
        ) : selectedResortId && selectedResort ? (
          <ResortDetail resort={selectedResort} onBack={handleBack} week={week} />
        ) : rankings ? (
          <RankingsList
            rankings={rankings}
            onSelect={handleSelectResort}
            week={week}
            onWeekChange={handleWeekChange}
            cachedWeeks={cachedWeeks}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
