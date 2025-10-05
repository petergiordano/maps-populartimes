# Product Requirements Document: Pickleball Facility Comparison Grid

## 1. Overview

### 1.1 Product Vision
A web-based Single Page Application (SPA) that displays popular times data for multiple pickleball facilities in a side-by-side comparison grid format, enabling users to quickly identify traffic patterns, peak hours, and compare facilities against each other.

### 1.2 Goals
- Enable quick visual comparison of traffic patterns across multiple pickleball facilities
- Identify which facilities are busiest during specific days/times
- Discover facilities with similar or different traffic patterns
- Provide an intuitive, interactive interface for toggling facilities on/off
- Deploy as a static SPA on Vercel

### 1.3 Non-Goals (Future Versions)
- Real-time data updates
- User authentication
- Mobile app version
- Clustering/ML-based pattern analysis
- Historical trend analysis

---

## 2. User Stories

### 2.1 Primary User Stories
1. **As a user**, I want to see all configured pickleball facilities in a grid layout so I can compare their traffic patterns at a glance
2. **As a user**, I want to toggle individual facilities on/off so I can focus on specific comparisons
3. **As a user**, I want to see mini popularity graphs for each day of the week so I can identify daily patterns
4. **As a user**, I want to configure which facilities to track via a JSON file so I can customize my analysis
5. **As a user**, I want the page to load quickly and work offline (after initial data fetch) so I have a smooth experience

### 2.2 Secondary User Stories
6. **As a user**, I want to see facility metadata (name, address, rating) so I have context
7. **As a user**, I want to identify peak hours visually (color coding) so I can quickly spot busy times
8. **As a user**, I want to sort facilities by different criteria (name, location, average popularity) so I can organize my view
9. **As a user**, I want to hover over graphs to see exact popularity values so I can get precise data

---

## 3. Functional Requirements

### 3.1 Configuration System

#### 3.1.1 Facilities Configuration File (`facilities.json`)
```json
{
  "facilities": [
    {
      "id": "facility-1",
      "name": "XYZ Pickleball Club",
      "placeId": "ChIJ...",  // Google Maps Place ID
      "address": "123 Main St, Chicago, IL",
      "coordinates": {
        "lat": 41.8781,
        "lng": -87.6298
      },
      "enabled": true
    },
    {
      "id": "facility-2",
      "name": "ABC Sports Center",
      "placeId": "ChIJ...",
      "address": "456 Oak Ave, Evanston, IL",
      "coordinates": {
        "lat": 42.0451,
        "lng": -87.6877
      },
      "enabled": true
    }
  ]
}
```

**Requirements:**
- JSON file must be human-readable and easy to edit
- Each facility must have unique ID
- Place ID is required for API lookup
- `enabled` field determines default visibility
- Support for 20+ facilities in configuration

#### 3.1.2 App Configuration (`config.json`)
```json
{
  "googleMapsApiKey": "YOUR_API_KEY",
  "weekStartDay": "monday",  // or "sunday"
  "refreshInterval": null,    // null = manual only, number = auto-refresh in ms
  "theme": "light"            // light or dark
}
```

### 3.2 Data Fetching

#### 3.2.1 Initial Load
- Read `facilities.json` and `config.json`
- Fetch popular times data for all enabled facilities using Google Maps API
- Cache results in browser localStorage with timestamp
- Display loading states for each facility

#### 3.2.2 Error Handling
- If API call fails for a facility, display error message in its grid row
- Show "No data available" for facilities without popular times
- Continue loading other facilities even if one fails
- Retry mechanism with exponential backoff

#### 3.2.3 Caching Strategy
- Cache API responses in localStorage for 24 hours
- Add "Refresh Data" button to force new API calls
- Display last updated timestamp
- Clear cache option in settings

### 3.3 Comparison Grid Layout

