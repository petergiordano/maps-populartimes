# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 FIRST: Re-Orient Yourself (New Session Checklist)

**If this is a new Claude Code session, run this FIRST:**

**Option 1 (Easiest):**
```
/status
```

**Option 2 (Direct):**
```bash
bash .specify/scripts/bash/status.sh
```

This shows:
- Current git branch and status
- Feature progress (what's completed vs in-progress)
- Recommended next steps
- Links to all documentation

**Quick orientation files:**
- `.specify/QUICK_REFERENCE.md` - Cheat sheet for common scenarios
- `todo.md` - Lightweight task tracker (check this!)
- `specs/000-project-overview/roadmap.md` - Master roadmap (19 features)

**Workflow methodology:** This project uses **Spec Kit** (GitHub's spec-driven development framework)
- Features are documented in `specs/` directory
- Each feature has: spec.md (requirements) → plan.md (technical) → tasks.md (work items)
- Slash commands: `/specify` → `/plan` → `/tasks` → `/implement`

---

## Project Overview

**Pickleball Competitive Intelligence Platform** - Web-based tool for analyzing Google Maps popular times data across Chicago pickleball facilities, enabling competitive intelligence for Pickleball Clubhouse Chicago (4242 N. Elston).

### Dual Architecture

1. **Frontend (React SPA)** - Primary focus
   - React 19 + TypeScript 5.9 + Vite 7.1
   - Recharts for visualizations
   - Tailwind CSS for styling
   - Deployed to Vercel
   - Location: `frontend/`

2. **Backend (Python CLI Tools)** - Data fetching
   - `chicago_lookup.py` - CLI for querying popular times
   - `visualizer.py` - Creates charts (heatmaps, line charts, dashboards)
   - Data source for React app
   - Location: project root

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

## Current Development Status

**✅ Phase 1 Complete:**
- Feature 001: Facility Detail Modal (implemented)
  - 4 visualization tabs: Heatmap, Day Comparison, Summary, Competitive
  - Multi-format export: CSV, PNG, PDF, JSON
  - Spec: `specs/001-facility-detail-modal/`

**🔜 Phase 2 Next (Critical Features):**
- Feature 002: "My Facility" Visual Highlighting (1-2 days)
- Feature 003: Radius Filter & Distance Display (3-4 days)
- Feature 004: Time-Slot Opportunity Heatmap ⭐ HIGHEST VALUE (5-7 days)

**See full roadmap:** `specs/000-project-overview/roadmap.md` (19 features total)

---

## Deployment & Infrastructure

**Frontend:**
- Deployed to: Vercel (vercel.com)
- Build: `npm run build` in `frontend/`
- Output: `frontend/dist/`
- Auto-deploy: Git push to main branch
- URL: [Add production URL when deployed]

**Data:**
- Static JSON: `frontend/public/facilities.json`
- Pre-fetched from Google Maps Popular Times API
- No backend/database required for V1

**Environment:**
- No env vars needed for frontend (static data)
- Python tools use `.env` for GOOGLE_MAPS_API_KEY

---

## Feature Development Workflow

**Using Spec Kit methodology:**

1. **Check status** → `/status` (or `bash .specify/scripts/bash/status.sh`)
2. **Start feature** → `git checkout -b 00X-feature-name`
3. **Create spec** → `/specify` command (documents requirements)
4. **Create plan** → `/plan` command (technical implementation)
5. **Create tasks** → `/tasks` command (actionable work items)
6. **Implement** → Work through tasks in `specs/00X-feature-name/tasks.md`
7. **Test** → Run scenarios in `quickstart.md`
8. **Commit** → Descriptive commits following existing patterns
9. **Push & PR** → Push branch and create pull request

**Key files per feature:**
```
specs/00X-feature-name/
├── spec.md          # Business requirements (what & why)
├── plan.md          # Technical design (how)
├── tasks.md         # Work items (actionable steps)
├── quickstart.md    # Test scenarios (validation)
└── contracts/       # API contracts (if applicable)
```

---

## Project Structure (Updated)

```
maps-populartimes/
├── specs/                        # Spec Kit feature documentation
│   ├── 000-project-overview/     # Business goals & roadmap
│   ├── 001-facility-detail-modal/ # Feature 001 spec/plan/tasks
│   └── ...                       # Future features
├── frontend/                     # React SPA ✅ ACTIVE
│   ├── src/
│   │   ├── components/
│   │   │   ├── FacilityModal.tsx
│   │   │   └── visualizations/
│   │   ├── utils/
│   │   │   └── exportUtils.ts
│   │   └── types/
│   └── public/
│       └── facilities.json       # Facility data
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

---

## 🎯 Key Reminders for New Sessions

**ALWAYS start with:** `/status` (or `bash .specify/scripts/bash/status.sh`)

**Before implementing anything:**
1. Check `todo.md` for current priorities
2. Review current feature spec in `specs/[branch-name]/spec.md`
3. Check if plan exists (`specs/[branch-name]/plan.md`)
4. Check if tasks exist (`specs/[branch-name]/tasks.md`)

**When user asks "Where did we leave off?":**
1. Run `/status` command
2. Check todo.md
3. Look at current git branch
4. Read the spec for that branch if it exists

**Documentation hierarchy:**
- **Quick tasks** → `todo.md` (90 lines, check first)
- **Feature details** → `specs/00X-feature-name/` (current work)
- **Full roadmap** → `specs/000-project-overview/roadmap.md` (19 features)
- **Business context** → `specs/000-project-overview/spec.md` (goals & scenarios)

**Custom Claude Code slash commands:**
- `/status` - Show comprehensive project status (custom command)
- `/specify` - Create feature specification (Spec Kit)
- `/plan` - Generate implementation plan (Spec Kit)
- `/tasks` - Break down into actionable tasks (Spec Kit)
- `/implement` - Execute implementation (Spec Kit)
- `/analyze` - Check cross-artifact consistency (Spec Kit)

**Common user requests in new sessions:**
- "Where did we leave off?" → Run `/status`
- "What's next?" → Check todo.md + roadmap.md
- "What was I building?" → Check current branch spec
- "Show me the plan" → cat specs/[branch-name]/plan.md

---

## 🤖 Using Subagents (Advanced)

**What are subagents?** Specialized AI agents with domain expertise for specific tasks.

**Available subagents** (in `.claude/agents/`):
1. **frontend-developer** - React 19 components, Recharts visualizations, Tailwind layouts
2. **ui-ux-designer** - Interface design, accessibility, responsive layouts
3. **code-reviewer** - Code quality, standards enforcement, security checks
4. **typescript-pro** - Advanced TypeScript patterns, complex types, strict mode
5. **test-engineer** - Comprehensive testing, test coverage, quality validation
6. **spec-architect** - Feature architecture, technical planning, design decisions

### When to Use Subagents

**✅ Use subagents for:**
- Creating React components → frontend-developer
- Designing feature UX → ui-ux-designer
- Reviewing code quality → code-reviewer
- Complex TypeScript types → typescript-pro
- Writing tests → test-engineer
- Architecting features → spec-architect

**❌ Don't use subagents for:**
- Simple questions (use main Claude)
- Reading files (use main Claude)
- Running `/status` (use main Claude)
- Git operations (use main Claude)

### How to Invoke Subagents

Simply mention the subagent by name in your request:

```
I need help from the frontend-developer subagent to create a heatmap component
```

I will automatically use the Task tool to invoke the appropriate subagent.

### Subagent Workflow with Spec Kit

```
/specify → spec.md created
/plan → spec-architect designs architecture → plan.md
/tasks → tasks.md created
/implement →
  - Frontend tasks → frontend-developer subagent
  - Testing tasks → test-engineer subagent
  - Code review → code-reviewer subagent
```

**More details**: See `docs/subagents/README.md` or `.specify/guides/subagent-workflow.md`

---

**Last Updated**: 2025-10-05
**Project Owner**: Peter Giordano - Pickleball Clubhouse Chicago
**Deployment**: Vercel (vercel.com)
