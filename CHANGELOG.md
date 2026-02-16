# Changelog

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
