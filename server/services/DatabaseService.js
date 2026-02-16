const { Pool } = require('pg');

class DatabaseService {
  constructor(databaseUrl) {
    this.pool = null;
    this.available = false;
    if (databaseUrl) {
      try {
        this.pool = new Pool({ connectionString: databaseUrl });
        this.available = true;
      } catch (err) {
        console.warn('Database not available, running without persistence:', err.message);
      }
    }
  }

  async initialize() {
    if (!this.available) return;
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS weather_cache (
          resort_id TEXT NOT NULL,
          year INTEGER NOT NULL,
          snowfall_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(resort_id, year)
        )
      `);
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS resort_rankings (
          resort_id TEXT UNIQUE NOT NULL,
          scores JSONB NOT NULL,
          yearly_data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('Database tables initialized');
    } catch (err) {
      console.warn('Database initialization failed, running without persistence:', err.message);
      this.available = false;
    }
  }

  async getWeatherCache(resortId, year) {
    if (!this.available) return null;
    try {
      const result = await this.pool.query(
        'SELECT snowfall_data FROM weather_cache WHERE resort_id = $1 AND year = $2',
        [resortId, year]
      );
      return result.rows[0]?.snowfall_data || null;
    } catch {
      return null;
    }
  }

  async setWeatherCache(resortId, year, data) {
    if (!this.available) return;
    try {
      await this.pool.query(
        `INSERT INTO weather_cache (resort_id, year, snowfall_data)
         VALUES ($1, $2, $3)
         ON CONFLICT (resort_id, year) DO UPDATE SET snowfall_data = $3`,
        [resortId, year, JSON.stringify(data)]
      );
    } catch (err) {
      console.warn('Failed to cache weather data:', err.message);
    }
  }

  async getCachedRankings() {
    if (!this.available) return null;
    try {
      const result = await this.pool.query('SELECT * FROM resort_rankings ORDER BY (scores->>\'compositeScore\')::float DESC');
      if (result.rows.length === 0) return null;
      return result.rows.map(row => ({
        id: row.resort_id,
        ...row.scores,
        yearlyData: row.yearly_data
      }));
    } catch {
      return null;
    }
  }

  async saveResortRanking(resortId, scores, yearlyData) {
    if (!this.available) return;
    try {
      await this.pool.query(
        `INSERT INTO resort_rankings (resort_id, scores, yearly_data, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (resort_id) DO UPDATE SET scores = $2, yearly_data = $3, updated_at = NOW()`,
        [resortId, JSON.stringify(scores), JSON.stringify(yearlyData)]
      );
    } catch (err) {
      console.warn('Failed to save ranking:', err.message);
    }
  }

  async getAllRankings() {
    return this.getCachedRankings();
  }
}

module.exports = DatabaseService;
