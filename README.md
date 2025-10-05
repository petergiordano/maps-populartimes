# Pickleball Competitive Intelligence Platform

Chicago-area pickleball facility traffic analysis and competitive intelligence tool.

## 🚀 Quick Start

**First time or returning after a break?**
```bash
bash .specify/scripts/bash/status.sh
```
This shows exactly where you are: current feature, git status, next steps, and documentation links.

---

## Project Overview

Web-based SPA for analyzing Google Maps popular times data across Chicago pickleball facilities, enabling competitive intelligence for Pickleball Clubhouse Chicago (4242 N. Elston).

**Key Features:**
- 📊 Comparison grid with mini graphs for 8+ facilities
- 🔍 Detailed facility modal with 4 visualization tabs
- 📤 Multi-format export (CSV, PNG, PDF, JSON)
- 🎯 Competitive analysis & opportunity identification
- 📈 Time-slot heatmap showing traffic gaps

**Tech Stack:** React 19 + TypeScript + Vite + Recharts → Deployed on Vercel

**Documentation:**
- **Master Roadmap**: `specs/000-project-overview/roadmap.md` (19 features planned)
- **Current Tasks**: `todo.md` (lightweight tracker)
- **Feature Specs**: `specs/001-facility-detail-modal/` etc.

---

## Backend: Python Popular Times Tool

Get Google Maps popular times data for Chicago addresses with beautiful visualizations.

## Features

- 📊 Multiple visualization types (heatmaps, line charts, dashboards, comparisons)
- 📅 Customizable date ranges (weekdays, weekends, specific days)
- 🎯 Search by coordinates or specific place ID
- 💾 Export charts to PNG files
- 🔍 Compare multiple locations

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Get a Google Maps API key:
   - Go to https://developers.google.com/maps
   - Create a project and enable the Places API
   - Create credentials (API key)

4. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

5. Add your API key to `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key
   ```

## Usage

### Basic Usage (Default - Willis Tower)

```bash
python chicago_lookup.py
```

### Search Specific Location

```bash
# Using coordinates (lat/lng)
python chicago_lookup.py --lat 41.8788 --lng -87.6359

# Using a Google Maps Place ID
python chicago_lookup.py --place-id ChIJ3eFG8Sj0BIgRJvVcGtERPJ0
```

### Customize Search Parameters

```bash
# Search for bars and restaurants within 500 meters
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --radius 500 --types restaurant bar cafe

# Search for gyms and fitness centers
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --types gym
```

### Visualization Options

```bash
# Show full dashboard (default)
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz dashboard

# Show heatmap only
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz heatmap

# Show line chart
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz line

# Compare multiple locations
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz comparison
```

### Filter by Date Range

```bash
# Show weekdays only (Monday-Friday)
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 0-4

# Show weekends only (Saturday-Sunday)
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 5-6

# Show specific day (e.g., Monday)
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 0

# Day codes: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
```

### Save Visualizations

```bash
# Save to file
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --output results.png

# Save without displaying
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --output results.png --no-display
```

### Combined Examples

```bash
# Weekend heatmap for bars near Millennium Park
python chicago_lookup.py --lat 41.8826 --lng -87.6226 --days 5-6 --viz heatmap --types bar --output weekend_bars.png

# Weekday dashboard for cafes, save to file
python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 0-4 --types cafe --output weekday_cafes.png
```

## Visualization Types

### 1. Dashboard (default)
Comprehensive overview with:
- Weekly heatmap
- Weekday vs weekend comparison
- Peak hours by day
- Statistics table
- Average daily pattern

### 2. Heatmap
Color-coded grid showing popularity by day and hour

### 3. Line Chart
Line graphs comparing different days of the week

### 4. Comparison
Bar chart comparing multiple locations at the same time

## Getting Coordinates

To find coordinates for a Chicago address:

1. Go to [Google Maps](https://maps.google.com)
2. Search for the address
3. Right-click on the location
4. Click on the coordinates to copy them
5. Use them with `--lat` and `--lng`

## Common Chicago Locations

```bash
# Willis Tower
--lat 41.8788 --lng -87.6359

# Millennium Park
--lat 41.8826 --lng -87.6226

# Navy Pier
--lat 41.8917 --lng -87.6086

# Wrigley Field
--lat 41.9484 --lng -87.6553

# The Loop (downtown)
--lat 41.8781 --lng -87.6298
```

## Troubleshooting

### No data found
- Increase search radius: `--radius 500`
- Try different place types: `--types restaurant bar cafe store`
- Some locations may not have popular times data

### API errors
- Check your API key in `.env`
- Verify Places API is enabled in Google Cloud Console
- Check you haven't exceeded the 5,000 monthly request limit

## Project Structure

```
populartimes/
├── chicago_lookup.py   # Main script with CLI
├── visualizer.py       # Visualization functions
├── requirements.txt    # Python dependencies
├── .env               # API key (create from .env.example)
└── README.md          # This file
```

## Tips

- Popular times data represents typical patterns, not real-time data
- `current_popularity` (if available) shows real-time busyness
- Data accuracy depends on Google's data collection
- Not all places have popular times data
