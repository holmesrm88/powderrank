const request = require('supertest');
const express = require('express');

// Build a mini app that mirrors the routes from app.js but with injectable state
function createTestApp({ cachedRankings = new Map(), fetchProgress = new Map(), ALL_WEEKS, DEFAULT_WEEK = '02-07' } = {}) {
  const app = express();

  if (!ALL_WEEKS) {
    ALL_WEEKS = [
      { week: '02-07', label: 'Feb 7-14', endMM: '02', endDD: '14' },
      { week: '02-14', label: 'Feb 14-21', endMM: '02', endDD: '21' }
    ];
  }

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

  return app;
}

const mockRankings = [
  {
    id: 'alta',
    rank: 1,
    name: 'Alta',
    city: 'Alta',
    state: 'UT',
    country: 'US',
    region: 'Wasatch',
    avgSnowfall: 15.2,
    consistency: 85,
    nearbyCount: 3,
    clusterBonus: 45,
    compositeScore: 92.1,
    normalizedSnowfall: 100,
    bestYear: { year: 2021, snowfall: 25.0 },
    worstYear: { year: 2020, snowfall: 5.0 },
    yearlyData: []
  },
  {
    id: 'snowbird',
    rank: 2,
    name: 'Snowbird',
    city: 'Snowbird',
    state: 'UT',
    country: 'US',
    region: 'Wasatch',
    avgSnowfall: 12.0,
    consistency: 75,
    nearbyCount: 2,
    clusterBonus: 30,
    compositeScore: 80.5,
    normalizedSnowfall: 78.9,
    bestYear: { year: 2021, snowfall: 20.0 },
    worstYear: { year: 2022, snowfall: 4.0 },
    yearlyData: []
  }
];

describe('GET /api/weeks', () => {
  test('returns 200 with array of week objects', async () => {
    const cached = new Map();
    cached.set('02-07', mockRankings);
    const app = createTestApp({ cachedRankings: cached });

    const res = await request(app).get('/api/weeks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('week');
    expect(res.body[0]).toHaveProperty('label');
    expect(res.body[0]).toHaveProperty('cached');
    // First week is cached, second is not
    expect(res.body[0].cached).toBe(true);
    expect(res.body[1].cached).toBe(false);
  });
});

describe('GET /api/rankings', () => {
  test('with cached data → rankings array and loading=false', async () => {
    const cached = new Map();
    cached.set('02-07', mockRankings);
    const app = createTestApp({ cachedRankings: cached });

    const res = await request(app).get('/api/rankings');
    expect(res.status).toBe(200);
    expect(res.body.loading).toBe(false);
    expect(Array.isArray(res.body.rankings)).toBe(true);
    expect(res.body.rankings.length).toBe(2);
    expect(res.body.rankings[0].id).toBe('alta');
  });

  test('without cache → rankings=null and loading=true', async () => {
    const app = createTestApp();

    const res = await request(app).get('/api/rankings');
    expect(res.status).toBe(200);
    expect(res.body.rankings).toBeNull();
    expect(res.body.loading).toBe(true);
  });

  test('with week query param → returns correct week data', async () => {
    const cached = new Map();
    cached.set('02-14', mockRankings);
    const app = createTestApp({ cachedRankings: cached });

    const res = await request(app).get('/api/rankings?week=02-14');
    expect(res.status).toBe(200);
    expect(res.body.loading).toBe(false);
    expect(res.body.rankings.length).toBe(2);
  });
});

describe('GET /api/rankings/progress', () => {
  test('returns progress object', async () => {
    const progress = new Map();
    progress.set('02-07', { inProgress: true, current: 5, total: 25, status: 'Fetching...' });
    const app = createTestApp({ fetchProgress: progress });

    const res = await request(app).get('/api/rankings/progress');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ inProgress: true, current: 5, total: 25, status: 'Fetching...' });
  });

  test('returns default when no progress exists', async () => {
    const app = createTestApp();

    const res = await request(app).get('/api/rankings/progress');
    expect(res.status).toBe(200);
    expect(res.body.inProgress).toBe(false);
  });
});

describe('GET /api/resort/:id', () => {
  test('with cached data → 200 and full resort object', async () => {
    const cached = new Map();
    cached.set('02-07', mockRankings);
    const app = createTestApp({ cachedRankings: cached });

    const res = await request(app).get('/api/resort/alta');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('alta');
    expect(res.body.name).toBe('Alta');
    expect(res.body.yearlyData).toBeDefined();
  });

  test('nonexistent resort → 404', async () => {
    const cached = new Map();
    cached.set('02-07', mockRankings);
    const app = createTestApp({ cachedRankings: cached });

    const res = await request(app).get('/api/resort/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Resort not found');
  });

  test('without cached week → 404', async () => {
    const app = createTestApp();

    const res = await request(app).get('/api/resort/alta');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Rankings not yet available for this week');
  });
});
