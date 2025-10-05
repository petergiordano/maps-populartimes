# Claude Code Subagents Guide

**Project**: Pickleball Competitive Intelligence Platform
**Created**: 2025-10-05
**Purpose**: Specialized AI agents for domain-specific tasks within our Spec Kit workflow

---

## What Are Subagents?

Subagents are specialized AI agents (Claude instances) with custom system prompts and tool access, designed to handle specific domains more effectively than a general-purpose agent.

**Key Benefits**:
- **Specialized Expertise**: Each subagent has deep domain knowledge
- **Consistent Quality**: Enforces project standards automatically
- **Faster Development**: Domain experts work more efficiently
- **Better Architecture**: Technical decisions from specialized architects

---

## Available Subagents

### 1. frontend-developer
**File**: `.claude/agents/frontend-developer.md`
**Model**: Sonnet
**Purpose**: Build React 19 components, implement Recharts visualizations, Tailwind layouts

**When to Use**:
- Creating new UI components
- Implementing data visualizations
- Building responsive layouts
- Fixing frontend bugs
- Optimizing component performance

**Example Invocation**:
```
I need help from the frontend-developer subagent to create a new comparison table component
```

---

### 2. ui-ux-designer
**File**: `.claude/agents/ui-ux-designer.md`
**Model**: Sonnet
**Purpose**: Design intuitive interfaces, ensure accessibility, create responsive layouts

**When to Use**:
- Designing new feature interfaces
- Creating wireframes or mockups
- Choosing visualization types
- Ensuring WCAG compliance
- Improving user experience flows

**Example Invocation**:
```
I need the ui-ux-designer subagent to design the interface for the radius filter feature
```

---

### 3. code-reviewer
**File**: `.claude/agents/code-reviewer.md`
**Model**: Sonnet
**Purpose**: Perform thorough code reviews, enforce AGENTS.md standards, check quality

**When to Use**:
- Before committing code
- During pull request reviews
- After implementing a feature
- When debugging quality issues
- Before merging to main

**Example Invocation**:
```
I need the code-reviewer subagent to review the FacilityModal component before commit
```

---

### 4. typescript-pro
**File**: `.claude/agents/typescript-pro.md`
**Model**: Sonnet
**Purpose**: Advanced TypeScript patterns, complex type challenges, strict mode compliance

**When to Use**:
- Defining complex type structures
- Creating generic components
- Fixing TypeScript compiler errors
- Typing Recharts components
- Implementing type guards

**Example Invocation**:
```
I need the typescript-pro subagent to help type this generic table component properly
```

---

### 5. test-engineer
**File**: `.claude/agents/test-engineer.md`
**Model**: Sonnet
**Purpose**: Write comprehensive tests, ensure test coverage, validate feature quality

**When to Use**:
- Writing tests for new features
- Improving test coverage
- Debugging failing tests
- Setting up testing infrastructure
- Testing edge cases and accessibility

**Example Invocation**:
```
I need the test-engineer subagent to write tests for the export utility functions
```

---

### 6. spec-architect
**File**: `.claude/agents/spec-architect.md`
**Model**: Opus
**Purpose**: Design technical architecture, create plan.md from spec.md, make architecture decisions

**When to Use**:
- Creating plan.md for new features
- Reviewing technical architecture
- Making technology selection decisions
- Estimating complexity and effort
- Identifying technical risks

**Example Invocation**:
```
I need the spec-architect subagent to create a technical plan for the time-slot opportunity heatmap
```

---

## How Subagents Work with Spec Kit

### Standard Spec Kit Workflow
```
/specify → spec.md created (business requirements)
/plan → plan.md created (technical design)
/tasks → tasks.md created (work items)
/implement → implementation
```

### Enhanced with Subagents
```
/specify → spec.md created
/plan → spec-architect designs architecture → plan.md
/tasks → tasks.md created
/implement →
  - Frontend tasks → frontend-developer subagent
  - Testing tasks → test-engineer subagent
  - Code review → code-reviewer subagent
```

---

## How to Use Subagents

### Automatic Invocation (Primary Method)

**You don't need to do anything!** Claude Code automatically recognizes when a subagent should be used and invokes it proactively.

