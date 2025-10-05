# Quickstart: Facility Detail Modal

**Feature**: Facility Detail Modal with Advanced Visualizations
**Branch**: 001-facility-detail-modal
**Date**: 2025-10-05

## Purpose

This quickstart guide provides manual test scenarios to validate the facility detail modal feature. Each scenario maps to acceptance criteria from the feature specification and should be executed in order.

## Prerequisites

- Development server running (`npm run dev` in frontend/)
- Browser open to `http://localhost:5173`
- At least 8 facilities loaded in the comparison grid
- Sample facility data with complete popular times (7 days × 24 hours)

## Test Scenarios

### Scenario 1: Modal Opening

**Objective**: Verify modal opens correctly when clicking facility

**Steps**:
1. Navigate to comparison grid homepage
2. Click on any facility row (e.g., "Pickleball Clubhouse Chicago")

**Expected Result**:
- [ ] Modal appears within 2 seconds
- [ ] Modal overlay covers screen with semi-transparent background
- [ ] Facility name appears in header
- [ ] Type badge shows "Public" or "Private"
- [ ] Rating displays with star icon and review count (if available)
- [ ] Four tabs visible: Weekly Heatmap, Day Comparison, Summary, Compare
- [ ] First tab (Weekly Heatmap) is active by default
- [ ] Close button (X) visible in top-right corner

---

### Scenario 2: Tab Navigation

**Objective**: Verify seamless tab switching

**Steps**:
1. With modal open, click "Day Comparison" tab
2. Wait for tab to load
3. Click "Summary" tab
4. Click "Compare" tab
5. Click back to "Weekly Heatmap"

**Expected Result**:
- [ ] Each tab switch completes in <100ms
- [ ] Active tab highlighted with blue underline
- [ ] Previous tab content disappears
- [ ] New tab content appears immediately
- [ ] No console errors
- [ ] No visual glitches or flashing

---

### Scenario 3: Weekly Heatmap Visualization

**Objective**: Verify heatmap displays correctly

**Steps**:
1. Open modal on "Weekly Heatmap" tab
2. Observe the heatmap grid
3. Hover over various cells

**Expected Result**:
- [ ] 7 rows (Monday-Sunday) visible
- [ ] 24 columns (hours 0-23) visible
- [ ] Color gradient: yellow (low) → orange (mid) → red (high)
- [ ] Day labels on Y-axis
- [ ] Hour labels on X-axis
- [ ] Hover shows exact popularity score
- [ ] Hover tooltip readable and positioned correctly
- [ ] Visual hierarchy clear (peak hours stand out)

---

### Scenario 4: Day Comparison Chart

**Objective**: Verify line chart shows daily patterns

**Steps**:
1. Switch to "Day Comparison" tab
2. Observe the line chart
3. Check legend

**Expected Result**:
- [ ] 7 colored lines visible (one per day)
- [ ] X-axis shows hours 0-23
- [ ] Y-axis shows popularity 0-100
- [ ] Each line distinctly colored
- [ ] Legend shows all 7 days with colors
- [ ] Lines smoothly drawn (no jagged artifacts)
- [ ] Can visually identify peak hours per day
- [ ] Hover shows data point values

---

### Scenario 5: Summary Dashboard

**Objective**: Verify multi-panel summary view

**Steps**:
1. Switch to "Summary" tab
2. Review all panels

**Expected Result**:
- [ ] Compact heatmap visible at top
- [ ] Weekday vs Weekend comparison chart present
- [ ] Peak hours by day visualization shown
- [ ] Statistics table displays:
  - [ ] Facility rating
  - [ ] Review count
  - [ ] Peak popularity score
  - [ ] Peak time (day + hour)
  - [ ] Average daily traffic
  - [ ] Busiest day of week
- [ ] Average daily pattern line chart visible
- [ ] All panels fit within viewport (scrollable if needed)

---

### Scenario 6: Competitive Comparison

**Objective**: Verify facility ranking at specific time

**Steps**:
1. Switch to "Compare" tab
2. Select a day using day picker
3. Select an hour using hour slider
4. Observe ranking chart

**Expected Result**:
- [ ] Day selector works (dropdown or buttons)
- [ ] Hour selector works (slider or dropdown)
- [ ] Horizontal bar chart displays all facilities
- [ ] Bars sorted by popularity (highest to lowest)
- [ ] Current facility highlighted (different color/border)
- [ ] Rank displayed (e.g., "3rd out of 8")
- [ ] Facility names readable on Y-axis
- [ ] Popularity values shown on bars or X-axis
- [ ] Chart updates immediately when time changes

---

### Scenario 7: CSV Export

**Objective**: Verify CSV export functionality

**Steps**:
1. With modal open, click "Export" dropdown button
2. Click "CSV/Excel Data" option
3. Check Downloads folder

**Expected Result**:
- [ ] Export completes in <1 second
- [ ] File downloads automatically
- [ ] Filename: `{FacilityName}_popular_times.csv`
- [ ] File size: <500KB
- [ ] Open in Excel/Sheets:
  - [ ] Headers: Day, Hour, Popularity
  - [ ] 168 rows (7 days × 24 hours)
  - [ ] All values present (no blanks unless data missing)
  - [ ] Day column: 0-6 or "Monday"-"Sunday"
  - [ ] Hour column: 0-23
  - [ ] Popularity column: 0-100 integers

---

### Scenario 8: PNG Export

**Objective**: Verify PNG screenshot export

**Steps**:
1. Switch to "Weekly Heatmap" tab
2. Click "Export" → "PNG Image"
3. Check Downloads folder

