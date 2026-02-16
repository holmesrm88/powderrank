# Future Enhancements

## Vacation Rental Integration (Hot Tub Rentals Near Resorts)

### Goal
Show available rental homes near each resort, filtered to only properties with a hot tub, with guest count selection.

### API Research (Feb 2026)

**Airbnb** — No public API. Official API is restricted to approved partners and property management software companies. However, several **third-party providers on RapidAPI** offer unofficial Airbnb search APIs that support:
- Location-based search (lat/lng + radius)
- Amenity filtering (hot tub, pool, fireplace, etc.)
- Guest count / capacity filtering
- Check-in / check-out date search
- Pricing data

Best options:
- [Airbnb Search API by ntd119](https://rapidapi.com/ntd119/api/airbnb-search) — supports amenity filters and guest counts
- [Airbnb API by DataCrawler](https://rapidapi.com/DataCrawler/api/airbnb19) — real-time listing data with amenity filtering
- Pricing: most RapidAPI Airbnb providers offer a free tier (limited requests/month), paid plans from ~$10-50/mo

**VRBO** — API access requires partnership approval through [Expedia Group's Rapid API](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide). Not available for individual developers without a business relationship. Over 900,000 vacation rentals available through the API for approved partners.

### Recommended Approach
Use a RapidAPI Airbnb provider since they're the most accessible. VRBO requires a business partnership that isn't realistic for a personal project.

### Implementation Plan

#### Server Changes
- `server/services/RentalService.js` — new service
  - `searchRentals(latitude, longitude, checkIn, checkOut, guests, radiusMiles)`
  - Filter: amenities must include "hot_tub" or "hot_tub_sauna"
  - Cache results per resort+dates+guests combo (TTL: 1 hour, since availability changes)
  - Rate limit handling for RapidAPI quota

- New API routes:
  - `GET /api/resort/:id/rentals?checkIn=2027-02-07&checkOut=2027-02-14&guests=6`
  - Returns: list of rentals with name, price/night, total price, photo URL, listing URL, distance from resort, amenities, bedrooms, bathrooms, rating

- `server/.env` additions:
  - `RAPIDAPI_KEY` — API key from RapidAPI
  - `RENTAL_SEARCH_RADIUS` — default 25 (miles from resort)

#### Client Changes
- Add guest count selector to ResortDetail (dropdown: 2-16 guests)
- Add "Find Rentals" button that triggers search with Feb 7-14 dates
- New `RentalsList.jsx` component:
  - Cards showing photo, property name, price, distance, rating
  - "Hot tub" badge on each card
  - Bedroom/bathroom count
  - Link to Airbnb listing
  - Sort by: price, distance, rating
- Loading state while rentals search runs
- Empty state: "No hot tub rentals found within X miles"

#### Data Shape
```json
{
  "id": "airbnb_12345",
  "name": "Ski-in/Ski-out Condo with Hot Tub",
  "price_per_night": 285,
  "total_price": 1995,
  "photo_url": "https://...",
  "listing_url": "https://airbnb.com/rooms/12345",
  "distance_miles": 3.2,
  "bedrooms": 3,
  "bathrooms": 2,
  "max_guests": 8,
  "rating": 4.87,
  "review_count": 124,
  "amenities": ["hot_tub", "wifi", "kitchen", "parking", "fireplace"]
}
```

---

## Other Ideas

### Custom Date Range (Partially Implemented)
- **Done**: Week picker dropdown with ~22 preset weeks (Nov 1 through Apr 5)
- **Future**: Full custom start/end date picker (arbitrary date ranges, not just 7-day presets)
- Could allow users to pick exact check-in and check-out dates for any length of stay

### Snow Forecast Integration
- Show current season snowfall + upcoming forecast alongside historical data
- Open-Meteo has a forecast API (free)

### Resort Comparison
- Side-by-side comparison of 2-3 selected resorts
- Overlay yearly snowfall charts

### User Favorites
- Save favorite resorts (localStorage or account-based)
- Quick-access list at top of rankings

### Lift Ticket Pricing
- Integrate day pass / multi-day pricing from resort websites
- Factor cost into a "value score"

### Drive Time Instead of Distance
- Use a routing API (OSRM, free) for actual drive times instead of straight-line distance
- Mountain roads make straight-line distance misleading

### Snow Quality Scoring
- Factor in temperature (colder = drier powder)
- Elevation bonus (higher = better snow preservation)
- Already have temp data — just need to add to scoring algorithm

### Map View
- Interactive map showing all resorts with score-colored markers
- Click marker to see summary, click through to detail
- Leaflet.js or Mapbox GL (both free tier)
