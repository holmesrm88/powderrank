class WeatherService {
  constructor(databaseService) {
    this.db = databaseService;
    this.inMemoryCache = {};
  }

  async fetchBatchWeather(resorts, year) {
    const lats = resorts.map(r => r.latitude).join(',');
    const lngs = resorts.map(r => r.longitude).join(',');
    const startDate = `${year}-02-07`;
    const endDate = `${year}-02-14`;

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lats}&longitude=${lngs}&start_date=${startDate}&end_date=${endDate}&daily=snowfall_sum,precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=America/Denver`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const results = {};

    if (resorts.length === 1) {
      // Single location: response is a single object
      results[resorts[0].id] = {
        dates: data.daily.time,
        snowfall: data.daily.snowfall_sum,
        precipitation: data.daily.precipitation_sum,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min
      };
    } else {
      // Multiple locations: response is an array
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

  async fetchAllHistoricalData(allResorts, onProgress) {
    const startYear = 2000;
    const endYear = 2024;
    const years = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);

    const allData = {}; // resortId -> { year -> data }
    for (const r of allResorts) allData[r.id] = {};

    const totalSteps = years.length * Math.ceil(allResorts.length / 10);
    let currentStep = 0;

    for (const year of years) {
      // Batch resorts into groups of 10
      for (let i = 0; i < allResorts.length; i += 10) {
        const batch = allResorts.slice(i, i + 10);
        currentStep++;

        // Check which resorts in batch need fetching
        const uncached = [];
        for (const resort of batch) {
          const cacheKey = `${resort.id}_${year}`;

          // Check in-memory first
          if (this.inMemoryCache[cacheKey]) {
            allData[resort.id][year] = this.inMemoryCache[cacheKey];
            continue;
          }

          // Check DB
          const dbCached = await this.db.getWeatherCache(resort.id, year);
          if (dbCached) {
            allData[resort.id][year] = dbCached;
            this.inMemoryCache[cacheKey] = dbCached;
            continue;
          }

          uncached.push(resort);
        }

        if (uncached.length > 0) {
          if (onProgress) {
            onProgress(currentStep, totalSteps, `Fetching ${year} data (batch ${Math.ceil((i + 1) / 10)}/${Math.ceil(allResorts.length / 10)})`);
          }

          try {
            const batchResults = await this.fetchBatchWeather(uncached, year);
            for (const [resortId, data] of Object.entries(batchResults)) {
              allData[resortId][year] = data;
              this.inMemoryCache[`${resortId}_${year}`] = data;
              await this.db.setWeatherCache(resortId, year, data);
            }
          } catch (err) {
            console.error(`Error fetching batch for year ${year}:`, err.message);
            // Fill with null data so we can continue
            for (const resort of uncached) {
              allData[resort.id][year] = null;
            }
          }

          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 100));
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
