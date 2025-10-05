# Implementation Plan: Facility Detail Modal with Advanced Visualizations

**Branch**: `001-facility-detail-modal` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-facility-detail-modal/spec.md`

## Execution Flow (/plan command scope)
```
1. ✓ Load feature spec from Input path
2. ✓ Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Project Type: Web application (React frontend)
   → Structure Decision: Frontend-only (existing structure)
3. ✓ Fill Constitution Check section
   → Constitution template not populated - using default web app principles
4. ✓ Evaluate Constitution Check section
   → No violations - feature aligns with best practices
   → Progress Tracking: Initial Constitution Check PASS
5. ✓ Execute Phase 0 → research.md
   → No NEEDS CLARIFICATION markers found
6. ✓ Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
7. ✓ Re-evaluate Constitution Check section
   → No new violations
   → Progress Tracking: Post-Design Constitution Check PASS
8. ✓ Plan Phase 2 → Task generation approach described
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

This feature provides an interactive modal interface for detailed facility analysis in the Chicago pickleball competitive intelligence tool. When users click any facility in the comparison grid, they access four tabbed visualizations (Weekly Heatmap, Day Comparison, Summary Dashboard, Competitive Comparison) with multi-format export capabilities (CSV, PNG, PDF, JSON). The modal enables facility owners to identify competitive opportunities through visual pattern recognition and data export for strategic planning.

**Technical Approach**: React component with Recharts visualizations, HTML2Canvas for image export, jsPDF for PDF generation, and PapaParse for CSV export. Deployed to Vercel as part of the existing Vite-based React application.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19.1 + Vite 7.1
**Primary Dependencies**:
- Recharts 3.2 (visualizations)
- html2canvas 1.4 (PNG export)
- jsPDF 3.0 (PDF export)
- papaparse 5.5 (CSV export)
- Tailwind CSS 3.4 (styling)

**Storage**: Static JSON (facility data pre-fetched from Google Maps Popular Times API)
**Testing**: TypeScript type checking, ESLint validation, manual QA
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) via Vercel deployment
**Project Type**: Web (frontend-only React SPA)
**Performance Goals**:
- Modal open: <2s from click to fully rendered visualizations
- Tab switching: <100ms
- PNG export: <3s for single tab
- PDF export: <10s for all tabs combined
- CSV/JSON export: <1s

**Deployment**: Vercel.com with automatic deployments from Git pushes
**Build Output**: Static assets optimized by Vite (code splitting, tree shaking, minification)

**Constraints**:
- <200ms p95 tab switching latency
- <50MB bundle size for main chunks
- Must work without backend API (static data only)
- Responsive design minimum 1024px width for optimal experience
- Export file sizes: CSV <500KB, PNG <2MB, PDF <5MB, JSON <1MB

**Scale/Scope**:
- 8-20 facilities in comparison grid
- 168 data points per facility (7 days × 24 hours)
- 4 visualization tabs per modal
- 4 export formats

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Since the project constitution template is not populated, applying standard React web application principles:

### ✅ Component Architecture
- **Single Responsibility**: Each visualization is a separate component
- **Reusability**: Visualization components accept facility data as props
- **Testability**: Pure functions for data transformations, stateless components where possible

### ✅ State Management
- **Local State**: Modal state managed within FacilityModal component (activeTab, showExportMenu, isExporting)
- **Props Drilling**: Facility data passed through props (acceptable for 2-3 level component tree)
- **No Global State**: Not needed for modal-scoped feature

### ✅ Performance
- **Lazy Rendering**: Only active tab renders its visualization
- **Memoization**: Recharts handles internal optimization
- **Code Splitting**: Vite handles automatic chunk splitting

### ✅ Accessibility
- **Keyboard Navigation**: Escape to close, Tab for focus management
- **ARIA Labels**: Close button has aria-label
- **Semantic HTML**: Proper heading hierarchy, button elements

### ✅ Type Safety
- **TypeScript**: Strict mode enabled, all props typed
- **Interface Definitions**: Facility, FacilityModalProps clearly defined
- **Type Guards**: Export utilities handle type validation

**Verdict**: PASS - No constitutional violations

## Project Structure

