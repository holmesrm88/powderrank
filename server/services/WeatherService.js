class WeatherService {
  constructor(databaseService, { requestDelay = 1200, retryDelay = 60000 } = {}) {
    this.db = databaseService;
    this.inMemoryCache = {};
    this.requestDelay = requestDelay;
    this.retryDelay = retryDelay;
  }

  async fetchBatchWeather(resorts, year, startMM, startDD, endMM, endDD) {
    const lats = resorts.map(r => r.latitude).join(',');
    const lngs = resorts.map(r => r.longitude).join(',');
    const startDate = `${year}-${startMM}-${startDD}`;
    const endYear = parseInt(endMM) < parseInt(startMM) ? year + 1 : year;
    const endDate = `${endYear}-${endMM}-${endDD}`;

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lats}&longitude=${lngs}&start_date=${startDate}&end_date=${endDate}&daily=snowfall_sum,precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const results = {};

    if (resorts.length === 1) {
      results[resorts[0].id] = {
        dates: data.daily.time,
        snowfall: data.daily.snowfall_sum,
        precipitation: data.daily.precipitation_sum,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min
      };
    } else {
      const locations = Array.isArray(data) ? data : [data];
      for (let i = 0; i < resorts.length; i++) {
        const loc = locations[i];
        if (loc && loc.daily) {
          results[resorts[i].id] = {
            dates: loc.daily.time,
            snowfall: loc.daily.snowfall_sum,
            precipitation: loc.daily.precipitation_sum,
            tempMax: loc.daily.temperature_2m_max,
            tempMin: loc.daily.temperature_2m_min
          };
        }
      }
    }

    return results;
  }

  async fetchAllHistoricalData(allResorts, startMM, startDD, endMM, endDD, onProgress) {
    const startYear = 2000;
    const endYear = 2024;
    const years = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);

    const weekStart = `${startMM}-${startDD}`;
    const allData = {};
    for (const r of allResorts) allData[r.id] = {};

    const BATCH_SIZE = 5;
    const totalSteps = years.length * Math.ceil(allResorts.length / BATCH_SIZE);
    let currentStep = 0;

    for (const year of years) {
      for (let i = 0; i < allResorts.length; i += BATCH_SIZE) {
        const batch = allResorts.slice(i, i + BATCH_SIZE);
        currentStep++;

        const uncached = [];
        for (const resort of batch) {
          const cacheKey = `${resort.id}_${year}_${weekStart}`;

          if (this.inMemoryCache[cacheKey]) {
            allData[resort.id][year] = this.inMemoryCache[cacheKey];
            continue;
          }

          const dbCached = await this.db.getWeatherCache(resort.id, year, weekStart);
          if (dbCached) {
            allData[resort.id][year] = dbCached;
            this.inMemoryCache[cacheKey] = dbCached;
            continue;
          }

          uncached.push(resort);
        }

        if (uncached.length > 0) {
          if (onProgress) {
            onProgress(currentStep, totalSteps, `Fetching ${year} data (batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(allResorts.length / BATCH_SIZE)})`);
          }

          try {
            const batchResults = await this.fetchBatchWeather(uncached, year, startMM, startDD, endMM, endDD);
            for (const [resortId, data] of Object.entries(batchResults)) {
              allData[resortId][year] = data;
              this.inMemoryCache[`${resortId}_${year}_${weekStart}`] = data;
              await this.db.setWeatherCache(resortId, year, weekStart, data);
            }
          } catch (err) {
            if (err.message.includes('429')) {
              // Rate limited — wait and retry once
              console.warn(`Rate limited on year ${year} batch, retrying in ${this.retryDelay / 1000}s...`);
              await new Promise(resolve => setTimeout(resolve, this.retryDelay));
              try {
                const batchResults = await this.fetchBatchWeather(uncached, year, startMM, startDD, endMM, endDD);
                for (const [resortId, data] of Object.entries(batchResults)) {
                  allData[resortId][year] = data;
                  this.inMemoryCache[`${resortId}_${year}_${weekStart}`] = data;
                  await this.db.setWeatherCache(resortId, year, weekStart, data);
                }
              } catch (retryErr) {
                console.error(`Retry failed for year ${year}:`, retryErr.message);
                for (const resort of uncached) {
                  allData[resort.id][year] = null;
                }
              }
            } else {
              console.error(`Error fetching batch for year ${year}:`, err.message);
              for (const resort of uncached) {
                allData[resort.id][year] = null;
              }
            }
          }

          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        } else {
          if (onProgress) {
            onProgress(currentStep, totalSteps, `Year ${year} loaded from cache`);
          }
        }
      }
    }

    return allData;
  }
}

module.exports = WeatherService;
