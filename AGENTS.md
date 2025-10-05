# AGENTS.md

A guide for AI coding agents working on the Pickleball Competitive Intelligence Platform.

---

## 🚀 First Steps (New Session)

**ALWAYS run this first when starting a new session:**

**If using Claude Code (recommended):**
```
/status
```

**Or run directly:**
```bash
bash .specify/scripts/bash/status.sh
```

This shows:
- Current git branch and sync status
- Feature progress and completion state
- What you're working on right now
- Recommended next steps
- Links to all documentation

**Then check:**
- `todo.md` - Current tasks (90 lines, quick view)
- `specs/[branch-name]/spec.md` - Current feature requirements
- `specs/000-project-overview/roadmap.md` - Full project roadmap

---

## Project Overview

**Type:** Pickleball facility competitive intelligence web application
**Primary User:** Pickleball Clubhouse Chicago (4242 N. Elston)
**Goal:** Analyze competitor traffic patterns to identify market opportunities

**Architecture:**
- **Frontend (Primary):** React 19 + TypeScript 5.9 + Vite 7.1 + Recharts 3.2
- **Backend (Secondary):** Python CLI tools for data fetching
- **Deployment:** Vercel (automatic on Git push to main)
- **Data:** Static JSON (pre-fetched from Google Maps Popular Times API)

---

## Setup Commands

### Frontend (React SPA)
```bash
cd frontend/
npm install
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # ESLint + TypeScript checks
```

### Backend (Python CLI Tools)
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add GOOGLE_MAPS_API_KEY=your_key to .env

# Run CLI tool
python chicago_lookup.py --lat 41.8788 --lng -87.6359
```

### Git Workflow
```bash
# Check current status (Claude Code users: use /status)
bash .specify/scripts/bash/status.sh

# Start new feature
git checkout -b 00X-feature-name

# Commit with descriptive message
git add .
git commit -m "descriptive message"

# Push to remote
git push -u origin branch-name
```

---

## Code Style

### TypeScript/React
- **Strict mode:** TypeScript strict enabled in tsconfig.json
- **Functional components:** Use function components, not class components
- **Hooks:** useState, useEffect, useMemo, useCallback as appropriate
- **Props typing:** Always define interfaces for component props
- **File naming:** PascalCase for components (FacilityModal.tsx), camelCase for utils
- **Imports:** Organize: React imports → types → components → utils

**Example:**
```typescript
import { useState } from 'react'
import type { Facility } from '../types/Facility'
import WeeklyHeatmap from './visualizations/WeeklyHeatmap'

interface FacilityModalProps {
  facility: Facility
  onClose: () => void
}

export default function FacilityModal({ facility, onClose }: FacilityModalProps) {
  const [activeTab, setActiveTab] = useState<string>('heatmap')
  // ...
}
```

### Python
- **PEP 8:** Follow Python style guide
- **Type hints:** Use where helpful for clarity
- **Docstrings:** Document functions with Google-style docstrings
- **Naming:** snake_case for functions/variables

### General
- **Comments:** Explain "why" not "what"
- **Commit messages:** Descriptive, use present tense ("Add feature" not "Added feature")
- **Line length:** 100 characters for TypeScript, 88 for Python (Black formatter)

---

## Testing Instructions

### Frontend Testing
```bash
cd frontend/

# Type checking
npm run build        # Will fail on type errors

# Linting
npm run lint         # ESLint + TypeScript rules

# Manual testing
npm run dev
# Then follow test scenarios in specs/[feature]/quickstart.md
```

### Manual Test Workflow
1. Check `specs/[current-feature]/quickstart.md` for test scenarios
2. Run dev server: `npm run dev`
3. Execute each test scenario manually
4. Verify acceptance criteria are met
5. Test edge cases (incomplete data, errors, mobile view)

### Before Committing
```bash
# Frontend checks
cd frontend/
npm run lint         # Must pass
npm run build        # Must succeed

# Python checks (if modified)
python -m py_compile chicago_lookup.py
python -m py_compile visualizer.py
```

---

## Development Workflow (Spec Kit Methodology)

### Feature Development Process

**1. Check Status**

**Claude Code:**
```
/status
```

**Terminal:**
```bash
bash .specify/scripts/bash/status.sh
```

**2. Review Current Work**
```bash
cat todo.md                                    # Quick tasks
cat specs/[branch-name]/spec.md                # Requirements
cat specs/[branch-name]/plan.md                # Technical plan (if exists)
cat specs/[branch-name]/tasks.md               # Task list (if exists)
```

**3. Create Feature Documentation (if needed)**

**If no spec exists:**
- Tell user: "This feature needs a specification. I'll run /specify"
- Create `specs/00X-feature-name/spec.md` with business requirements

**If spec exists but no plan:**
- Tell user: "Spec exists. I'll run /plan to create implementation plan"
- Create `specs/00X-feature-name/plan.md` with technical design

**If plan exists but no tasks:**
- Tell user: "Plan exists. I'll run /tasks to generate task list"
- Create `specs/00X-feature-name/tasks.md` with actionable items

**4. Implement**
- Work through tasks in `specs/[branch-name]/tasks.md`
- Update task checkboxes as you complete them
- Reference spec for requirements, plan for architecture

**5. Test**
- Follow test scenarios in `specs/[branch-name]/quickstart.md`
- Verify all acceptance criteria
- Test edge cases

**6. Commit & Push**
- Write descriptive commit message (see commit message format below)
- Include "🤖 Generated with [Claude Code](https://claude.com/claude-code)" footer
- Include "Co-Authored-By: Claude <noreply@anthropic.com>"
- Push to feature branch

---

## Commit Message Format

**Structure:**
```
Title: Short summary (50 chars max)