#### 3.3.1 Grid Structure
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     Pickleball Facility Traffic Comparison                       │
│  Last Updated: Jan 5, 2025 3:45 PM          [Refresh Data] [⚙️ Settings]       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  □ Show All  □ Hide All   Sort by: [Name ▼]   Filter: [____________]          │
├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────────────┤
│Facility│  Mon   │  Tue   │  Wed   │  Thu   │  Fri   │  Sat   │  Sun   │ Actions│
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│☑ XYZ   │[graph] │[graph] │[graph] │[graph] │[graph] │[graph] │[graph] │  👁️   │
│Lincoln │        │        │        │        │        │        │        │        │
│Park    │        │        │        │        │        │        │        │        │
│⭐4.5   │        │        │        │        │        │        │        │        │
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│☑ ABC   │[graph] │[graph] │[graph] │[graph] │[graph] │[graph] │[graph] │  👁️   │
│Wicker  │        │        │        │        │        │        │        │        │
│Park    │        │        │        │        │        │        │        │        │
│⭐4.2   │        │        │        │        │        │        │        │        │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

#### 3.3.2 Column Specifications

**Facility Column (Fixed Left)**
- Width: 200px (fixed)
- Content:
  - Checkbox (toggle visibility)
  - Facility name (bold, 16px)
  - Location/neighborhood (gray, 12px)
  - Star rating (if available)
  - Sticky/fixed during horizontal scroll

**Day Columns (Mon-Sun)**
- Width: 140px each
- Headers show day name
- Content: Mini line graph (120px × 80px)
- Horizontal scrollable if needed

**Actions Column (Fixed Right)**
- Width: 80px
- Quick view button (opens detailed modal)
- Link to Google Maps
- Sticky/fixed during horizontal scroll

#### 3.3.3 Mini Graph Specifications