**Examples of automatic invocation:**
- You say: "Create a heatmap component" → Claude automatically uses **frontend-developer**
- You say: "How should this interface look?" → Claude automatically uses **ui-ux-designer**
- You say: "I'm ready to commit" → Claude automatically uses **code-reviewer**
- You say: "I'm getting TypeScript errors" → Claude automatically uses **typescript-pro**
- You say: "Write tests for this" → Claude automatically uses **test-engineer**
- You say: "Create a technical plan" → Claude automatically uses **spec-architect**

### Manual Request (Optional)
If you want to explicitly request a specific subagent:

```
I need help from the frontend-developer subagent to create a heatmap component
```

This ensures a specific subagent is used, but it's usually not necessary.

### Method 2: Explicit Task Tool (Advanced)
For more control, Claude can use the Task tool directly:

```typescript
// Claude internally uses something like:
Task({
  subagent_type: "frontend-developer",
  prompt: "Create a heatmap component for time-slot opportunity visualization...",
  description: "Create heatmap component"
})
```

---

## Subagent Best Practices

### When to Use Subagents
✅ **Good Use Cases**:
- Creating React components → frontend-developer
- Designing feature UX → ui-ux-designer
- Reviewing code quality → code-reviewer
- Complex TypeScript types → typescript-pro
- Writing tests → test-engineer
- Architecting features → spec-architect

❌ **Don't Use Subagents For**:
- Simple questions (use main Claude)
- Reading files (use main Claude)
- Running status command (use main Claude or /checkstatus)
- Git operations (use main Claude)

### Delegation Guidelines

**Main Claude should handle**:
- Project management (status, git, documentation)
- File reading and navigation
- User interaction and clarification
- Coordinating between subagents
- Final integration and commits

**Subagents should handle**:
- Specialized technical work
- Domain-specific decisions
- Detailed implementation
- Code generation
- Quality assurance

---

## Customization

All subagents are customized for our project:

### Project-Specific Context
- Tech stack: React 19 + TypeScript 5.9 + Vite 7.1 + Recharts 3.2
- Code style: AGENTS.md conventions
- Architecture: Static JSON data, no backend API
- Deployment: Vercel

### Reference Files
Subagents are configured to reference:
- `AGENTS.md` - Code style and conventions
- `specs/[feature]/spec.md` - Business requirements
- `specs/[feature]/plan.md` - Technical design
- Existing component patterns (FacilityModal, MiniGraph)

---

## Integration with Documentation

### CLAUDE.md
Updated with subagent usage patterns and when to invoke specialized agents.

### AGENTS.md
Updated with "Subagent System" section explaining the architecture.

### QUICK_REFERENCE.md
Added subagent quick reference for common scenarios.

---

## Troubleshooting

### Subagent Not Working?
1. Verify file exists: `.claude/agents/[subagent-name].md`
2. Check file is committed (not in .gitignore)
3. Ensure proper YAML frontmatter (name, description, model)
4. Try explicit request: "I need help from the [subagent-name] subagent"

### Subagent Gives Generic Response?
- The subagent may not have enough context
- Reference specific files in your request
- Provide relevant code snippets
- Mention the feature/spec you're working on

### Want to Create Custom Subagent?
1. Create `.claude/agents/[name].md`
2. Follow existing subagent format (YAML frontmatter + markdown)
3. Customize system_prompt for your domain
4. Specify appropriate model (haiku/sonnet/opus)
5. Test with explicit invocation
6. Document in this README

---

## Further Reading

### External Resources
- [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent) - Workflow-focused subagents
- [wshobson/agents](https://github.com/wshobson/agents) - 83 production-ready domain subagents
- [Claude Code Subagents Docs](https://docs.anthropic.com/en/docs/claude-code) - Official documentation

### Project Documentation
- `.specify/guides/subagent-workflow.md` - Detailed workflow examples
- `AGENTS.md` - Project conventions and subagent system
- `CLAUDE.md` - Claude Code usage patterns
- `.specify/QUICK_REFERENCE.md` - Quick reference guide

---

**Last Updated**: 2025-10-05
**Maintained By**: Spec Kit workflow
**Questions?**: See `.specify/QUICK_REFERENCE.md` or run `/checkstatus`
