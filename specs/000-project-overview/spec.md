# Project Specification: Pickleball Competitive Intelligence Platform

**Project**: Chicago Pickleball Facility Comparison Tool
**Owner**: Peter Giordano - Pickleball Clubhouse Chicago
**Created**: 2025-01-05
**Updated**: 2025-10-05
**Status**: Active Development

---

## 1. Product Vision

### 1.1 Overview

A web-based competitive intelligence platform that empowers Pickleball Clubhouse Chicago (4242 N. Elston) to analyze traffic patterns across all Chicago-area pickleball facilities, identify market opportunities, and make data-driven strategic decisions for pricing, staffing, marketing, and programming.

### 1.2 Business Goals

**Primary Goal**: Increase Pickleball Clubhouse Chicago revenue and utilization by identifying and capitalizing on competitor traffic gaps.

**Strategic Objectives**:
1. **Market Intelligence**: Understand when and where competitors are busy vs slow
2. **Opportunity Discovery**: Identify time slots to capture overflow or differentiate
3. **Operational Optimization**: Align staffing, pricing, and programming with market demand
4. **Competitive Positioning**: Benchmark performance vs public/private alternatives

### 1.3 Target Users

**Primary Users**: Facility owners, operators, general managers
**Secondary Users**: Marketing teams, strategy consultants, business analysts

### 1.4 Success Criteria

**Business Outcomes**:
- Identify 10+ high-opportunity time slots for marketing campaigns
- Increase utilization during historically slow periods by 15%+
- Optimize pricing during peak demand periods
- Reduce staff scheduling conflicts by aligning with traffic patterns

**Technical Outcomes**:
- Load < 3 seconds with 20 facilities
- Support competitive analysis for 50+ facilities
- 99% uptime on Vercel deployment
- Mobile-responsive for on-the-go analysis

---

## 2. Core Value Proposition

### What Makes This Unique

**Problem**: Most pickleball facility owners operate blind, without visibility into competitor traffic patterns or market gaps.

**Solution**: Real-time visual comparison of popular times across all area facilities, with actionable insights on when to market, price premium, or capture overflow.

**Competitive Advantage**:
- **Google Maps Data**: Leverages publicly available popular times (no manual data entry)
- **Visual Heat Maps**: Instant pattern recognition vs spreadsheet analysis
- **Competitive Focus**: Built specifically for benchmarking YOUR facility vs competitors
- **Export Ready**: PDF/CSV exports for board meetings and strategic planning

---

## 3. Key Features Summary

### Phase 1: Foundation (✅ COMPLETED)
- Comparison grid with 8+ facilities
- Mini graphs showing daily traffic patterns (7 days × 24 hours)
- Facility detail modal with 4 visualization tabs
- Multi-format export (CSV, PNG, PDF, JSON)
- Vercel deployment with automatic Git updates

### Phase 2: Core Competitive Intelligence (🔜 NEXT)
- **My Facility highlighting** - Visual emphasis on your location
- **Radius filtering** - Focus on geographic competitors (1-10 mile radius)
- **Time-Slot Opportunity Heatmap** - RED/GREEN cells showing where you underperform/outperform

### Phase 3: Segmentation & Analysis
- Public vs Private facility filtering
- Interactive map view with time scrubber
- Data completeness dashboard
- Peak performance comparison
- Day-of-week pattern analysis

### Phase 4: Advanced Insights (Long-term)
- Trend analysis (requires historical data collection)
- Statistical tools (percentiles, z-scores, correlations)
- Automated reporting and email digests
- Custom competitor watchlists

---

## 4. User Scenarios

### Scenario 1: Identifying Marketing Opportunities

**Context**: Marketing manager preparing Q2 campaign budget allocation

**Flow**:
1. Open Time-Slot Opportunity Heatmap
2. See weekday mornings showing RED (-25% vs competitors)
3. Competitors are at 75% capacity while you're at 50%
4. Click RED cell → see which facilities are busy (public parks, mostly)
5. Launch "Weekday Morning League" promotion targeting park overflow
6. Export heatmap as PDF for marketing budget approval

**Outcome**: Data-driven campaign targeting specific time slots with highest upside

