# Pickleball Competitive Intelligence Platform - Master Roadmap

**Project**: Chicago Pickleball Facility Comparison Tool
**Owner**: Peter Giordano - Pickleball Clubhouse Chicago (4242 N. Elston)
**Goal**: Competitive traffic analysis to identify opportunities vs paid/free competitors
**Last Updated**: 2025-10-05

---

## 🎯 Vision

Build a web-based competitive intelligence platform that enables Pickleball Clubhouse Chicago to:
- Analyze traffic patterns across all Chicago-area pickleball facilities
- Identify time slots where competitors are at capacity (overflow opportunities)
- Discover underutilized hours to focus marketing efforts
- Make data-driven decisions for staffing, pricing, and programming

**Primary User**: Facility owners, operators, and strategists
**Deployment**: Vercel (vercel.com) - Static SPA with automatic Git deployments

---

## ✅ Completed Features

### ✓ Feature 001: Facility Detail Modal (COMPLETED)
**Spec**: [`specs/001-facility-detail-modal/`](../001-facility-detail-modal/)
**Status**: Implemented ✅
**Completed**: 2025-10-05

**What It Does**:
- Click any facility in comparison grid to open detailed modal
- Four tabbed visualizations: Weekly Heatmap, Day Comparison, Summary Dashboard, Competitive Comparison
- Multi-format export: CSV, PNG, PDF (all tabs), JSON
- Keyboard navigation (Escape to close)
- Performance: <2s modal load, <100ms tab switching

**Business Value**:
- Deep-dive analysis of individual competitors
- Export capabilities for board presentations and strategic planning
- Visual pattern recognition for peak hours and competitive gaps

**Technical Stack**:
- React 19 + TypeScript 5.9
- Recharts for visualizations
- html2canvas + jsPDF for exports
- Deployed to Vercel

---

## 🚀 High Priority Features (Next Up)

### Feature 002: "My Facility" Visual Highlighting
**Priority**: 🔥 CRITICAL
**Effort**: Small (1-2 days)
**Value**: High - Makes tool actionable for primary use case

**Requirements**:
- Visual emphasis for Pickleball Clubhouse Chicago (different color/border in grid)
- "Pin to top" toggle to keep your facility at top of sorted lists
- "Compare to mine" quick action button on other facilities
- Performance indicator showing +/- vs your metrics

**Why Now**: Foundation for all competitive analysis features

---

### Feature 003: Radius Filter & Distance Display
**Priority**: 🔥 CRITICAL
**Effort**: Medium (3-4 days)
**Value**: High - Focus on direct geographic competitors

**Requirements**:
- Filter facilities by distance from 4242 N. Elston (1, 2, 5, 10 mile radius options)
- Add "Distance" column showing miles from your location
- Auto-group facilities by Chicago neighborhood/suburb
- "Direct competitors" preset view (private clubs within 3-mile radius)

**Technical**:
- Haversine formula for distance calculation
- Store Pickleball Clubhouse Chicago coords as constant
- Add distance to Facility type

**Why Now**: Essential for meaningful competitive analysis

---

### Feature 004: Time-Slot Opportunity Heatmap ⭐
**Priority**: 🔥 CRITICAL - MOST VALUABLE
**Effort**: Large (5-7 days)
**Value**: HIGHEST - Core competitive intelligence feature

**Requirements**:
- Heat map grid: Your traffic vs avg competitor for each hour/day combination
- RED cells = Underperforming (opportunity to improve/market)
- GREEN cells = Outperforming (competitive strength)
- Click cell to see which competitors busy during that slot
- Gap analysis with quantified difference (e.g., "-30% vs avg during weekday mornings")
- Opportunity ranking list: Best time slots for marketing focus

**Example Output**:
```
         Mon    Tue    Wed    Thu    Fri    Sat    Sun
6am      -20%   -15%   -10%   -25%   -18%   +5%    +10%
...
9pm      +10%   +15%   +20%   +25%   +30%   -5%    -10%
```

**Why Now**: This is THE killer feature for competitive intelligence

---

## 📋 Medium Priority Features

### Feature 005: Public vs Private Segmentation
**Priority**: HIGH
**Effort**: Small (2-3 days)
**Value**: Medium-High

**Requirements**:
- Type filter toggle: Show only public OR only private facilities
- Benchmark selection: Compare against "All", "Private only", or "Public only"
- Traffic premium analysis: Do paid clubs get more traffic? By how much?
- Competitive set builder: Select specific facilities for custom comparison groups

---

### Feature 006: Interactive Map View
**Priority**: HIGH
**Effort**: Large (7-10 days)
**Value**: Medium-High

**Requirements**:
- Google Maps integration with facility pins
- Time scrubber control: Slide through hours/days like weather app
- Pin colors represent popularity at selected time (red=high, yellow=medium, green=low)
- Pin size scaled by rating or review count
- Tooltip on hover: Name, type, current popularity at selected time
- Your facility highlighted with different pin style/color
- Radius overlay: Visual circle showing X-mile radius from your location