Each mini graph must:
- Display 24 hours (0-23) on X-axis
- Display popularity (0-100) on Y-axis
- Use line chart with area fill
- Color scheme:
  - Low (0-33): Green (#22c55e)
  - Medium (34-66): Yellow (#eab308)
  - High (67-100): Red (#ef4444)
- Show peak hour marker (small dot)
- Responsive tooltips on hover showing:
  - Hour (e.g., "2:00 PM")
  - Popularity value (e.g., "75/100")
- Smooth curve interpolation
- Grid lines for readability

### 3.4 Interactive Features

#### 3.4.1 Toggle Facilities
- Checkbox in facility column
- Clicking checkbox hides/shows entire row
- State persists in localStorage
- "Show All" / "Hide All" bulk actions in header
- Smooth CSS transition when toggling (300ms fade)

#### 3.4.2 Sorting
Dropdown with options:
- Name (A-Z / Z-A)
- Location (A-Z / Z-A)
- Average Popularity (High to Low / Low to High)
- Peak Hour (Earliest to Latest)
- Rating (High to Low)

#### 3.4.3 Filtering
- Text search box filters facility names and locations
- Real-time filtering as user types
- Clear filter button (X icon)
- Case-insensitive matching

#### 3.4.4 Detailed View Modal
Clicking "View Details" icon opens modal with:
- Full facility information
- Large 7-day heatmap
- Weekly comparison chart
- Weekday vs Weekend analysis
- Peak hours summary
- Close button (X) and ESC key support

### 3.5 Responsive Design

#### 3.5.1 Desktop (>1200px)
- Show all columns
- Fixed facility and actions columns
- Horizontal scroll for day columns if needed

#### 3.5.2 Tablet (768px - 1200px)
- Scroll day columns horizontally
- Maintain fixed facility column
- Reduce graph sizes slightly (100px × 60px)

#### 3.5.3 Mobile (<768px)
- Stack vertically (card layout)
- Each facility becomes a card
- Days shown in tabs or accordion
- Swipe between days

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Frontend Framework:** React 18+ with TypeScript
- Component-based architecture
- Type safety for data structures
- Easy deployment to Vercel

**Charting Library:** Chart.js or Recharts
- Lightweight and performant
- Good React integration
- Customizable styling

**State Management:** React Context + useReducer
- No need for Redux (avoid over-engineering)
- Global state for facilities data
- Local state for UI interactions

**Styling:** Tailwind CSS
- Utility-first approach
- Responsive design built-in
- Easy theming

**Build Tool:** Vite
- Fast development server
- Optimized production builds
- Great TypeScript support

### 4.2 Project Structure

```
populartimes/
├── frontend/                    # React SPA
│   ├── public/
│   │   ├── facilities.json      # User-editable facility list
│   │   └── config.json          # App configuration
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComparisonGrid/
│   │   │   │   ├── ComparisonGrid.tsx
│   │   │   │   ├── FacilityRow.tsx
│   │   │   │   ├── DayColumn.tsx
│   │   │   │   ├── MiniGraph.tsx
│   │   │   │   └── ComparisonGrid.css
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── SortControls.tsx
│   │   │   │   └── FilterControls.tsx
│   │   │   ├── DetailModal/
│   │   │   │   ├── DetailModal.tsx
│   │   │   │   └── DetailModal.css
│   │   │   └── LoadingStates/
│   │   │       ├── SkeletonRow.tsx
│   │   │       └── ErrorRow.tsx
│   │   ├── services/
│   │   │   ├── popularTimesApi.ts    # API calls
│   │   │   ├── cacheService.ts       # localStorage caching
│   │   │   └── configService.ts      # Load config files
│   │   ├── types/
│   │   │   ├── Facility.ts
│   │   │   ├── PopularTimesData.ts
│   │   │   └── Config.ts
│   │   ├── hooks/
│   │   │   ├── useFacilities.ts      # Fetch and manage facilities
│   │   │   ├── useSort.ts            # Sorting logic
│   │   │   └── useFilter.ts          # Filter logic
│   │   ├── context/
│   │   │   └── FacilitiesContext.tsx
│   │   ├── utils/
│   │   │   ├── chartHelpers.ts
│   │   │   └── dateHelpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json               # Vercel deployment config
├── backend/                      # Optional API layer (Python)
│   ├── api/
│   │   └── fetch_popular_times.py    # Serverless function
│   └── requirements.txt
├── chicago_lookup.py             # Existing CLI tool
├── visualizer.py                 # Existing visualization module
└── README.md
```

### 4.3 Component Architecture

#### 4.3.1 Component Hierarchy
```
<App>
  <FacilitiesProvider>
    <Header>
      <SortControls />
      <FilterControls />
      <RefreshButton />
    </Header>
    <ComparisonGrid>
      <GridHeader />
      {facilities.map(facility => (
        <FacilityRow key={facility.id}>
          <FacilityInfo />
          <DayColumn day="monday">
            <MiniGraph data={...} />
          </DayColumn>
          {/* ...more day columns */}
          <ActionsColumn />
        </FacilityRow>
      ))}
    </ComparisonGrid>
    <DetailModal />
  </FacilitiesProvider>
</App>
```

#### 4.3.2 Key Components

**ComparisonGrid.tsx**
- Main container component
- Manages grid layout
- Handles bulk actions (show all, hide all)
- Renders facility rows

**FacilityRow.tsx**
- Represents single facility
- Props: facility data, visibility state, toggle handler
- Manages row-level interactions
- Animates show/hide transitions

**MiniGraph.tsx**
- Reusable chart component
- Props: hourly data array, color scheme, size
- Implements hover tooltips
- Optimized for performance (memoized)

**DetailModal.tsx**
- Full-screen modal overlay
- Renders detailed visualizations from existing `visualizer.py` logic
- Close on backdrop click or ESC key

### 4.4 Data Flow

```
1. App loads → Read config.json & facilities.json
2. For each enabled facility:
   a. Check localStorage cache
   b. If cached and fresh → use cached data
   c. If not cached or stale → fetch from API
   d. Store in cache
3. Update context state with facility data
4. ComparisonGrid renders based on context
5. User interactions (toggle, sort, filter) update local state
6. Local state changes trigger re-render of affected components
```

### 4.5 API Integration

#### 4.5.1 Option A: Direct Client-Side Calls
- Pros: Simpler architecture, no backend needed
- Cons: API key exposed in frontend, CORS issues
- Implementation: Use existing `populartimes` library via serverless function

#### 4.5.2 Option B: Serverless Backend (Recommended)
- Create Vercel serverless function (`/api/popular-times`)
- Function reads facilities.json
- Calls Google Maps API server-side
- Returns aggregated data to frontend
- API key stored in Vercel environment variables

**Endpoint Spec:**
```
GET /api/popular-times?placeId=ChIJ...

Response:
{
  "placeId": "ChIJ...",
  "name": "XYZ Pickleball Club",
  "address": "123 Main St",
  "rating": 4.5,
  "ratingCount": 120,
  "currentPopularity": 45,
  "popularTimes": [
    {
      "day": 0,  // Monday
      "data": [0, 0, 0, 5, 10, 20, ..., 0]  // 24 hours
    },
    // ...more days
  ],
  "cachedAt": "2025-01-05T15:30:00Z"
}
```

### 4.6 Performance Optimization

1. **Code Splitting**
   - Lazy load DetailModal component
   - Split vendor bundles

2. **Memoization**
   - Memoize MiniGraph component (React.memo)
   - Use useMemo for expensive calculations
   - Use useCallback for event handlers

3. **Virtual Scrolling**
   - If >50 facilities, implement virtual scrolling
   - Use react-window or react-virtualized

4. **Image Optimization**
   - Use SVG for graphs where possible
   - Lazy load images in detail modal

5. **Bundle Size**
   - Tree-shake unused code
   - Minimize dependencies
   - Use dynamic imports

---

## 5. User Interface Design

### 5.1 Color Scheme

**Light Theme (Default)**
- Background: #ffffff
- Secondary BG: #f9fafb
- Text: #111827
- Border: #e5e7eb
- Primary: #3b82f6
- Success: #22c55e
- Warning: #eab308
- Danger: #ef4444

**Dark Theme**
- Background: #1f2937
- Secondary BG: #111827
- Text: #f9fafb
- Border: #374151
- Primary: #60a5fa
- Success: #4ade80
- Warning: #fbbf24
- Danger: #f87171

### 5.2 Typography
- Font Family: Inter, system-ui, sans-serif
- Headings: 600 weight
- Body: 400 weight
- Facility Names: 16px, 600 weight
- Locations: 12px, 400 weight
- Graph Labels: 10px

### 5.3 Spacing
- Grid padding: 16px
- Row spacing: 8px
- Cell padding: 12px
- Graph margins: 8px

### 5.4 Interactions

**Hover States**
- Facility row: background highlight (#f3f4f6)
- Checkbox: scale(1.1)
- Graphs: show tooltip, highlight data point
- Buttons: opacity 0.8

**Active States**
- Checkbox checked: blue background
- Selected sort: blue text
- Active filter: blue border

**Loading States**
- Skeleton screens for initial load
- Pulse animation
- Progress bar for bulk refresh

**Error States**
- Red border around failed facility row
- Error message with retry button
- Toast notification for general errors

---

## 6. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up React + TypeScript + Vite project
- [ ] Install dependencies (Tailwind, Chart.js, etc.)
- [ ] Create basic project structure
- [ ] Implement config file loading
- [ ] Set up TypeScript types

### Phase 2: Data Layer (Week 1)
- [ ] Create popularTimesApi service
- [ ] Implement cacheService with localStorage
- [ ] Build FacilitiesContext
- [ ] Test API integration with sample data
- [ ] Error handling and retry logic

### Phase 3: Core UI (Week 2)
- [ ] Build ComparisonGrid component
- [ ] Implement FacilityRow component
- [ ] Create MiniGraph component with Chart.js
- [ ] Add grid header with day labels
- [ ] Responsive grid layout

### Phase 4: Interactions (Week 2)
- [ ] Toggle facility visibility
- [ ] Implement sorting functionality
- [ ] Add text filtering
- [ ] Show All / Hide All actions
- [ ] Persist UI state in localStorage

### Phase 5: Detail Modal (Week 3)
- [ ] Create DetailModal component
- [ ] Integrate existing visualization code
- [ ] Add modal animations
- [ ] Keyboard navigation (ESC to close)

### Phase 6: Polish & Deploy (Week 3)
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Performance optimization
- [ ] Responsive design testing
- [ ] Deploy to Vercel
- [ ] Documentation

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Component rendering tests
- Data transformation functions
- Cache service logic
- Sorting/filtering algorithms

### 7.2 Integration Tests
- API integration
- Context state management
- Component interactions
- localStorage persistence

### 7.3 E2E Tests (Optional)
- Full user flows
- Toggle, sort, filter interactions
- Modal open/close
- Data refresh

### 7.4 Manual Testing Checklist
- [ ] Load with 0 facilities
- [ ] Load with 1 facility
- [ ] Load with 20+ facilities
- [ ] Test with missing data
- [ ] Test with API errors
- [ ] Test all sort options
- [ ] Test filtering edge cases
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Test with slow network

---

## 8. Deployment

### 8.1 Vercel Configuration

**vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "env": {
    "VITE_GOOGLE_MAPS_API_KEY": "@google-maps-api-key"
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### 8.2 Environment Variables
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `NODE_ENV` - production/development

### 8.3 Build Process
```bash
npm run build    # Creates optimized production build
npm run preview  # Preview production build locally
vercel deploy    # Deploy to Vercel
```

### 8.4 Continuous Deployment
- Connect GitHub repository to Vercel
- Auto-deploy on push to main branch
- Preview deployments for pull requests

---

## 9. User Documentation

### 9.1 Configuration Guide

**How to Add a Pickleball Facility:**

1. Find the facility on Google Maps
2. Get the Place ID:
   - Right-click on the location
   - Copy the URL
   - Extract the ID (starts with "ChIJ")
3. Edit `public/facilities.json`:
```json
{
  "id": "unique-id",
  "name": "Facility Name",
  "placeId": "ChIJ...",
  "address": "Full address",
  "coordinates": {
    "lat": 41.xxxx,
    "lng": -87.xxxx
  },
  "enabled": true
}
```
4. Save and refresh the app

### 9.2 Feature Guide

**Toggling Facilities:**
- Click checkbox next to facility name
- Use "Show All" / "Hide All" for bulk actions

**Sorting:**
- Use dropdown in header
- Click column headers (future feature)

**Viewing Details:**
- Click eye icon in Actions column
- Press ESC to close modal

**Refreshing Data:**
- Click "Refresh Data" button
- Data is cached for 24 hours

---

## 10. Future Enhancements (V2+)

### 10.1 Advanced Features
- [ ] Export comparison as PNG/PDF
- [ ] Share comparison view (generate URL)
- [ ] Save custom views/presets
- [ ] Compare specific time ranges
- [ ] Overlay weather data
- [ ] Peak hour heatmap overlay
- [ ] Clustering analysis (auto-group similar facilities)

### 10.2 Analytics
- [ ] Track most-viewed facilities
- [ ] Usage statistics
- [ ] Popular comparison sets

### 10.3 Collaboration
- [ ] Multi-user support
- [ ] Shared facility lists
- [ ] Comments/notes on facilities

### 10.4 Mobile App
- [ ] React Native version
- [ ] Push notifications for peak times
- [ ] Location-based suggestions

---

## 11. Success Metrics

### 11.1 Launch Criteria
- [ ] Load time < 3 seconds
- [ ] Support 20+ facilities without performance issues
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive
- [ ] Zero critical bugs

### 11.2 User Engagement (Post-Launch)
- Time on page
- Number of facilities toggled
- Modal open rate
- Sort/filter usage
- Return visitor rate

---

## 12. Open Questions

1. **Data Update Frequency**: Should we auto-refresh data, or manual only?
   - **Decision**: Manual only for V1, add auto-refresh in V2

2. **Max Facilities**: What's the upper limit we should support?
   - **Decision**: Target 50 facilities, optimize for 20

3. **Historical Data**: Should we store historical snapshots?
   - **Decision**: Not in V1, consider for V2

4. **Authentication**: Do we need user accounts?
   - **Decision**: Not in V1, anonymous usage only

5. **API Rate Limiting**: How to handle Google Maps API limits?
   - **Decision**: Aggressive caching (24h), warn users of limits

---

## 13. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Google Maps API rate limits | High | Medium | Cache data for 24h, warn users |
| No popular times data available | Medium | High | Show "No data" gracefully, allow manual entry |
| Poor performance with many facilities | Medium | Low | Virtual scrolling, lazy loading |
| API key exposure | High | Medium | Use serverless backend |
| Browser compatibility issues | Low | Low | Test on major browsers, use polyfills |

---

## Appendix A: Sample Data Structure

```typescript
interface Facility {
  id: string;
  name: string;
  placeId: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  enabled: boolean;
}

interface PopularTimesData {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  ratingCount?: number;
  currentPopularity?: number;
  popularTimes: DayData[];
  timeSpent?: string;
  cachedAt: string;
}

interface DayData {
  day: number;  // 0-6 (Mon-Sun)
  data: number[];  // Array of 24 hourly values (0-100)
}
```

---

## Appendix B: Wireframe References

[Wireframes would be included here - ASCII diagrams provided in Section 3.3.1]

---

**Document Version:** 1.0
**Last Updated:** January 5, 2025
**Author:** Product Team
**Status:** Draft - Pending Approval
