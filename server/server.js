require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { resorts, nearbyResorts } = require('./data/resorts');
const DatabaseService = require('./services/DatabaseService');
const WeatherService = require('./services/WeatherService');
const RankingService = require('./services/RankingService');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Services
const db = new DatabaseService(process.env.DATABASE_URL);
const weatherService = new WeatherService(db);
const rankingService = new RankingService();

// In-memory state
let cachedRankings = null;
let fetchProgress = { inProgress: false, current: 0, total: 0, status: '' };

async function init() {
  await db.initialize();

  // Try to load cached rankings from DB
  const dbRankings = await db.getCachedRankings();
  if (dbRankings) {
    cachedRankings = dbRankings;
    console.log(`Loaded ${cachedRankings.length} cached rankings from database`);
  }
}

async function startFetch() {
  if (fetchProgress.inProgress) return;

  fetchProgress = { inProgress: true, current: 0, total: 1, status: 'Starting data fetch...' };

  try {
    const weatherData = await weatherService.fetchAllHistoricalData(resorts, (current, total, status) => {
      fetchProgress = { inProgress: true, current, total, status };
    });

    fetchProgress.status = 'Calculating rankings...';
    cachedRankings = rankingService.calculateRankings(weatherData, resorts, nearbyResorts);

    // Save to DB
    for (const resort of cachedRankings) {
      await db.saveResortRanking(resort.id, {
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

    console.log(`Rankings calculated for ${cachedRankings.length} resorts`);
  } catch (err) {
    console.error('Error fetching data:', err);
    fetchProgress.status = `Error: ${err.message}`;
  } finally {
    fetchProgress.inProgress = false;
  }
}

// Routes
app.get('/api/rankings', (req, res) => {
  if (cachedRankings) {
    // Return rankings without full yearlyData for list view
    const summary = cachedRankings.map(r => ({
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
  if (!fetchProgress.inProgress) {
    startFetch();
  }

  res.json({ rankings: null, loading: true });
});

app.get('/api/rankings/progress', (req, res) => {
  res.json(fetchProgress);
});

app.get('/api/resort/:id', (req, res) => {
  if (!cachedRankings) {
    return res.status(404).json({ error: 'Rankings not yet available' });
  }

  const resort = cachedRankings.find(r => r.id === req.params.id);
  if (!resort) {
    return res.status(404).json({ error: 'Resort not found' });
  }

  res.json(resort);
});

// Serve static files in production
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`PowderRank server running on port ${PORT}`);
  });
});