---

### Feature 007: Data Completeness & Auto-Refresh
**Priority**: MEDIUM
**Effort**: Medium (4-5 days)
**Value**: Medium

**Requirements**:
- Add all Chicago-area pickleball facilities (expand from current 8)
- Verify Pickleball Clubhouse Chicago data accuracy
- Auto-refresh stale data when > X days old (configurable threshold)
- Data quality dashboard showing last updated timestamp per facility
- Manual "Refresh Data" button with progress indicator

---

### Feature 008: Peak Performance Dashboard
**Priority**: MEDIUM
**Effort**: Medium (4-5 days)
**Value**: Medium

**Requirements**:
- Peak hour comparison: Side-by-side view of all facilities' busiest times
- Your vs competitors: Highlight when you peak vs when they peak
- Capacity utilization: Normalize by popularity score
- Consistency score: Steady traffic vs spiky patterns visualization

---

### Feature 009: Day-of-Week Patterns Analysis
**Priority**: MEDIUM
**Effort**: Small (2-3 days)
**Value**: Medium

**Requirements**:
- Weekday vs Weekend comparison: Split view showing M-F vs Sat-Sun
- Day strength ranking: Which days you're strongest/weakest vs competition
- Day-specific opportunities: Show competitors' packed days where you have capacity
- Weekly rhythm analysis: Visualize weekly patterns across all facilities

---

## 🎨 Polish & UX Features

### Feature 010: Branding & Design System
**Priority**: MEDIUM
**Effort**: Medium (3-4 days)
**Value**: Medium

**Requirements**:
- Apply Overdrive brand colors from design guide
- Integrate Pickleball Clubhouse Chicago logo
- Match brand typography and fonts
- Update Tailwind config with brand colors
- Optional dark mode support

**Reference**: `docs/design/Overdrive_Brand-Identity-Design-and-Style-Guide.md`

---

### Feature 011: Enhanced Multi-Facility Comparison
**Priority**: LOW-MEDIUM
**Effort**: Medium (3-4 days)
**Value**: Low-Medium

**Requirements**:
- Multi-select compare: Select 2-5 facilities for detailed side-by-side
- Comparison cards: Side-by-side metric cards
- Difference highlighting: Show % difference from your facility
- Export comparison view as PDF/PNG

---

## 💡 Advanced Features (Future)

### Feature 012: Competitive Positioning Matrix
**Priority**: LOW
**Effort**: Medium (4-5 days)

**Requirements**:
- Scatter plot: Rating (X) vs Peak Traffic (Y)
- Your position highlighted
- Quadrant analysis (high/low traffic × high/low rating)
- Public/private color coding

---

### Feature 013: Rating & Review Intelligence
**Priority**: LOW
**Effort**: Small (2-3 days)

**Requirements**:
- Rating efficiency: Traffic per star rating
- Review volume impact analysis
- Your rating vs traffic performance
- Underperforming competitors identification

---

### Feature 014: Time-Based Revenue Opportunities
**Priority**: LOW
**Effort**: Medium (4-5 days)

**Requirements**:
- Underutilized hours report
- Premium time performance (6-9pm weekdays)
- Weekend morning deep dive (Sat/Sun 8am-12pm)
- Late night potential analysis (after 8pm)
- Dynamic pricing suggestions based on competitor patterns

---

### Feature 015: Custom Competitor Sets & Watchlists
**Priority**: LOW
**Effort**: Medium (3-4 days)

**Requirements**:
- Create watchlists: "Direct competitors", "Aspirational targets", "Public alternatives"
- Saved comparison groups with bookmarks
- Notes on competitors (observations/intel)
- Custom tags (e.g., "New entrant", "Declining", "Growing")

---

## 🔬 Long-Term Features (V2+)

### Feature 016: Trend & Change Detection
**Prerequisites**: Historical data collection over time
**Effort**: Large (10+ days)

**Requirements**:
- Week-over-week comparison
- Seasonal pattern analysis
- Competitor growth tracking
- Alert system for >20% traffic shifts
- Historical trend line graphs

---

### Feature 017: Statistical Analysis Tools
**Effort**: Medium (5-7 days)

**Requirements**:
- Percentile ranking among all facilities
- Z-score calculations
- Outlier detection
- Correlation heatmap

---

### Feature 018: Export & Reporting Suite
**Effort**: Medium (4-5 days)

**Requirements**:
- PDF weekly competitive summary reports
- CSV download for external analysis
- Email digest automation
- Presentation mode for stakeholder meetings
- Screenshot tool for specific views

---

### Feature 019: Address Display Enhancement
**Priority**: LOW
**Effort**: Trivial (1 hour)
**Source**: Pete's Ideas from todo.md

**Requirements**:
- Add address column or tooltip to home screen grid
- Show full address on facility hover or in compact form