Body: Detailed explanation of what and why
- Use bullet points for multiple changes
- Explain business value or technical rationale
- Reference spec/plan files when relevant

Technical Details:
- Implementation specifics
- Dependencies added/changed
- Performance considerations

Testing:
- How to verify the change
- Test scenarios covered

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Example:**
```
Add radius filter for competitor distance analysis

Implement geographic filtering to show only facilities within X miles
of Pickleball Clubhouse Chicago (4242 N. Elston), enabling focus on
direct geographic competitors.

Features:
- Distance calculation using Haversine formula
- Filter dropdown: 1, 2, 5, 10 mile radius options
- Distance column in comparison grid
- "Direct competitors" preset (private clubs <3 miles)

Technical Details:
- Added haversine() util function in src/utils/geoUtils.ts
- Extended Facility type with computed distance field
- Filter state managed in ComparisonGrid component

Testing:
- Verified distances accurate within 0.1 mile margin
- All radius options filter correctly
- Distance column sorts properly

See: specs/003-radius-filter/spec.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Pull Request Instructions

### Before Creating PR

**1. Run all checks:**
```bash
cd frontend/
npm run lint         # Must pass
npm run build        # Must succeed
git status           # Verify no unintended changes
```

**2. Verify commits:**
```bash
git log --oneline -5  # Check commit messages are descriptive
```

**3. Test the feature:**
- Follow `specs/[feature]/quickstart.md` test scenarios
- Verify all acceptance criteria from spec.md

### PR Title Format
```
Feature [###]: Short description

Example:
Feature 002: Add "My Facility" visual highlighting
```

### PR Description Template
```markdown
## Feature [###]: [Feature Name]

### What's New
- [Summary of what this PR adds]
- [Key capabilities delivered]

### Spec Reference
- Spec: `specs/[###-feature-name]/spec.md`
- Plan: `specs/[###-feature-name]/plan.md`
- Tasks: `specs/[###-feature-name]/tasks.md`

### Testing Done
- [ ] All quickstart.md scenarios passed
- [ ] ESLint + TypeScript checks pass
- [ ] Production build succeeds
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive verified

### Screenshots (if UI changes)
[Add screenshots]

### Next Steps
[What should be done after this PR merges]
```

---

## Security Considerations

### API Keys
- **NEVER commit `.env` files**
- **NEVER commit API keys** to Git
- Store Google Maps API key in `.env` (backend) or Vercel env vars (frontend)
- `.env` is in `.gitignore` - verify before committing

### Sensitive Data
- No user authentication in V1 (public tool)
- No PII collection
- Popular times data is publicly available from Google Maps
- Static JSON data has no credentials

### Dependencies
- Run `npm audit` periodically in frontend/
- Update dependencies when security patches available
- Review `package-lock.json` changes in PRs

---

## Common Patterns & Conventions

### File Organization
```
frontend/src/
├── components/          # React components
│   ├── ComponentName.tsx
│   └── visualizations/  # Chart components
├── utils/               # Helper functions
│   ├── exportUtils.ts
│   └── geoUtils.ts
├── types/               # TypeScript type definitions
│   └── Facility.ts
└── App.tsx              # Main app component
```

### Component Patterns
- **One component per file**
- **Export default** for main component
- **Named exports** for helper components/types
- **Props interface** always defined above component

### State Management
- **Local state:** useState for component-specific state
- **No global state library** (Redux/Zustand) - not needed yet
- **Props drilling** acceptable for 2-3 levels
- **Consider Context** only if props drilling becomes unwieldy

### Data Patterns
- **Static JSON:** `frontend/public/facilities.json` (facility data)
- **No API calls** in V1 (pre-fetched data)
- **Type safety:** All data structures have TypeScript interfaces

---

## Troubleshooting

### "Where did we leave off?"
**Claude Code:**
```
/status
```

**Terminal:**
```bash
bash .specify/scripts/bash/status.sh  # Shows current state
cat todo.md                           # Shows current tasks
```

### Build Errors
```bash
cd frontend/
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
- Check `frontend/src/types/` for type definitions
- Run `npm run build` to see all type errors
- Reference existing components for patterns

### Git Issues
```bash
git status                    # See current state
git diff                      # See changes
git log --oneline -10         # See recent commits
```

---

## Feature Priorities (Current Roadmap)

**✅ Phase 1 Complete:**
- Feature 001: Facility Detail Modal

**🔥 Phase 2 Critical (Next):**
- Feature 002: "My Facility" Visual Highlighting (1-2 days)
- Feature 003: Radius Filter & Distance Display (3-4 days)
- Feature 004: Time-Slot Opportunity Heatmap ⭐ (5-7 days)

**Full roadmap:** `specs/000-project-overview/roadmap.md`

---

## Documentation Hierarchy

When working on a task, check in this order:

1. **`todo.md`** - Quick task list (90 lines)
2. **`specs/[branch-name]/spec.md`** - Feature requirements
3. **`specs/[branch-name]/plan.md`** - Technical implementation plan
4. **`specs/[branch-name]/tasks.md`** - Actionable work items
5. **`specs/000-project-overview/roadmap.md`** - Full project roadmap
6. **`CLAUDE.md`** - Detailed project context (backend focus)

---

## Deployment

### Vercel Deployment
- **Trigger:** Git push to `main` branch
- **Build command:** `npm run build` (in frontend/)
- **Output directory:** `frontend/dist/`
- **Framework:** Vite (auto-detected)
- **No environment variables** needed (static data)

### Manual Build Test
```bash
cd frontend/
npm run build
npm run preview  # Preview production build locally
```

---

## Key Reminders

1. **ALWAYS start new sessions with:** `/status` (Claude Code) or `bash .specify/scripts/bash/status.sh`
2. **Check `todo.md` first** for current priorities
3. **Read the spec** before implementing (`specs/[branch-name]/spec.md`)
4. **Follow Spec Kit workflow:** spec → plan → tasks → implement
5. **Descriptive commits** with business context
6. **Test before committing** - run lint + build
7. **Reference specs in commits** - helps future developers

---

## Subagent System

This project uses **Claude Code subagents** for specialized domain expertise.

### Available Subagents

Located in `.claude/agents/` directory:

| Subagent | Purpose | Model | When to Use |
|----------|---------|-------|-------------|
| **frontend-developer** | React 19 components, Recharts visualizations, Tailwind CSS | Sonnet | Creating UI components, implementing visualizations |
| **ui-ux-designer** | Interface design, accessibility, responsive layouts | Sonnet | Designing features, ensuring WCAG compliance |
| **code-reviewer** | Code quality, standards enforcement (AGENTS.md) | Sonnet | Before commits, during PR reviews |
| **typescript-pro** | Advanced TypeScript patterns, complex types | Sonnet | Complex typing scenarios, generic components |
| **test-engineer** | Comprehensive testing, test coverage | Sonnet | Writing tests, improving coverage |
| **spec-architect** | Feature architecture, technical planning | Opus | Creating plan.md, architecture decisions |

### How to Use Subagents

**Simply mention the subagent by name:**
```
I need help from the frontend-developer subagent to create a heatmap component
```

The main Claude Code agent will automatically invoke the appropriate subagent using the Task tool.

### Subagent Integration with Spec Kit

```
/specify → spec.md (business requirements)
/plan → spec-architect subagent → plan.md (technical design)
/tasks → tasks.md (actionable work items)
/implement →
  - Frontend tasks → frontend-developer subagent
  - Testing tasks → test-engineer subagent
  - Code review → code-reviewer subagent
```

### When to Use Subagents vs Main Agent

**✅ Use Subagents For:**
- Creating React components
- Designing feature UX
- Reviewing code quality
- Complex TypeScript types
- Writing tests
- Architecting features

**Use Main Agent For:**
- Project management (/status, git, docs)
- File reading and navigation
- User interaction
- Coordinating between subagents
- Final integration and commits

### Documentation

**Detailed guides:**
- `docs/subagents/README.md` - Complete subagent guide
- `.specify/guides/subagent-workflow.md` - Workflow examples
- `.claude/agents/[name].md` - Individual subagent definitions

**Quick reference:**
- Each subagent is customized for our tech stack (React 19, Vite 7.1, Recharts 3.2)
- Subagents reference AGENTS.md for code style
- Subagents reference existing patterns (FacilityModal, MiniGraph)

---

**Project Owner:** Peter Giordano - Pickleball Clubhouse Chicago
**Tech Stack:** React 19 + TypeScript 5.9 + Vite 7.1 + Recharts 3.2
**Deployment:** Vercel (vercel.com)
**Methodology:** Spec Kit (spec-driven development) + Subagent specialization
**Last Updated:** 2025-10-05
