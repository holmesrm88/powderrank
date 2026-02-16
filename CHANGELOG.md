# Changelog

## 1.1.0 — 2026-02-16

### Added
- Week picker dropdown with ~23 preset weeks (Nov 1 through Apr 5)
- Each week's data fetched and cached independently in PostgreSQL
- `/api/weeks` endpoint returning all weeks with cached/uncached status
- Background pre-fetch on startup: fetches default week first, then remaining weeks sequentially
- Client polls cached weeks list and updates dropdown labels in real time
- Dockerized deployment: multi-stage Dockerfile and docker-compose.yml with Postgres
- Server test suite (Jest + supertest): 37 tests across 4 suites
  - `weeks.test.js` — week generation and year-boundary date handling
  - `RankingService.test.js` — scoring, normalization, ranking, and edge cases
  - `WeatherService.test.js` — mocked fetch, URL construction, caching layers
  - `routes.test.js` — API integration tests for all endpoints

### Changed
- Server in-memory state (`cachedRankings`, `fetchProgress`) converted from single values to Maps keyed by week
- All API endpoints (`/api/rankings`, `/api/rankings/progress`, `/api/resort/:id`) accept `?week=MM-DD` query param
- DB schema: `weather_cache` and `resort_rankings` tables gain `week_start` column (with ALTER TABLE migration for existing data)
- `WeatherService.fetchBatchWeather` and `fetchAllHistoricalData` parameterized for arbitrary date ranges
- Resort detail labels, chart title, and rental links update dynamically based on selected week
- Static file serving switches between dev and production paths based on `NODE_ENV`
- Refactored `server.js` into `app.js` (Express app + logic) and `server.js` (entry point) for testability
- Extracted week utilities (`generateWeeks`, `getWeekEnd`, `parseWeekDates`) into `server/utils/weeks.js`

### Fixed
- Year-boundary bug: weeks crossing Dec→Jan (e.g. Dec 27-Jan 3) now correctly use `year + 1` for the end date

## 1.0.0 — 2026-02-15

### Added
- Initial release with 76 North American ski resorts across 12 regions
- Composite scoring algorithm: avg snowfall (50%), consistency (30%), cluster bonus (20%)
- 25 years of historical weather data (2000-2024) via Open-Meteo Archive API
- Batch API fetching (10 resorts per request) with progress tracking
- Resort detail view with SVG bar chart of yearly snowfall
- Nearby resorts computation using Haversine distance (120mi / ~2hr radius)
- Region filter (12 regions) and sort toggles (composite, snowfall, consistency)
- Year-by-year breakdown table with temperature data
- PostgreSQL caching layer (optional — server runs without DB)
- In-memory caching for instant subsequent loads
- Responsive design with Inter font, blue gradient header
- Gold/silver/bronze rank badges for top 3
- Loading progress bar with status messages during initial data fetch