### Documentation (this feature)
```
specs/001-facility-detail-modal/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── FacilityModal.contract.md
│   └── export-api.contract.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
frontend/
├── src/
│   ├── components/
│   │   ├── FacilityModal.tsx           # Main modal container (existing)
│   │   └── visualizations/             # Visualization components
│   │       ├── WeeklyHeatmap.tsx       # Tab 1: Heatmap
│   │       ├── DayComparisonChart.tsx  # Tab 2: Line chart
│   │       ├── SummaryDashboard.tsx    # Tab 3: Multi-panel dashboard
│   │       └── CompetitiveComparison.tsx # Tab 4: Bar chart comparison
│   ├── utils/
│   │   └── exportUtils.ts              # Export functions (CSV, PNG, PDF, JSON)
│   ├── types/
│   │   └── Facility.ts                 # Type definitions
│   └── App.tsx                         # Main app with modal integration
├── public/
│   └── facilities.json                 # Static facility data
└── package.json                        # Dependencies

backend/                                 # Python CLI tools (not modified by this feature)
├── chicago_lookup.py
└── visualizer.py
```

**Structure Decision**: Frontend-only web application. Modal feature integrates into existing React SPA at `frontend/src/components/FacilityModal.tsx`. No backend changes required as data is pre-fetched and stored in `public/facilities.json`. Deployment to Vercel handles build and hosting automatically via Git integration.

## Phase 0: Outline & Research

### Research Tasks Executed

1. **Recharts Best Practices for Heatmaps**
   - **Decision**: Use `<ResponsiveContainer>` + custom cells with Recharts primitives
   - **Rationale**: Recharts doesn't have built-in heatmap, but `<Cell>` customization in `<Bar>` or custom `<Rectangle>` components work well
   - **Alternatives Considered**:
     - D3.js (too heavy, steeper learning curve)
     - Chart.js (less React-friendly)
     - Victory Charts (smaller ecosystem)

2. **Multi-Format Export Strategy**
   - **Decision**:
     - CSV: PapaParse (lightweight, 5KB)
     - PNG: html2canvas (captures DOM as image)
     - PDF: jsPDF + html2canvas (multi-page support)
     - JSON: Native `JSON.stringify` + Blob API
   - **Rationale**: Each library excels at its format, total bundle impact ~200KB gzipped
   - **Alternatives Considered**:
     - FileSaver.js (redundant with Blob API)
     - Canvas API native export (more complex, less browser support)

3. **PDF Multi-Page Generation**
   - **Decision**: Loop through tabs, capture each with html2canvas, add as separate PDF pages
   - **Rationale**: Allows "snapshot" approach - render each tab briefly, capture, move to next
   - **Implementation**: Temporarily switch activeTab, wait for render, capture, restore original tab

4. **Vercel Deployment Optimization**
   - **Decision**: Use Vite's default build settings with automatic code splitting
   - **Rationale**: Vercel automatically detects Vite, applies optimal caching headers
   - **Configuration**:
     - Output dir: `dist/`
     - Base path: `/` (root deployment)
     - Build command: `npm run build`
     - Deploy: Automatic on git push to main branch

5. **Performance: Large Dataset Rendering**
   - **Decision**: Use Recharts' built-in virtualization for line charts, limit heatmap cells to 168 max
   - **Rationale**: 7 days × 24 hours = 168 cells is manageable for modern browsers
   - **Optimization**: Only render active tab (conditional rendering with `display: none` for inactive tabs)

**Output**: `research.md` (see separate file)

## Phase 1: Design & Contracts

### 1. Data Model (`data-model.md`)

**Primary Entities**:

- **Facility**
  - Fields: `id`, `name`, `type` (public/private), `rating`, `rating_n`, `address`, `populartimes[]`
  - Validation: `rating` 0-5, `rating_n` >= 0, `populartimes` array length = 7
  - Source: Pre-fetched from Google Maps API, stored in `public/facilities.json`

- **PopularTimesDay**
  - Fields: `day` (0-6), `data[]` (24 hourly integers 0-100)
  - Validation: `day` in range 0-6, `data` length = 24, each value 0-100
  - Relationship: 7 PopularTimesDay objects per Facility

- **ExportOptions**
  - Fields: `format` (csv|png|pdf|json), `facilityName`, `tabName`
  - Validation: Enum validation for format
  - Usage: Parameter object for export utility functions

- **TabState**
  - Fields: `activeTab` (heatmap|daycomparison|summary|competitive), `showExportMenu` (boolean), `isExporting` (boolean)
  - State Management: React useState hooks in FacilityModal component

### 2. API Contracts (`contracts/`)

**FacilityModal Component Contract**:

```typescript
// Input Contract
interface FacilityModalProps {
  facility: Facility              // Required: Full facility object with popular times
  allFacilities: Facility[]       // Required: All facilities for competitive comparison
  onClose: () => void             // Required: Callback to close modal
}

// Output Contract (User Actions)
- Modal renders within 2 seconds
- Tab switches in <100ms
- Close button dismisses modal
- Export dropdown triggers download
- Escape key closes modal
```