---

## 📊 Implementation Priority Matrix

| Feature | Priority | Effort | Value | Start After |
|---------|----------|--------|-------|-------------|
| 002: My Facility Highlight | 🔥 CRITICAL | Small | High | Immediately |
| 003: Radius Filter | 🔥 CRITICAL | Medium | High | Feature 002 |
| 004: Time-Slot Heatmap | 🔥 CRITICAL | Large | HIGHEST | Feature 003 |
| 005: Public/Private Filter | HIGH | Small | Med-High | Feature 004 |
| 006: Interactive Map | HIGH | Large | Med-High | Feature 005 |
| 007: Data Completeness | MEDIUM | Medium | Medium | Feature 006 |
| 008: Peak Dashboard | MEDIUM | Medium | Medium | Feature 007 |
| 009: Day Patterns | MEDIUM | Small | Medium | Anytime |
| 010: Branding | MEDIUM | Medium | Medium | Before launch |
| 011-019: Others | LOW | Varies | Low-Med | After core |

---

## 🎬 Recommended Implementation Phases

### **Phase 1: Foundation** (Week 1-2) ✅ DONE
- ✅ Set up React + TypeScript + Vite project
- ✅ Basic comparison grid with facilities
- ✅ Mini graphs for daily patterns
- ✅ Facility detail modal with visualizations
- ✅ Multi-format export (CSV, PNG, PDF, JSON)
- ✅ Deploy to Vercel

### **Phase 2: Core Competitive Intelligence** (Week 3-4)
- 🔜 Feature 002: My Facility Highlighting
- 🔜 Feature 003: Radius Filter & Distance
- 🔜 Feature 004: Time-Slot Opportunity Heatmap ⭐

### **Phase 3: Segmentation & Comparison** (Week 5-6)
- 🔜 Feature 005: Public vs Private Filtering
- 🔜 Feature 006: Interactive Map View
- 🔜 Feature 007: Data Completeness

### **Phase 4: Strategic Insights** (Week 7-8)
- 🔜 Feature 008: Peak Performance Dashboard
- 🔜 Feature 009: Day-of-Week Patterns
- 🔜 Feature 010: Apply Branding

### **Phase 5: Polish & Launch** (Week 9-10)
- 🔜 Feature 011: Enhanced Comparisons
- 🔜 Feature 019: Address Display
- 🔜 Performance optimization
- 🔜 Full QA and user testing
- 🔜 Production launch

### **Phase 6: Advanced Features** (Month 3+)
- 🔜 Features 012-018 as needed
- 🔜 Trend analysis (requires historical data)
- 🔜 Statistical tools
- 🔜 Automated reporting

---

## 📝 Key Business Questions to Answer

### Traffic & Competition
1. ✅ When are my competitors busiest vs when am I busiest?
2. When are free courts stealing my traffic during specific hours?
3. Which paid clubs should I benchmark against?
4. Am I getting appropriate traffic for my rating/quality?

### Strategy & Growth
5. What hours should I focus marketing/promotions on?
6. Which competitors are within my catchment area?
7. Should I adjust pricing/hours based on competitor patterns?
8. Where are the white space opportunities in the market?

### Operational
9. What times should I staff more heavily?
10. When should I run leagues/tournaments to avoid direct competition?
11. Which hours have excess capacity I could fill?
12. Are my peak hours aligned with market demand?

---

## 🎯 Success Metrics

### Technical Performance
- [x] Load time < 3 seconds
- [x] Support 8-20 facilities without performance issues
- [x] Works on Chrome, Firefox, Safari, Edge
- [x] Mobile responsive
- [x] Zero critical bugs

### Business Impact (Post-Launch)
- [ ] Time-on-page for competitive analysis
- [ ] Number of opportunity time slots identified
- [ ] Marketing campaigns launched based on insights
- [ ] Revenue increase from optimized pricing/scheduling
- [ ] Staff utilization improvement

---

## 🔗 Documentation Links

- **Project Overview Spec**: [`specs/000-project-overview/spec.md`](./spec.md)
- **Original PRD**: [`PRD_COMPARISON_GRID.md`](../../PRD_COMPARISON_GRID.md) (archived)
- **Feature 001 (Modal)**: [`specs/001-facility-detail-modal/`](../001-facility-detail-modal/)
- **Main Code**: `CLAUDE.md` for development context

---

## 📌 Notes

- **Feature 004 (Time-Slot Heatmap)** is the highest-value feature and should be prioritized after foundation work
- **Vercel deployment** is automatic on git push to main branch
- **Google Maps API** rate limits managed via 24-hour caching
- **Data source**: Pre-fetched popular times stored in `public/facilities.json`
- **Primary facility**: Pickleball Clubhouse Chicago (4242 N. Elston) - all features designed around competitive analysis for this location

---

*Last Updated: 2025-10-05*
*Maintained via Spec Kit methodology*