---

### Scenario 2: Pricing Strategy Adjustment

**Context**: Owner evaluating whether to charge premium for Friday evenings

**Flow**:
1. Open comparison grid, filter to "Private clubs only"
2. Click Pickleball Clubhouse Chicago → View Detail Modal → Summary tab
3. See Friday 6-9pm is peak time (+30% above daily average)
4. Switch to Competitive Comparison tab, select Friday 7pm
5. See you rank 2nd out of 8 private clubs (both sold out at that time)
6. Export comparison data as CSV for pricing analysis

**Outcome**: Confident decision to raise Friday evening pricing 15% based on competitive demand

---

### Scenario 3: Operational Staffing Decision

**Context**: Operations manager planning staff schedules for next month

**Flow**:
1. Open Day-of-Week Patterns view
2. See Saturday mornings are busiest (both you and competitors)
3. Wednesday afternoons show low traffic across all facilities (market-wide slow period)
4. Adjust staffing: More staff Saturday mornings, skeleton crew Wednesday afternoons
5. Export schedule recommendation as PDF for GM approval

**Outcome**: Optimized labor costs while maintaining service quality during peak times

---

### Scenario 4: New Facility Competitive Threat

**Context**: New pickleball club opens 2 miles away, owner wants to assess impact

**Flow**:
1. Add new facility to `facilities.json` config file
2. Refresh app → New facility appears in grid
3. Use radius filter → Set to "3 mile radius" to focus on direct competitors
4. Compare traffic patterns between your facility and new entrant
5. Identify time slots where new facility is gaining traction
6. Create "Compare to mine" view for ongoing monitoring

**Outcome**: Proactive response to competitive threat with targeted counter-programming

---

## 5. Non-Goals (Out of Scope)

### Version 1 Exclusions

❌ **Real-time data updates** - Use 24-hour cached data (Google API limits)
❌ **User authentication** - Anonymous usage, no login required
❌ **Mobile native app** - Web-only (mobile-responsive)
❌ **Machine learning clustering** - Manual analysis only
❌ **Historical trend tracking** - Requires months of data collection first
❌ **Multi-city support** - Chicago area only (initially)
❌ **Custom facility data entry** - Google Maps API only (no manual override)
❌ **CRM integration** - Standalone tool
❌ **Automated email alerts** - Manual refresh only

---

## 6. Business Assumptions

1. **Data Availability**: Most Chicago pickleball facilities have popular times data in Google Maps
2. **Data Accuracy**: Google Maps popular times are reasonably accurate proxies for actual traffic
3. **Update Frequency**: 24-hour data refresh is sufficient for strategic (not tactical) decisions
4. **User Behavior**: Facility owners will check platform weekly, not daily
5. **Market Stability**: Competitor traffic patterns are relatively stable week-to-week
6. **Google API Access**: API rate limits can be managed via caching and batch requests

---

## 7. Dependencies & Constraints

### External Dependencies

- **Google Maps Places API** - Required for popular times data
  - Free tier: 5,000 requests/month
  - Rate limit: Managed via 24-hour caching per facility
  - Data availability: Not all facilities have popular times (estimated 80% coverage)

- **Vercel Hosting** - Deployment platform
  - Build command: `npm run build`
  - Deploy trigger: Git push to main branch
  - Edge network: Global CDN for fast loads

### Technical Constraints

- **Browser Support**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Data Freshness**: 24-hour minimum between API refreshes
- **Facility Limit**: Optimized for 20 facilities, support up to 50
- **Mobile Experience**: Responsive but desktop-optimized (minimum 1024px width recommended)

### Business Constraints

- **Budget**: Minimize API costs via aggressive caching
- **Timeline**: Core features deployed within 8-10 weeks
- **Maintenance**: Low-touch operation (static JSON config, no database)
- **Support**: Self-service tool (no dedicated support team)

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Google API rate limits exceeded** | High | Medium | 24h cache per facility, warn users of limits, batch requests |
| **Missing popular times data** | Medium | High | Show "No data" gracefully, expand to more facilities |
| **Poor mobile experience** | Low | Low | Desktop-first design, ensure core features work mobile |
| **Competitor data becomes unavailable** | High | Low | Monitor Google Maps changes, have contingency for manual entry |
| **Performance degrades with 50+ facilities** | Medium | Medium | Virtual scrolling, lazy loading, code splitting |
| **User doesn't understand insights** | Medium | Medium | Add tooltips, help text, example use cases |