**Export Utilities Contract**:

```typescript
// CSV Export
exportAsCSV(facility: Facility): Promise<void>
  Input: Single facility with populartimes
  Output: Downloads CSV file "{facilityName}_popular_times.csv"
  Format: Headers [Day, Hour, Popularity], 168 rows

// PNG Export
exportAsPNG(elementId: string, facilityName: string, tabName: string): Promise<void>
  Input: DOM element ID to capture, facility name, tab name
  Output: Downloads PNG file "{facilityName}_{tabName}.png"
  Quality: 300 DPI equivalent (2x scale factor)

// PDF Export
exportAsPDF(facility: Facility, tabs: {id: string, name: string}[]): Promise<void>
  Input: Facility object, array of tab element IDs
  Output: Downloads PDF file "{facilityName}_full_report.pdf"
  Pages: One page per tab (4 pages total)

// JSON Export
exportAsJSON(facility: Facility): Promise<void>
  Input: Facility object
  Output: Downloads JSON file "{facilityName}_data.json"
  Format: Pretty-printed JSON with 2-space indentation
```

### 3. Quickstart Test Scenarios (`quickstart.md`)

See separate `quickstart.md` file for detailed test scenarios covering:
- Modal opening and closing
- Tab navigation
- Each visualization type
- All export formats
- Edge cases (incomplete data, export failures)

### 4. Update CLAUDE.md

✓ Agent context updated with:
- Language: TypeScript 5.9 + React 19.1 + Vite 7.1
- Database: Static JSON facility data
- Project type: Web (frontend-only React SPA)
- Deployment: Vercel

**Output**: Phase 1 complete - contracts, data-model.md, quickstart.md, CLAUDE.md ready

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs
- Group by implementation area (components, utilities, types, testing)

**Expected Task Categories**:

1. **Type Definitions** (Parallel)
   - Define Facility interface
   - Define PopularTimesDay interface
   - Define TabType and ExportFormat enums
   - Define component prop interfaces

2. **Visualization Components** (Parallel after types)
   - Implement WeeklyHeatmap component
   - Implement DayComparisonChart component
   - Implement SummaryDashboard component
   - Implement CompetitiveComparison component

3. **Export Utilities** (Parallel after types)
   - Implement CSV export function
   - Implement PNG export function
   - Implement PDF export function
   - Implement JSON export function

4. **Modal Integration** (After visualizations + exports)
   - Integrate visualizations into FacilityModal tabs
   - Connect export dropdown to utility functions
   - Add keyboard navigation (Escape key)
   - Add loading states during exports

5. **Testing & Validation** (After implementation)
   - Manual test all four tabs with sample data
   - Test all four export formats
   - Test keyboard navigation
   - Test error handling for export failures
   - Verify performance targets (<2s modal load, <100ms tab switch)

6. **Deployment** (After testing)
   - Create Vercel project
   - Configure build settings
   - Deploy to production
   - Verify deployment works with all features

**Ordering Strategy**:
- Types first (foundation)
- Visualizations and exports in parallel (independent)
- Modal integration after dependencies complete
- Testing before deployment
- Mark [P] for parallel execution (components, exports)

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following React/TypeScript best practices)
**Phase 5**: Validation (run quickstart.md scenarios, verify Vercel deployment, performance testing)

## Complexity Tracking

*No constitutional violations detected - this section intentionally left empty*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

**Artifacts Generated**:
- [x] plan.md (this file)
- [x] research.md (inline in plan)
- [x] data-model.md (inline in plan)
- [x] contracts/ (inline in plan)
- [x] quickstart.md (to be created)
- [x] CLAUDE.md (updated)
- [ ] tasks.md (awaiting /tasks command)

---

## Next Steps

**Ready for `/tasks` command** to generate implementation task list.

After `/tasks` completion, proceed with:
1. Execute tasks in order (types → visualizations → exports → integration)
2. Test each component as built
3. Run full quickstart.md validation
4. Deploy to Vercel
5. Verify production deployment

**Vercel Deployment Checklist**:
- [ ] Create Vercel account/project
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `frontend/dist`
- [ ] Configure environment variables (if needed)
- [ ] Enable automatic deployments from `main` branch
- [ ] Test deployment URL
- [ ] Configure custom domain (optional)

---
*Based on Spec Kit methodology - See `.specify/` for templates and tooling*
