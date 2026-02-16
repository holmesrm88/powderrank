const RankingService = require('../services/RankingService');

const rankingService = new RankingService();

function makeResort(id, name = 'Test Resort') {
  return { id, name, city: 'TestCity', state: 'TS', country: 'US', region: 'West', baseElevation: 8000, summitElevation: 11000 };
}

function makeWeatherYear(snowfallCmPerDay, days = 7) {
  return {
    dates: Array.from({ length: days }, (_, i) => `2020-02-${String(7 + i).padStart(2, '0')}`),
    snowfall: Array(days).fill(snowfallCmPerDay),
    precipitation: Array(days).fill(0),
    tempMax: Array(days).fill(0),
    tempMin: Array(days).fill(-5)
  };
}

describe('RankingService.calculateRankings', () => {
  test('converts cm to inches (divide by 2.54)', () => {
    const resorts = [makeResort('r1')];
    // 2.54 cm/day * 7 days = 17.78 cm total → 7.0 inches
    const weatherData = { r1: { 2020: makeWeatherYear(2.54) } };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].avgSnowfall).toBeCloseTo(7.0, 1);
  });

  test('averages snowfall across multiple years', () => {
    const resorts = [makeResort('r1')];
    const weatherData = {
      r1: {
        2020: makeWeatherYear(2.54),  // 7.0 inches
        2021: makeWeatherYear(5.08)   // 14.0 inches
      }
    };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].avgSnowfall).toBeCloseTo(10.5, 1);
  });

  test('consistency: % of years with >2" snowfall', () => {
    const resorts = [makeResort('r1')];
    // Year 1: 2.54 cm/day * 7 = 17.78cm = 7.0" (above threshold)
    // Year 2: 0.1 cm/day * 7 = 0.7cm = 0.28" (below threshold)
    // Year 3: 5.08 cm/day * 7 = 35.56cm = 14.0" (above threshold)
    const weatherData = {
      r1: {
        2020: makeWeatherYear(2.54),
        2021: makeWeatherYear(0.1),
        2022: makeWeatherYear(5.08)
      }
    };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].consistency).toBe(67); // 2/3 = 66.67 → rounds to 67
  });

  test('cluster bonus tiers', () => {
    const resorts = [makeResort('r1')];
    const weatherData = { r1: { 2020: makeWeatherYear(2.54) } };

    // 0 nearby → 0
    let results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].clusterBonus).toBe(0);

    // 1 nearby → 15
    results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2'] });
    expect(results[0].clusterBonus).toBe(15);

    // 2 nearby → 30
    results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2', 'r3'] });
    expect(results[0].clusterBonus).toBe(30);

    // 3 nearby → 45
    results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2', 'r3', 'r4'] });
    expect(results[0].clusterBonus).toBe(45);

    // 4 nearby → 55
    results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2', 'r3', 'r4', 'r5'] });
    expect(results[0].clusterBonus).toBe(55);

    // 5+ nearby → 65
    results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2', 'r3', 'r4', 'r5', 'r6'] });
    expect(results[0].clusterBonus).toBe(65);
  });

  test('composite score = snowfall(50%) + consistency(30%) + cluster(20%)', () => {
    const resorts = [makeResort('r1')];
    const weatherData = { r1: { 2020: makeWeatherYear(2.54) } };
    const results = rankingService.calculateRankings(weatherData, resorts, { r1: ['r2', 'r3'] });

    // Single resort → normalizedSnowfall = 100
    // consistency = 100 (1/1 years above threshold)
    // clusterBonus = 30 (2 nearby)
    // composite = 100*0.5 + 100*0.3 + 30*0.2 = 50 + 30 + 6 = 86
    expect(results[0].compositeScore).toBe(86);
  });

  test('normalization: highest resort gets normalizedSnowfall=100', () => {
    const resorts = [makeResort('r1', 'High Snow'), makeResort('r2', 'Low Snow')];
    const weatherData = {
      r1: { 2020: makeWeatherYear(5.08) },  // 14"
      r2: { 2020: makeWeatherYear(2.54) }   // 7"
    };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    const high = results.find(r => r.id === 'r1');
    const low = results.find(r => r.id === 'r2');
    expect(high.normalizedSnowfall).toBe(100);
    expect(low.normalizedSnowfall).toBeCloseTo(50, 0);
  });

  test('ranks assigned in descending composite score order', () => {
    const resorts = [makeResort('r1', 'A'), makeResort('r2', 'B')];
    const weatherData = {
      r1: { 2020: makeWeatherYear(5.08) },
      r2: { 2020: makeWeatherYear(2.54) }
    };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].rank).toBe(1);
    expect(results[1].rank).toBe(2);
    expect(results[0].compositeScore).toBeGreaterThanOrEqual(results[1].compositeScore);
  });

  test('best/worst year correctly identified', () => {
    const resorts = [makeResort('r1')];
    const weatherData = {
      r1: {
        2020: makeWeatherYear(1.0),   // low
        2021: makeWeatherYear(10.0),  // high
        2022: makeWeatherYear(5.0)    // mid
      }
    };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].bestYear.year).toBe(2021);
    expect(results[0].worstYear.year).toBe(2020);
  });

  test('edge case: resort with all null weather data', () => {
    const resorts = [makeResort('r1')];
    const weatherData = { r1: { 2020: null, 2021: null } };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].avgSnowfall).toBe(0);
    expect(results[0].consistency).toBe(0);
    expect(results[0].bestYear).toBeNull();
    expect(results[0].worstYear).toBeNull();
  });

  test('edge case: single resort normalization still works', () => {
    const resorts = [makeResort('r1')];
    const weatherData = { r1: { 2020: makeWeatherYear(2.54) } };
    const results = rankingService.calculateRankings(weatherData, resorts, {});
    expect(results[0].normalizedSnowfall).toBe(100);
    expect(results[0].rank).toBe(1);
  });
});
