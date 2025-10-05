# Subagent Workflow Guide

**Project**: Pickleball Competitive Intelligence Platform
**Created**: 2025-10-05
**Purpose**: Detailed examples of using subagents with Spec Kit workflow

---

## Table of Contents

1. [Workflow Overview](#workflow-overview)
2. [Scenario 1: Creating a New Feature](#scenario-1-creating-a-new-feature)
3. [Scenario 2: Reviewing Before Commit](#scenario-2-reviewing-before-commit)
4. [Scenario 3: Debugging TypeScript Issues](#scenario-3-debugging-typescript-issues)
5. [Scenario 4: Writing Tests](#scenario-4-writing-tests)
6. [Scenario 5: Improving UX](#scenario-5-improving-ux)
7. [Best Practices](#best-practices)

---

## Workflow Overview

### Standard Spec Kit + Subagents

```mermaid
graph TD
    A[User describes feature] --> B[/specify command]
    B --> C[spec.md created]
    C --> D[/plan command]
    D --> E[spec-architect subagent invoked]
    E --> F[plan.md created]
    F --> G[/tasks command]
    G --> H[tasks.md created]
    H --> I[/implement command]
    I --> J{Task type?}
    J -->|Frontend| K[frontend-developer subagent]
    J -->|Testing| L[test-engineer subagent]
    J -->|Architecture| M[spec-architect subagent]
    K --> N[Implementation complete]
    L --> N
    M --> N
    N --> O[code-reviewer subagent]
    O --> P[Commit & push]
```

---

## Scenario 1: Creating a New Feature

### Goal
Create Feature 002: "My Facility" Visual Highlighting

### Steps

**1. User creates feature spec**
```bash
# User message:
"Let's implement Feature 002 from the roadmap"
```

**2. Claude runs /specify**
```
I'll run the /specify command to create the specification for Feature 002.
```

Result: `specs/002-my-facility-highlighting/spec.md` created

**3. User requests technical plan**
```bash
# User message:
"Create a technical plan for this feature"
```

**4. Claude invokes spec-architect subagent**
```
I'll use the spec-architect subagent to create a comprehensive technical plan.

[Internally uses Task tool with subagent_type: "spec-architect"]
```

**Spec-architect subagent output:**
- Analyzes `specs/002-my-facility-highlighting/spec.md`
- References existing patterns (FacilityModal, comparison grid)
- Creates `specs/002-my-facility-highlighting/plan.md` with:
  - Component hierarchy
  - State management approach
  - Technical decisions (color scheme, pin-to-top logic)
  - Implementation phases

**5. User requests tasks breakdown**
```bash
# User message:
"Break this down into tasks"
```

Claude runs `/tasks` → creates `tasks.md`

**6. User requests implementation**
```bash
# User message:
"Let's implement task #1: Add visual emphasis for my facility in the grid"
```

**7. Claude invokes frontend-developer subagent**
```
I'll use the frontend-developer subagent to implement this feature.

[Internally uses Task tool with subagent_type: "frontend-developer"]
```

**Frontend-developer subagent output:**
- Reads existing `frontend/src/App.tsx` (comparison grid)
- Creates CSS classes for visual emphasis
- Updates grid rendering logic
- Adds toggle for "Pin to top" functionality
- Follows AGENTS.md code style strictly

**8. Before committing, user requests code review**
```bash
# User message:
"Review this code before I commit"
```

**9. Claude invokes code-reviewer subagent**
```
I'll have the code-reviewer subagent perform a thorough review.

[Internally uses Task tool with subagent_type: "code-reviewer"]
```

**Code-reviewer subagent output:**
```markdown
## Code Review: MyFacility Visual Highlighting

### ✅ Strengths
- Follows AGENTS.md code style conventions
- TypeScript interfaces properly defined
- Mobile-responsive Tailwind classes used

### ⚠️ Issues Found

#### Important (Should Fix)
- **Missing accessibility**: Border-only differentiation excludes color-blind users
  - Location: App.tsx:145
  - Fix: Add icon or pattern in addition to border color

### ✅ Approval Status
- [x] Approved with minor changes
```

**10. User addresses feedback and commits**

---

## Scenario 2: Reviewing Before Commit

### Goal
Ensure code quality before committing new export functionality

### Steps

**1. User completes implementation**
```bash
# User has written export utility functions in frontend/src/utils/exportUtils.ts
```

**2. User requests review**
```bash
# User message:
"Review the export utility functions before I commit them"
```

**3. Claude invokes code-reviewer subagent**
```
I'll invoke the code-reviewer subagent to perform a comprehensive code review.
```

**4. Code-reviewer performs analysis**
- Checks TypeScript type safety
- Validates error handling
- Ensures AGENTS.md compliance
- Checks for security issues (XSS in CSV export)
- Validates performance (large dataset handling)

**5. Provides structured feedback**
```markdown
## Code Review: Export Utilities

### ✅ Strengths
- Proper TypeScript typing for all export formats
- Good error handling with try-catch blocks
- Efficient data transformation using map/reduce

### ⚠️ Issues Found

#### Critical (Must Fix)
- **CSV injection vulnerability**: User input not sanitized
  - Location: exportUtils.ts:42
  - Fix: Escape special characters in CSV cells
  - Code:
    ```typescript
    const escapeCsvCell = (value: string) => {
      if (value.startsWith('=') || value.startsWith('+') || value.startsWith('-')) {
        return `'${value}`
      }
      return value
    }
    ```

### ✅ Approval Status
- [ ] Changes requested - Must address critical issue
```

**6. User fixes issue and re-requests review**

**7. Code-reviewer approves**
```markdown
### ✅ Approval Status
- [x] Approved - Ready to merge
```

---

## Scenario 3: Debugging TypeScript Issues

### Goal
Fix complex TypeScript errors in Recharts component

### Steps

**1. User encounters TypeScript errors**
```bash
# Build error:
# Type 'string | undefined' is not assignable to type 'number'
# in WeeklyHeatmap.tsx line 58
```

**2. User requests TypeScript help**
```bash
# User message:
"I need help from the typescript-pro subagent to fix these Recharts type errors"
```

**3. Claude invokes typescript-pro subagent**
```
I'll invoke the typescript-pro subagent to resolve these type issues.
```

**4. TypeScript-pro analyzes the issue**
- Reads `WeeklyHeatmap.tsx`
- Identifies Recharts prop type mismatch
- Provides type-safe solution

**5. TypeScript-pro provides fix**
```typescript
// ❌ BEFORE: Type error
<AreaChart data={data} width={width} height={height}>

// ✅ AFTER: Properly typed
interface ChartDataPoint {
  hour: number
  popularity: number
  day: string
}

const transformedData: ChartDataPoint[] = data.map(item => ({
  hour: Number(item.hour),  // Ensure number
  popularity: item.popularity ?? 0,  // Handle undefined
  day: item.day
}))

<AreaChart<ChartDataPoint>
  data={transformedData}
  width={width ?? 500}
  height={height ?? 300}
>
```

**6. User applies fix and build succeeds**

---

## Scenario 4: Writing Tests

### Goal
Add comprehensive tests for facility comparison logic

### Steps

**1. User requests test creation**
```bash
# User message:
"I need the test-engineer subagent to write tests for the facility comparison utilities"
```

**2. Claude invokes test-engineer subagent**
```
I'll use the test-engineer subagent to create comprehensive tests.
```

**3. Test-engineer analyzes the code**
- Reads `frontend/src/utils/facilityUtils.ts`
- Identifies testable functions
- Plans test coverage strategy

**4. Test-engineer creates test suite**
```typescript
import { describe, it, expect } from 'vitest'
import { comparePopularity, findOpportunities } from './facilityUtils'

describe('facilityUtils', () => {
  describe('comparePopularity', () => {
    it('calculates percentage difference correctly', () => {
      const result = comparePopularity(50, 100)
      expect(result).toBe(-50) // 50% less than competitor
    })

    it('handles zero competitor popularity', () => {
      const result = comparePopularity(50, 0)
      expect(result).toBe(Infinity)
    })

    it('handles zero own popularity', () => {
      const result = comparePopularity(0, 100)
      expect(result).toBe(-100)
    })
  })

  describe('findOpportunities', () => {
    it('identifies underperforming time slots', () => {
      const myData = [10, 20, 30]
      const competitorAvg = [50, 60, 40]

      const opportunities = findOpportunities(myData, competitorAvg, -15)

      expect(opportunities).toHaveLength(2) // Hours 0 and 1
      expect(opportunities[0]).toMatchObject({
        hour: 0,
        delta: -80 // -80% vs competitor
      })
    })
  })
})
```

**5. User runs tests**
```bash
npm test
```

Tests pass ✅

---

## Scenario 5: Improving UX

### Goal
Improve the time-slot opportunity heatmap UX based on user feedback

### Steps

**1. User describes UX issue**
```bash
# User message:
"Users are confused by the heatmap colors. I need the ui-ux-designer subagent to improve this."
```

**2. Claude invokes ui-ux-designer subagent**
```
I'll use the ui-ux-designer subagent to redesign the heatmap interface for better clarity.
```

**3. UI-UX-designer analyzes current design**
- Reviews current heatmap implementation
- Identifies accessibility issues (color-only differentiation)
- Considers business context (executives need quick insights)

**4. UI-UX-designer provides redesign**
```markdown
## Heatmap Redesign Recommendations

### Issue: Color-only differentiation
**Problem**: Color-blind users cannot distinguish RED/GREEN
**Solution**: Add patterns + icons

### New Design:

┌─────────────────────────────────────────────────────┐
│         Mon    Tue    Wed    Thu    Fri    Sat  Sun │
│ 6am     🟢↑   🟢↑   🟢↑   🟢↑   🟢↑   🔴↓  🔴↓ │
│         +23%  +18%  +25%  +20%  +22%  -15%  -12% │
│                                                     │
│ 🟢↑ = Outperforming (diagonal stripes + up arrow)  │
│ 🔴↓ = Underperforming (dots + down arrow)          │
│ ⚪→ = At parity (solid + right arrow)              │
└─────────────────────────────────────────────────────┘

### Accessibility Improvements:
1. Icons (↑↓→) in addition to colors
2. Patterns (stripes, dots, solid) for color-blind users
3. Percentage values always visible (not just on hover)
4. High contrast mode support

### CSS Implementation:
```css
.cell-outperform {
  background: linear-gradient(45deg, #22c55e 25%, transparent 25%);
  border: 2px solid #16a34a;
}

.cell-underperform {
  background: radial-gradient(circle, #ef4444 1px, transparent 1px);
  background-size: 8px 8px;
  border: 2px solid #dc2626;
}
```
```

**5. User implements redesign using frontend-developer subagent**

---

## Best Practices

### 1. Clear Subagent Requests
✅ **GOOD**: "I need the frontend-developer subagent to create a heatmap component"
❌ **BAD**: "Make a heatmap" (unclear if subagent needed)

### 2. Provide Context
✅ **GOOD**: "Review the export utils in frontend/src/utils/exportUtils.ts"
❌ **BAD**: "Review my code" (which code?)

### 3. One Subagent Per Task
✅ **GOOD**: Frontend-developer creates component → Code-reviewer reviews it
❌ **BAD**: "Have all subagents work on this at once" (coordination issues)

### 4. Sequential for Dependencies
```
1. spec-architect → creates plan.md
2. frontend-developer → implements based on plan
3. test-engineer → writes tests for implementation
4. code-reviewer → reviews before commit
```

### 5. Reference Specs
✅ **GOOD**: "Based on specs/002-my-facility/spec.md, create the plan"
❌ **BAD**: No reference to requirements

---

## Troubleshooting

### Subagent Not Invoked?
**Problem**: Claude doesn't use subagent
**Solution**: Explicitly mention subagent name: "I need the [name] subagent to..."

### Subagent Lacks Context?
**Problem**: Subagent gives generic response
**Solution**: Reference specific files, provide code snippets, mention the feature spec

### Wrong Subagent Used?
**Problem**: Frontend-developer used for testing task
**Solution**: Be explicit: "I need the test-engineer subagent specifically"

---

**More Info**: See `docs/subagents/README.md` for complete subagent reference

**Last Updated**: 2025-10-05
