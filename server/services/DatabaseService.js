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
          week_start TEXT NOT NULL DEFAULT '02-07',
          snowfall_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(resort_id, year, week_start)
        )
      `);
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS resort_rankings (
          resort_id TEXT NOT NULL,
          week_start TEXT NOT NULL DEFAULT '02-07',
          scores JSONB NOT NULL,
          yearly_data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(resort_id, week_start)
        )
      `);

      // Migrate existing tables: add week_start column if missing
      await this._migrateAddWeekStart();

      console.log('Database tables initialized');
    } catch (err) {
      console.warn('Database initialization failed, running without persistence:', err.message);
      this.available = false;
    }
  }

  async _migrateAddWeekStart() {
    try {
      // Check if weather_cache has week_start column
      const wcCheck = await this.pool.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'weather_cache' AND column_name = 'week_start'
      `);
      if (wcCheck.rows.length === 0) {
        console.log('Migrating weather_cache: adding week_start column...');
        await this.pool.query(`ALTER TABLE weather_cache ADD COLUMN week_start TEXT NOT NULL DEFAULT '02-07'`);
        // Drop old unique constraint and add new one
        await this.pool.query(`ALTER TABLE weather_cache DROP CONSTRAINT IF EXISTS weather_cache_resort_id_year_key`);
        await this.pool.query(`ALTER TABLE weather_cache ADD CONSTRAINT weather_cache_resort_id_year_week_start_key UNIQUE(resort_id, year, week_start)`);
      }

      // Check if resort_rankings has week_start column
      const rrCheck = await this.pool.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'resort_rankings' AND column_name = 'week_start'
      `);
      if (rrCheck.rows.length === 0) {
        console.log('Migrating resort_rankings: adding week_start column...');
        await this.pool.query(`ALTER TABLE resort_rankings ADD COLUMN week_start TEXT NOT NULL DEFAULT '02-07'`);
        // Drop old unique constraint and add new one
        await this.pool.query(`ALTER TABLE resort_rankings DROP CONSTRAINT IF EXISTS resort_rankings_resort_id_key`);
        await this.pool.query(`ALTER TABLE resort_rankings ADD CONSTRAINT resort_rankings_resort_id_week_start_key UNIQUE(resort_id, week_start)`);
      }
    } catch (err) {
      console.warn('Migration check failed (may be fine on fresh DB):', err.message);
    }
  }

  async getWeatherCache(resortId, year, weekStart = '02-07') {
    if (!this.available) return null;
    try {
      const result = await this.pool.query(
        'SELECT snowfall_data FROM weather_cache WHERE resort_id = $1 AND year = $2 AND week_start = $3',
        [resortId, year, weekStart]
      );
      return result.rows[0]?.snowfall_data || null;
    } catch {
      return null;
    }
  }

  async setWeatherCache(resortId, year, weekStart, data) {
    if (!this.available) return;
    try {
      await this.pool.query(
        `INSERT INTO weather_cache (resort_id, year, week_start, snowfall_data)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (resort_id, year, week_start) DO UPDATE SET snowfall_data = $4`,
        [resortId, year, weekStart, JSON.stringify(data)]
      );
    } catch (err) {
      console.warn('Failed to cache weather data:', err.message);
    }
  }

  async getCachedRankings(weekStart = '02-07') {
    if (!this.available) return null;
    try {
      const result = await this.pool.query(
        `SELECT * FROM resort_rankings WHERE week_start = $1 ORDER BY (scores->>'compositeScore')::float DESC`,
        [weekStart]
      );
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

  async saveResortRanking(resortId, weekStart, scores, yearlyData) {
    if (!this.available) return;
    try {
      await this.pool.query(
        `INSERT INTO resort_rankings (resort_id, week_start, scores, yearly_data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (resort_id, week_start) DO UPDATE SET scores = $3, yearly_data = $4, updated_at = NOW()`,
        [resortId, weekStart, JSON.stringify(scores), JSON.stringify(yearlyData)]
      );
    } catch (err) {
      console.warn('Failed to save ranking:', err.message);
    }
  }

  async getCachedWeekStarts() {
    if (!this.available) return [];
    try {
      const result = await this.pool.query(
        'SELECT DISTINCT week_start FROM resort_rankings'
      );
      return result.rows.map(row => row.week_start);
    } catch {
      return [];
    }
  }

  async getAllRankings(weekStart = '02-07') {
    return this.getCachedRankings(weekStart);
  }
}

module.exports = DatabaseService;
