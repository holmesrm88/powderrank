require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { resorts, nearbyResorts } = require('./data/resorts');
const DatabaseService = require('./services/DatabaseService');
const WeatherService = require('./services/WeatherService');
const RankingService = require('./services/RankingService');
const { generateWeeks, parseWeekDates } = require('./utils/weeks');

const app = express();

app.use(cors());
app.use(express.json());

// Services
const db = new DatabaseService(process.env.DATABASE_URL);
const weatherService = new WeatherService(db);
const rankingService = new RankingService();

const ALL_WEEKS = generateWeeks();
const DEFAULT_WEEK = '02-07';

// In-memory state — keyed by weekStart
const cachedRankings = new Map();
const fetchProgress = new Map();

async function init() {
  await db.initialize();

  // Load all already-cached weeks from DB
  const cachedWeekStarts = await db.getCachedWeekStarts();
  for (const weekStart of cachedWeekStarts) {
    const dbRankings = await db.getCachedRankings(weekStart);
    if (dbRankings) {
      cachedRankings.set(weekStart, dbRankings);
      console.log(`Loaded ${dbRankings.length} cached rankings for week ${weekStart}`);
    }
  }

  // Start background pre-fetch
  prefetchAllWeeks();
}

async function startFetch(weekStart) {
  const prog = fetchProgress.get(weekStart);
  if (prog && prog.inProgress) return;

  fetchProgress.set(weekStart, { inProgress: true, current: 0, total: 1, status: 'Starting data fetch...' });

  const { startMM, startDD, endMM, endDD } = parseWeekDates(weekStart);

  try {
    const weatherData = await weatherService.fetchAllHistoricalData(resorts, startMM, startDD, endMM, endDD, (current, total, status) => {
      fetchProgress.set(weekStart, { inProgress: true, current, total, status });
    });

    fetchProgress.set(weekStart, { inProgress: true, current: 1, total: 1, status: 'Calculating rankings...' });
    const rankings = rankingService.calculateRankings(weatherData, resorts, nearbyResorts);
    cachedRankings.set(weekStart, rankings);

    // Save to DB
    for (const resort of rankings) {
      await db.saveResortRanking(resort.id, weekStart, {
        rank: resort.rank,
        avgSnowfall: resort.avgSnowfall,
        consistency: resort.consistency,
        nearbyCount: resort.nearbyCount,
        clusterBonus: resort.clusterBonus,
        compositeScore: resort.compositeScore,
        normalizedSnowfall: resort.normalizedSnowfall,
        bestYear: resort.bestYear,
        worstYear: resort.worstYear,
        name: resort.name,
        city: resort.city,
        state: resort.state,
        country: resort.country,
        region: resort.region,
        baseElevation: resort.baseElevation,
        summitElevation: resort.summitElevation,
        nearbyResorts: resort.nearbyResorts
      }, resort.yearlyData);
    }

    console.log(`Rankings calculated for ${rankings.length} resorts (week ${weekStart})`);
  } catch (err) {
    console.error(`Error fetching data for week ${weekStart}:`, err);
    fetchProgress.set(weekStart, { inProgress: false, current: 0, total: 0, status: `Error: ${err.message}` });
    return;
  }

  fetchProgress.set(weekStart, { inProgress: false, current: 0, total: 0, status: '' });
}

async function prefetchAllWeeks() {
  // Fetch default week first so UI is usable immediately
  if (!cachedRankings.has(DEFAULT_WEEK)) {
    console.log(`Pre-fetching default week ${DEFAULT_WEEK}...`);
    await startFetch(DEFAULT_WEEK);
  }

  // Then fetch remaining weeks sequentially
  for (const { week } of ALL_WEEKS) {
    if (cachedRankings.has(week)) continue;
    console.log(`Background pre-fetch: week ${week}...`);
    await startFetch(week);
  }

  console.log('Background pre-fetch complete for all weeks.');
}

// Routes
app.get('/api/weeks', (req, res) => {
  const weeks = ALL_WEEKS.map(w => ({
    week: w.week,
    label: w.label,
    cached: cachedRankings.has(w.week)
  }));
  res.json(weeks);
});

app.get('/api/rankings', (req, res) => {
  const weekStart = req.query.week || DEFAULT_WEEK;
  const rankings = cachedRankings.get(weekStart);

  if (rankings) {
    const summary = rankings.map(r => ({
      id: r.id,
      rank: r.rank,
      name: r.name,
      city: r.city,
      state: r.state,
      country: r.country,
      region: r.region,
      avgSnowfall: r.avgSnowfall,
      consistency: r.consistency,
      nearbyCount: r.nearbyCount,
      clusterBonus: r.clusterBonus,
      compositeScore: r.compositeScore,
      normalizedSnowfall: r.normalizedSnowfall,
      bestYear: r.bestYear,
      worstYear: r.worstYear
    }));
    return res.json({ rankings: summary, loading: false });
  }

  // Start fetch if not already running
  const prog = fetchProgress.get(weekStart);
  if (!prog || !prog.inProgress) {
    startFetch(weekStart);
  }

  res.json({ rankings: null, loading: true });
});

app.get('/api/rankings/progress', (req, res) => {
  const weekStart = req.query.week || DEFAULT_WEEK;
  const prog = fetchProgress.get(weekStart) || { inProgress: false, current: 0, total: 0, status: '' };
  res.json(prog);
});

app.get('/api/resort/:id', (req, res) => {
  const weekStart = req.query.week || DEFAULT_WEEK;
  const rankings = cachedRankings.get(weekStart);

  if (!rankings) {
    return res.status(404).json({ error: 'Rankings not yet available for this week' });
  }

  const resort = rankings.find(r => r.id === req.params.id);
  if (!resort) {
    return res.status(404).json({ error: 'Resort not found' });
  }

  res.json(resort);
});

// Serve static files in production
const staticDir = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

module.exports = { app, init, startFetch, prefetchAllWeeks, cachedRankings, fetchProgress, ALL_WEEKS, DEFAULT_WEEK };
