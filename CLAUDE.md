# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Python-based tool for retrieving and visualizing Google Maps popular times data for Chicago locations. The project consists of two main components:

1. **CLI Tool** (`chicago_lookup.py`) - Command-line interface for querying popular times data
2. **Visualization Module** (`visualizer.py`) - Creates various chart types (heatmaps, line charts, dashboards, comparisons)

The codebase is currently Python-only but has a future roadmap to add a React frontend SPA for pickleball facility comparison (see `PRD_COMPARISON_GRID.md`).

## Setup & Environment

**Virtual Environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Install Dependencies:**
```bash
pip install -r requirements.txt
```

**Environment Variables:**
- Copy `.env.example` to `.env`
- Add your Google Maps API key to `.env`:
  ```
  GOOGLE_MAPS_API_KEY=your_actual_api_key
  ```
- The API key is loaded via `python-dotenv` in `chicago_lookup.py`

## Key Dependencies

- `populartimes` - Google Maps popular times data fetcher (installed from GitHub fork)
- `matplotlib` - Plotting library
- `seaborn` - Statistical visualization
- `pandas` - Data manipulation
- `python-dotenv` - Environment variable management

## Common Commands

**Run with default location (Willis Tower):**
```bash
python chicago_lookup.py
```

**Search specific coordinates:**
```bash
python chicago_lookup.py --lat 41.8788 --lng -87.6359
```

**Search by Google Maps Place ID:**
```bash
python chicago_lookup.py --place-id ChIJ3eFG8Sj0BIgRJvVcGtERPJ0
```

**Customize search parameters:**
```bash
# Search for bars and restaurants within 500m
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --radius 500 --types restaurant bar cafe

# Show weekdays only (Monday=0, Sunday=6)
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 0-4

# Show weekends only
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 5-6
```

**Visualization options:**
```bash
# Dashboard (default) - comprehensive overview
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz dashboard

# Heatmap - color-coded grid by day/hour
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz heatmap

# Line chart - lines comparing different days
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz line

# Comparison - bar chart comparing multiple locations
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz comparison
```

**Save visualizations:**
```bash
# Save to file
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --output results.png

# Save without displaying
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --output results.png --no-display
```

## Code Architecture

### chicago_lookup.py

**Main entry point** with command-line interface for querying popular times data.

**Key functions:**
- `get_popular_times_by_area(api_key, lat, lng, place_types, radius)` - Searches for places in a geographic area using bounding box calculation
- `get_place_by_id(api_key, place_id)` - Retrieves data for a specific place by Google Maps Place ID
- `print_popular_times(place)` - Prints formatted text output with hourly breakdown and ASCII bar charts
- `parse_day_range(day_range_str)` - Parses day range strings like "0-4" or "5-6" into tuples

**CLI Flow:**
1. Parse command-line arguments (location, search params, visualization type)
2. Load API key from `.env`
3. Fetch data either by place ID or geographic search
4. Filter results to places with popular times data
5. Print text summary for first place
6. Generate requested visualization type
7. Display plots (unless `--no-display` flag is set)

### visualizer.py

**Visualization module** that creates various chart types using matplotlib and seaborn.

**Visualization Functions:**

1. **`create_heatmap(place, days_range, save_path)`** - Creates a color-coded grid showing popularity by day and hour with:
   - X-axis: 24 hours
   - Y-axis: Days of week
   - Color scale: YlOrRd (yellow to red)
   - Annotated values in each cell

2. **`create_line_chart(place, days_range, save_path)`** - Line graphs comparing different days:
   - One line per day
   - Color-coded by day using tab10 colormap
   - Shows hourly trends

3. **`create_bar_chart_comparison(places, hour, day, save_path)`** - Horizontal bar chart comparing multiple locations:
   - Compares popularity across places at specific time
   - Can filter by specific day or average all days
   - Sorted by popularity (highest to lowest)

4. **`create_summary_dashboard(place, save_path)`** - Comprehensive 5-panel dashboard:
   - Panel 1: Weekly heatmap (full width)
   - Panel 2: Weekday vs weekend comparison
   - Panel 3: Peak hours by day
   - Panel 4: Statistics table (rating, current popularity, peak times)
   - Panel 5: Average daily pattern

**Shared visualization settings:**
- All functions support `save_path` parameter for PNG export at 300 DPI
- Style: seaborn "whitegrid"
- Default figure size: 14x8 inches
- Color scheme for popularity: YlOrRd (Yellow-Orange-Red)

### Data Structures

**Place data from populartimes API:**
```python
{
    'name': str,
    'address': str,
    'rating': float,
    'rating_n': int,  # number of reviews
    'current_popularity': int,  # 0-100, real-time data if available
    'time_spent': str,  # e.g., "1-2 hours"
    'populartimes': [
        {
            'day': int,  # 0=Monday, 6=Sunday
            'data': [int],  # 24 hourly values (0-100)
        },
        # ... 7 days total
    ]
}
```

## Important Implementation Details

**Day numbering:** 0=Monday, 1=Tuesday, ..., 6=Sunday (throughout codebase)

**Bounding box calculation:**
- Geographic search uses bounding box from center point
- Approximation: ~111,000 meters per degree at Chicago's latitude
- `offset = radius / 111000.0` to convert meters to degrees

**Date range filtering:**
- `days_range` parameter is tuple of (start_day, end_day) inclusive
- Examples: (0, 4) = weekdays, (5, 6) = weekends
- Applied at visualization time, not data fetch time

**Error handling:**
- Gracefully handles missing popular times data
- Continues processing other locations if one fails
- Prints user-friendly error messages

## Future Development

See `PRD_COMPARISON_GRID.md` for detailed product requirements for the planned React SPA frontend. Key points:

**Planned architecture:**
- React 18+ with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Chart.js or Recharts for visualizations
- Vercel deployment
- Optional serverless backend for API calls

**Project structure will expand to:**
```
populartimes/
├── frontend/          # React SPA (to be created)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   └── public/
│       ├── facilities.json  # User-editable facility list
│       └── config.json      # App configuration
├── backend/           # Optional serverless functions
├── chicago_lookup.py  # Existing CLI tool
└── visualizer.py      # Existing visualization module
```

**Integration approach:**
- Reuse visualization logic from `visualizer.py` in React components
- Translate matplotlib charts to Chart.js/Recharts
- Keep CLI tool separate for power users
- Share data fetching patterns between CLI and web app

## Google Maps API

**Required API:**
- Places API must be enabled in Google Cloud Console
- Free tier: 5,000 requests/month
- API key stored in `.env` (never commit to git)

**Rate limiting:**
- No built-in rate limiting in current code
- Consider adding exponential backoff for production use
- Cache data when possible to reduce API calls

## Troubleshooting

**"No data found":**
- Increase search radius: `--radius 500`
- Try different place types: `--types restaurant bar cafe store`
- Some locations may not have popular times data

**"GOOGLE_MAPS_API_KEY not found":**
- Ensure `.env` file exists in project root
- Check that API key is properly set in `.env`
- Verify Places API is enabled in Google Cloud Console

**API errors:**
- Check API key validity
- Verify Places API is enabled
- Check monthly quota hasn't been exceeded
