# PowderRank

Historical February snowfall rankings for ~76 North American ski resorts. Built for snowboarders and skiers planning a week-long trip during the second week of February (Feb 7-14).

## What It Does

- Ranks resorts by a **composite score** combining:
  - **Average snowfall** (50%) — total inches during Feb 7-14, averaged over 2000-2024
  - **Consistency** (30%) — percentage of years with >2" of snowfall that week
  - **Cluster bonus** (20%) — extra points for resorts with other mountains within 2hr drive
- Covers resorts across CO, UT, CA, WY, MT, ID, NM, VT, NH, NY, WA, OR, BC, AB, QC
- Fetches 25 years of historical weather data from Open-Meteo (free, no API key)
- First load takes ~2 minutes; cached permanently after

## Tech Stack

- **Client**: React 18, Vite
- **Server**: Express, PostgreSQL (optional — runs without DB)
- **Data**: Open-Meteo Archive API

## Getting Started

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start server (port 3003)
cd server && npm run dev

# Start client (port 5173, proxies /api to server)
cd ../client && npm run dev
```

Open http://localhost:5173

### Database (Optional)

PowderRank works without a database but will re-fetch weather data on every server restart. To persist cached data:

```bash
createdb powderrank
```

Set `DATABASE_URL` in `server/.env`:
```
DATABASE_URL=postgresql://localhost:5432/powderrank
PORT=3003
```

## Features

- **Rankings list** with region filter and sort options (composite score, avg snowfall, consistency)
- **Resort detail view** with yearly snowfall bar chart, temperature data, nearby resorts list
- **Collapsible year-by-year breakdown** table with temps
- **Responsive design** for mobile and desktop
- Gold/silver/bronze badges for top 3 resorts

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/rankings` | All resorts ranked (triggers fetch on first call) |
| `GET /api/rankings/progress` | Current data fetch progress |
| `GET /api/resort/:id` | Full detail for a single resort |

## Scoring Example

Breckenridge, CO (12 nearby resorts):
- Avg snowfall: ~6" → normalized score
- Consistency: 69% of years had >2"
- Cluster bonus: 65 (5+ nearby)
- Composite: weighted sum of all three
