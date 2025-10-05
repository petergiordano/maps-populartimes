# Quick Task Tracker

**🎯 See full roadmap**: [`specs/000-project-overview/roadmap.md`](specs/000-project-overview/roadmap.md)
**📋 Project overview**: [`specs/000-project-overview/spec.md`](specs/000-project-overview/spec.md)

---

## ✅ Recently Completed

- [x] **Feature 001: Facility Detail Modal** - 4 visualization tabs + multi-format export
  - Spec: [`specs/001-facility-detail-modal/`](specs/001-facility-detail-modal/)
  - Completed: 2025-10-05
  - Deployed to Vercel ✓

---

## 🔥 Up Next (Priority Order)

### **Feature 002: "My Facility" Visual Highlighting**
- [ ] Add visual emphasis for Pickleball Clubhouse Chicago in grid (different color/border)
- [ ] Implement "Pin to top" toggle
- [ ] Add "Compare to mine" quick action button
- [ ] Show performance indicator (+/- vs your metrics)
- **Effort**: 1-2 days
- **Start**: After current feature complete

### **Feature 003: Radius Filter & Distance Display**
- [ ] Implement distance calculation from 4242 N. Elston (Haversine formula)
- [ ] Add distance column to grid
- [ ] Create radius filter dropdown (1, 2, 5, 10 miles)
- [ ] Add neighborhood grouping
- [ ] Create "Direct competitors" preset (private clubs <3 miles)
- **Effort**: 3-4 days
- **Start**: After Feature 002

### **Feature 004: Time-Slot Opportunity Heatmap** ⭐ HIGHEST VALUE
- [ ] Build heatmap component: Your facility vs avg competitor per hour/day
- [ ] Implement RED/GREEN color coding (underperform/outperform)
- [ ] Add click handler to show which competitors busy at that time
- [ ] Create gap analysis calculations
- [ ] Build opportunity ranking list
- **Effort**: 5-7 days
- **Start**: After Feature 003

---

## 🧹 Cleanup Tasks

- [ ] Archive or delete `PRD_COMPARISON_GRID.md` (migrated to specs/)
- [ ] Update main README.md to reference new specs/ structure
- [ ] Create CONTRIBUTING.md for future developers
- [ ] Document Vercel deployment process

---

## 💡 Pete's Ideas (Quick Notes)

### Home Screen Improvements
- Show address for each facility (tooltip or column)
- _See Feature 019 in roadmap for full spec_

---

## 📚 Documentation Reference

| Document | Purpose | Link |
|----------|---------|------|
| **Master Roadmap** | All 19 features prioritized | [`specs/000-project-overview/roadmap.md`](specs/000-project-overview/roadmap.md) |
| **Project Spec** | Business goals & user scenarios | [`specs/000-project-overview/spec.md`](specs/000-project-overview/spec.md) |
| **Feature 001** | Facility modal implementation | [`specs/001-facility-detail-modal/`](specs/001-facility-detail-modal/) |
| **CLAUDE.md** | Development context for AI | [`CLAUDE.md`](CLAUDE.md) |

---

## 🚀 Using This Tracker

**To add a new task**:
1. Create a feature spec in `specs/00X-feature-name/`
2. Run Spec Kit `/specify` command
3. Add to roadmap.md
4. Add lightweight checklist here

**To complete a task**:
1. Mark checkbox [x]
2. Move to "Recently Completed" section
3. Update roadmap.md status
4. Create PR if needed

---

*This is a lightweight task tracker. For detailed planning, see specs/ directory.*
*Last updated: 2025-10-05*