**Expected Result**:
- [ ] Export completes in <3 seconds
- [ ] Loading indicator appears during export
- [ ] File downloads automatically
- [ ] Filename: `{FacilityName}_Weekly_Heatmap.png`
- [ ] File size: <2MB
- [ ] Open image:
  - [ ] High resolution (readable text)
  - [ ] Full heatmap visible
  - [ ] Colors accurate
  - [ ] No clipping or cropping
  - [ ] Background white (not transparent)

---

### Scenario 9: PDF Export (All Tabs)

**Objective**: Verify multi-page PDF export

**Steps**:
1. With modal open on any tab, click "Export" → "PDF Report"
2. Wait for export to complete (may take 5-10 seconds)
3. Check Downloads folder

**Expected Result**:
- [ ] Export completes in <10 seconds
- [ ] Loading indicator shown during export
- [ ] File downloads automatically
- [ ] Filename: `{FacilityName}_full_report.pdf`
- [ ] File size: <5MB
- [ ] Open PDF:
  - [ ] Page 1: Weekly Heatmap
  - [ ] Page 2: Day Comparison
  - [ ] Page 3: Summary Dashboard
  - [ ] Page 4: Competitive Comparison
  - [ ] All pages readable
  - [ ] Charts/visualizations clear
  - [ ] No overlapping content

---

### Scenario 10: JSON Export

**Objective**: Verify raw data export

**Steps**:
1. Click "Export" → "JSON Data"
2. Check Downloads folder

**Expected Result**:
- [ ] Export completes in <1 second
- [ ] File downloads automatically
- [ ] Filename: `{FacilityName}_data.json`
- [ ] File size: <1MB
- [ ] Open in text editor:
  - [ ] Valid JSON (no syntax errors)
  - [ ] Pretty-printed (2-space indentation)
  - [ ] Contains facility metadata (name, type, rating)
  - [ ] Contains full populartimes array
  - [ ] All 7 days present
  - [ ] Each day has 24-hour data array

---

### Scenario 11: Modal Closing

**Objective**: Verify modal closes properly

**Steps**:
1. With modal open, click the X button in top-right
2. Reopen modal
3. Press Escape key

**Expected Result**:
- [ ] X button closes modal immediately
- [ ] Modal disappears (fade out animation acceptable)
- [ ] Returns to comparison grid
- [ ] Grid still functional after close
- [ ] Escape key also closes modal
- [ ] No console errors
- [ ] No memory leaks (modal fully unmounts)

---

### Scenario 12: Export Error Handling

**Objective**: Verify graceful error handling

**Steps**:
1. Open browser DevTools → Network tab
2. Set network to "Offline" mode
3. Attempt PNG export

**Expected Result**:
- [ ] Loading indicator appears
- [ ] Error message displays: "Failed to export PNG. Please try again."
- [ ] Modal remains open
- [ ] User can retry export
- [ ] No console errors beyond expected network failure

---

### Scenario 13: Incomplete Data Handling

**Objective**: Verify graceful degradation with missing data

**Steps**:
1. Open modal for a facility with partial popular times data (e.g., only 3 days)
2. Review all tabs

**Expected Result**:
- [ ] Modal opens without errors
- [ ] Heatmap shows available days only
- [ ] Missing days indicated (grayed out or message)
- [ ] Day comparison chart shows only available lines
- [ ] Summary dashboard handles missing data gracefully
- [ ] Exports include only available data
- [ ] No "undefined" or "null" values displayed to user

---

### Scenario 14: Multiple Facility Comparison

**Objective**: Verify competitive comparison with 8+ facilities

**Steps**:
1. Ensure grid has 8+ facilities
2. Open modal for mid-ranked facility
3. Go to "Compare" tab
4. Select peak time (e.g., Friday 6pm)

**Expected Result**:
- [ ] All 8+ facilities shown in bar chart
- [ ] Bars sorted correctly (highest to lowest)
- [ ] Current facility highlighted
- [ ] Rank displayed correctly (e.g., "4th out of 10")
- [ ] All facility names visible (scrollable if needed)
- [ ] Chart responsive to window resize

---

### Scenario 15: Performance Validation

**Objective**: Verify performance targets met

**Tools**: Browser DevTools → Performance tab

**Steps**:
1. Record performance profile
2. Click to open modal
3. Stop recording when modal fully loaded
4. Switch between tabs (record each)
5. Trigger PNG export (record)

**Expected Result**:
- [ ] Modal render time: <2 seconds (from click to interactive)
- [ ] Tab switch time: <100ms per switch
- [ ] PNG export time: <3 seconds
- [ ] No layout thrashing (check Performance timeline)
- [ ] No memory leaks (check Memory tab)
- [ ] Frame rate stable 60fps during animations

---

## Regression Tests

After any code changes, re-run these critical paths:

1. **Happy Path**: Open modal → switch all tabs → export CSV → close
2. **Export All**: PNG → PDF → JSON → verify all downloads
3. **Error Path**: Offline mode → attempt export → verify error message
4. **Performance**: Modal load time < 2s, tab switch < 100ms

---

## Known Issues / Limitations

*Document any known limitations discovered during testing*

- [ ] PDF export may timeout if >10 facilities (investigate optimization)
- [ ] PNG quality degrades on ultra-wide monitors (>2560px)
- [ ] Heatmap hover tooltips may clip at screen edges
- [ ] Escape key doesn't work if focus is inside dropdown menu

---

## Sign-Off

**Tested By**: _____________
**Date**: _____________
**Browser**: _____________
**Pass/Fail**: _____________

**Notes**:


---

*This quickstart validates functional requirements FR-001 through FR-036 from spec.md*
