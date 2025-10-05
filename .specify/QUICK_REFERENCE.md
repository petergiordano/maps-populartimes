# 🚀 Quick Reference: Re-Orienting to This Project

## ⚡ Single Command to Get Oriented

**If using Claude Code:**
```
/checkstatus
```

**Or run directly:**
```bash
bash .specify/scripts/bash/status.sh
```

This shows:
- ✅ Current git branch and status
- ✅ Feature completion progress
- ✅ What you're working on right now
- ✅ Recommended next steps
- ✅ Links to all documentation

---

## 📋 Key Files to Check

| File | Purpose |
|------|---------|
| **`todo.md`** | Lightweight task tracker - check this first |
| **`specs/000-project-overview/roadmap.md`** | Master roadmap with all 19 features |
| **`specs/000-project-overview/spec.md`** | Business goals & user scenarios |
| **Current feature spec** | `specs/[branch-name]/spec.md` |

---

## 🎯 Workflow Depending on Current State

### If on `main` branch:
```bash
# Check what's next
cat todo.md

# Start next feature (e.g., Feature 002)
git checkout -b 002-my-facility-highlighting
# Then tell Claude: "Let's implement Feature 002"
```

### If on a feature branch (e.g., `001-facility-detail-modal`):

**Check progress:**
```bash
bash .specify/scripts/bash/status.sh
```

**If no spec yet:**
```
Tell Claude: "Run /specify for this feature"
```

**If spec exists but no plan:**
```
Tell Claude: "Run /plan to create implementation plan"
```

**If plan exists but no tasks:**
```
Tell Claude: "Run /tasks to generate task list"
```

**If tasks exist:**
```
# Check tasks
cat specs/[branch-name]/tasks.md

# Start implementing
Tell Claude: "Let's implement task #1 from the task list"
```

---

## 💬 What to Tell Claude When Starting a New Session

### Option 1: Use the Slash Command (Easiest)
```
/checkstatus
```

### Option 2: Quick Status Check
```
"Show me the project status and what we were working on"
```

### Option 3: Direct Command
```
"Run: bash .specify/scripts/bash/status.sh"
```

### Option 4: Continue Work
```
"I'm back. Where did we leave off? What's the next task?"
```

Claude will run the status command and tell you exactly where you are.

---

## 📚 Spec Kit Workflow Reminder

1. **`/specify`** - Create feature specification from description
2. **`/plan`** - Generate implementation plan from spec
3. **`/tasks`** - Break down plan into actionable tasks
4. **`/implement`** - Execute tasks

Each step creates files in `specs/[feature-number]-[feature-name]/`

---

## 🔍 Common Scenarios

### "I just opened the project after a week"
**In Claude Code:**
```
/checkstatus
```

**Or in terminal:**
```bash
bash .specify/scripts/bash/status.sh
cat todo.md
```

### "I want to see all planned features"
```bash
cat specs/000-project-overview/roadmap.md
```

### "What's the business goal again?"
```bash
cat specs/000-project-overview/spec.md
```

### "What was I implementing?"
```bash
# Check current branch
git branch --show-current

# Check the spec for that feature
cat specs/$(git branch --show-current)/spec.md
```

### "What's next to build?"
```bash
# Quick view
cat todo.md | grep "🔥"

# Detailed view
cat specs/000-project-overview/roadmap.md | grep -A5 "Phase 2"
```

---

## 🎨 Project Structure Quick Map

```
maps-populartimes/
├── specs/
│   ├── 000-project-overview/      # Business goals & roadmap
│   ├── 001-facility-detail-modal/ # Feature 001 spec/plan/tasks
│   └── ...                        # Future features
├── frontend/                      # React SPA
│   ├── src/components/
│   ├── src/utils/
│   └── public/facilities.json     # Facility data
├── todo.md                        # Lightweight tracker (check this!)
├── CLAUDE.md                      # Context for Claude Code
└── .specify/                      # Spec Kit framework
    └── scripts/bash/status.sh     # The magic re-orientation script
```

---

## ✨ Pro Tips

1. **Always run status first** when returning to the project
2. **Check `todo.md`** for quick task overview (90 lines, easy to scan)
3. **Use Git branch name** to find your current feature spec
4. **Feature numbers** match across branches, specs, and roadmap
5. **Green checkmarks in roadmap** = completed features
6. **Use subagents** for specialized tasks (see below)

---

## 🤖 Subagent Quick Reference

This project uses **Claude Code subagents** for specialized expertise.

### Available Subagents (in `.claude/agents/`)

| When you need... | Use this subagent | Example request |
|------------------|-------------------|-----------------|
| React component creation | `frontend-developer` | "I need the frontend-developer subagent to create a heatmap" |
| UI/UX design | `ui-ux-designer` | "I need the ui-ux-designer subagent to design the filter interface" |
| Code review | `code-reviewer` | "I need the code-reviewer subagent to review before commit" |
| Complex TypeScript types | `typescript-pro` | "I need the typescript-pro subagent to fix these type errors" |
| Writing tests | `test-engineer` | "I need the test-engineer subagent to write tests for this" |
| Feature architecture | `spec-architect` | "I need the spec-architect subagent to create a technical plan" |

### How to Use

**Just mention the subagent by name:**
```
I need help from the frontend-developer subagent to create a comparison table
```

Claude will automatically invoke the appropriate subagent.

**Detailed guides:**
- `docs/subagents/README.md` - Complete subagent reference
- `.specify/guides/subagent-workflow.md` - Workflow examples

---

## 🆘 If Completely Lost

**In Claude Code (easiest):**
```
/checkstatus
```

**Or step by step in terminal:**
```bash
# Step 1: Where am I?
bash .specify/scripts/bash/status.sh

# Step 2: What's the high-level plan?
cat specs/000-project-overview/roadmap.md | head -100

# Step 3: What should I do today?
cat todo.md

# Step 4: Ask Claude
# Just say: "I'm lost, help me get oriented"
```

Claude has context about the project and can read all these files to help you.

---

**Created**: 2025-10-05
**Last Updated**: 2025-10-05
**Maintained by**: Spec Kit workflow