---

## 9. Key Metrics & KPIs

### Usage Metrics (Post-Launch)

- Weekly active users
- Time on platform per session
- Number of facilities compared per session
- Heatmap interactions per visit
- Export downloads per week (PDF, CSV)

### Business Impact Metrics

- Marketing campaigns launched based on insights
- Pricing adjustments made using competitor data
- Staff schedule optimizations implemented
- Revenue increase during targeted time slots
- Utilization rate improvement in historically slow periods

### Technical Performance Metrics

- Page load time (target: <3s)
- Time to interactive (target: <4s)
- API error rate (target: <1%)
- Uptime percentage (target: 99%+)
- Mobile vs desktop usage split

---

## 10. Future Enhancements (V2+)

### High-Value Future Features

1. **Historical Trend Analysis** - Requires 3+ months of data collection
   - Week-over-week traffic changes
   - Seasonal pattern identification
   - Competitor growth/decline tracking

2. **Automated Insights & Alerts**
   - Email digest: "Top 5 opportunities this week"
   - Alert when competitor traffic shifts >20%
   - Recommended actions based on pattern changes

3. **Weather Overlay**
   - Correlate traffic patterns with weather data
   - Identify indoor vs outdoor facility dynamics

4. **Revenue Opportunity Calculator**
   - Estimate revenue potential of filling gaps
   - ROI calculator for marketing spend per time slot

5. **Collaboration Features**
   - Share views with team members
   - Comment/annotate on specific insights
   - Team dashboards for multi-location operators

---

## 11. Governance & Maintenance

### Configuration Management

- **Facility List**: Edited via `frontend/public/facilities.json` (manual updates)
- **App Settings**: Configured in `frontend/public/config.json`
- **Feature Flags**: Environment variables in Vercel dashboard

### Update Process

1. Add new facility → Edit facilities.json → Commit to Git → Auto-deploy
2. Update styling/branding → Edit Tailwind config → Deploy
3. Add new feature → Create spec → Develop → Test → Deploy via Git push

### Support & Documentation

- **User Guide**: In-app tooltips and help modals
- **Technical Docs**: README.md and CLAUDE.md for developers
- **Business Docs**: This spec + roadmap for stakeholders
- **Issue Tracking**: GitHub Issues for bugs and feature requests

---

## 12. Legal & Compliance

### Data Usage

- **Public Data Only**: All data sourced from publicly available Google Maps
- **No PII Collected**: No user accounts, no personal information
- **API Terms Compliance**: Follow Google Maps API terms of service
- **Privacy**: No cookies, no tracking, no data collection

### Intellectual Property

- **Open Source Dependencies**: All libraries MIT or similar permissive licenses
- **Custom Code**: Owned by Pickleball Clubhouse Chicago
- **Branding**: Overdrive brand guidelines applied where applicable

---

## 13. Appendix: Technical Stack Summary

**Frontend**:
- React 19 + TypeScript 5.9
- Vite 7.1 (build tool)
- Tailwind CSS 3.4 (styling)
- Recharts 3.2 (visualizations)

**Data Layer**:
- Static JSON files (facilities.json)
- localStorage for caching
- Google Maps Places API (popular times)

**Export Libraries**:
- PapaParse (CSV)
- html2canvas (PNG)
- jsPDF (PDF)

**Deployment**:
- Vercel (hosting)
- GitHub (version control + auto-deploy)
- Vercel Edge Network (CDN)

**Development**:
- Spec Kit (feature planning & documentation)
- ESLint + TypeScript (code quality)
- Manual QA (testing)

---

**Document Version**: 2.0 (Spec Kit format)
**Original PRD**: [`PRD_COMPARISON_GRID.md`](../../PRD_COMPARISON_GRID.md)
**Master Roadmap**: [`roadmap.md`](./roadmap.md)
**Status**: Active Development - Phase 2 Starting
