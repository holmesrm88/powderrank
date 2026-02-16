class RankingService {
  calculateRankings(weatherData, resorts, nearbyResorts) {
    const resortScores = [];

    for (const resort of resorts) {
      const yearlyData = [];
      let totalSnowfall = 0;
      let yearsWithData = 0;
      let yearsAboveThreshold = 0;

      const years = Object.keys(weatherData[resort.id] || {}).sort();

      for (const year of years) {
        const data = weatherData[resort.id][year];
        if (!data || !data.snowfall) continue;

        // Open-Meteo returns snowfall in cm, convert to inches
        const weekSnowfall = data.snowfall.reduce((sum, val) => sum + (val || 0), 0) / 2.54;
        const avgTempMax = data.tempMax
          ? data.tempMax.reduce((s, v) => s + (v || 0), 0) / data.tempMax.length
          : null;
        const avgTempMin = data.tempMin
          ? data.tempMin.reduce((s, v) => s + (v || 0), 0) / data.tempMin.length
          : null;

        yearlyData.push({
          year: parseInt(year),
          snowfall: Math.round(weekSnowfall * 10) / 10,
          avgTempMax: avgTempMax !== null ? Math.round(avgTempMax * 9 / 5 + 32) : null,
          avgTempMin: avgTempMin !== null ? Math.round(avgTempMin * 9 / 5 + 32) : null,
          dailySnowfall: data.snowfall.map(s => Math.round((s || 0) / 2.54 * 10) / 10),
          dates: data.dates
        });

        totalSnowfall += weekSnowfall;
        yearsWithData++;
        if (weekSnowfall > 2) yearsAboveThreshold++;
      }

      const avgSnowfall = yearsWithData > 0 ? totalSnowfall / yearsWithData : 0;
      const consistency = yearsWithData > 0 ? (yearsAboveThreshold / yearsWithData) * 100 : 0;

      const nearby = nearbyResorts[resort.id] || [];
      const nearbyCount = nearby.length;
      let clusterBonus = 0;
      if (nearbyCount >= 5) clusterBonus = 65;
      else if (nearbyCount === 4) clusterBonus = 55;
      else if (nearbyCount === 3) clusterBonus = 45;
      else if (nearbyCount === 2) clusterBonus = 30;
      else if (nearbyCount === 1) clusterBonus = 15;

      // Find best and worst years
      const sortedYears = [...yearlyData].sort((a, b) => b.snowfall - a.snowfall);
      const bestYear = sortedYears[0] || null;
      const worstYear = sortedYears[sortedYears.length - 1] || null;

      resortScores.push({
        ...resort,
        avgSnowfall: Math.round(avgSnowfall * 10) / 10,
        consistency: Math.round(consistency),
        nearbyCount,
        nearbyResorts: nearby,
        clusterBonus,
        bestYear: bestYear ? { year: bestYear.year, snowfall: bestYear.snowfall } : null,
        worstYear: worstYear ? { year: worstYear.year, snowfall: worstYear.snowfall } : null,
        yearlyData
      });
    }

    // Normalize snowfall to 0-100
    const maxSnowfall = Math.max(...resortScores.map(r => r.avgSnowfall), 1);

    for (const resort of resortScores) {
      const normalizedSnowfall = (resort.avgSnowfall / maxSnowfall) * 100;
      resort.normalizedSnowfall = Math.round(normalizedSnowfall * 10) / 10;
      resort.compositeScore = Math.round(
        ((normalizedSnowfall * 0.5) + (resort.consistency * 0.3) + (resort.clusterBonus * 0.2))
      * 10) / 10;
    }

    resortScores.sort((a, b) => b.compositeScore - a.compositeScore);

    // Assign ranks
    resortScores.forEach((resort, i) => {
      resort.rank = i + 1;
    });

    return resortScores;
  }
}

module.exports = RankingService;
