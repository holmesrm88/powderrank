const WeatherService = require('../services/WeatherService');

// Stub DatabaseService
function makeMockDb() {
  return {
    getWeatherCache: jest.fn().mockResolvedValue(null),
    setWeatherCache: jest.fn().mockResolvedValue(undefined)
  };
}

function makeApiResponse(resortCount) {
  const daily = {
    time: ['2020-02-07', '2020-02-08'],
    snowfall_sum: [5.0, 3.0],
    precipitation_sum: [10.0, 8.0],
    temperature_2m_max: [2.0, 1.0],
    temperature_2m_min: [-3.0, -5.0]
  };
  if (resortCount === 1) {
    return { daily };
  }
  return Array.from({ length: resortCount }, () => ({ daily: { ...daily } }));
}

describe('WeatherService.fetchBatchWeather', () => {
  let ws, mockDb;

  beforeEach(() => {
    mockDb = makeMockDb();
    ws = new WeatherService(mockDb);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('single resort: correct response shape', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => makeApiResponse(1)
    });

    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];
    const result = await ws.fetchBatchWeather(resorts, 2020, '02', '07', '02', '14');

    expect(result.r1).toBeDefined();
    expect(result.r1.dates).toEqual(['2020-02-07', '2020-02-08']);
    expect(result.r1.snowfall).toEqual([5.0, 3.0]);
    expect(result.r1.tempMax).toEqual([2.0, 1.0]);
    expect(result.r1.tempMin).toEqual([-3.0, -5.0]);
  });

  test('multiple resorts: each parsed correctly', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => makeApiResponse(2)
    });

    const resorts = [
      { id: 'r1', latitude: 40.0, longitude: -111.0 },
      { id: 'r2', latitude: 41.0, longitude: -112.0 }
    ];
    const result = await ws.fetchBatchWeather(resorts, 2020, '02', '07', '02', '14');

    expect(result.r1).toBeDefined();
    expect(result.r2).toBeDefined();
    expect(result.r1.snowfall).toEqual([5.0, 3.0]);
    expect(result.r2.snowfall).toEqual([5.0, 3.0]);
  });

  test('year-boundary URL construction: 12-27 to 01-03 crosses year', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => makeApiResponse(1)
    });

    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];
    await ws.fetchBatchWeather(resorts, 2020, '12', '27', '01', '03');

    const url = global.fetch.mock.calls[0][0];
    expect(url).toContain('start_date=2020-12-27');
    expect(url).toContain('end_date=2021-01-03');
  });

  test('normal URL construction: both dates use same year', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => makeApiResponse(1)
    });

    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];
    await ws.fetchBatchWeather(resorts, 2020, '02', '07', '02', '14');

    const url = global.fetch.mock.calls[0][0];
    expect(url).toContain('start_date=2020-02-07');
    expect(url).toContain('end_date=2020-02-14');
  });

  test('non-200 response throws error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];
    await expect(ws.fetchBatchWeather(resorts, 2020, '02', '07', '02', '14'))
      .rejects.toThrow('Open-Meteo API error: 500 Internal Server Error');
  });
});

describe('WeatherService.fetchAllHistoricalData', () => {
  let ws, mockDb;

  beforeEach(() => {
    mockDb = makeMockDb();
    ws = new WeatherService(mockDb);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => makeApiResponse(1)
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('calls onProgress callback', async () => {
    const onProgress = jest.fn();
    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];

    await ws.fetchAllHistoricalData(resorts, '02', '07', '02', '14', onProgress);

    expect(onProgress).toHaveBeenCalled();
    const [current, total, status] = onProgress.mock.calls[0];
    expect(current).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
    expect(typeof status).toBe('string');
  }, 10000);

  test('uses in-memory cache on second call (no duplicate fetch)', async () => {
    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];

    await ws.fetchAllHistoricalData(resorts, '02', '07', '02', '14', jest.fn());
    const firstCallCount = global.fetch.mock.calls.length;

    // Second call — should use in-memory cache, no new fetches
    await ws.fetchAllHistoricalData(resorts, '02', '07', '02', '14', jest.fn());
    expect(global.fetch.mock.calls.length).toBe(firstCallCount);
  }, 10000);

  test('DB cache hit skips API call', async () => {
    const cachedData = {
      dates: ['2020-02-07'],
      snowfall: [5.0],
      precipitation: [10.0],
      tempMax: [2.0],
      tempMin: [-3.0]
    };
    mockDb.getWeatherCache.mockResolvedValue(cachedData);

    const resorts = [{ id: 'r1', latitude: 40.0, longitude: -111.0 }];
    await ws.fetchAllHistoricalData(resorts, '02', '07', '02', '14', jest.fn());

    // fetch should never have been called since everything was in DB cache
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
