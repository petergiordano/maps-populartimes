#!/usr/bin/env bash
# status.sh - Show current project status and where you left off
# Usage: bash .specify/scripts/bash/status.sh

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Get project root (go up from .specify/scripts/bash/ to project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}📊 SPEC KIT PROJECT STATUS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Project info
PROJECT_NAME=$(basename "$PROJECT_ROOT")
echo -e "${BOLD}Project:${NC} $PROJECT_NAME"
echo -e "${BOLD}Location:${NC} $PROJECT_ROOT"
echo ""

# Git status
echo -e "${BOLD}${BLUE}🔀 Git Status${NC}"
if command -v git &> /dev/null; then
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    echo -e "  Branch: ${GREEN}$CURRENT_BRANCH${NC}"

    # Check if branch is ahead/behind
    if git rev-parse --abbrev-ref @{u} &>/dev/null; then
        BEHIND=$(git rev-list HEAD..@{u} --count 2>/dev/null || echo "0")
        AHEAD=$(git rev-list @{u}..HEAD --count 2>/dev/null || echo "0")

        if [ "$AHEAD" -gt 0 ]; then
            echo -e "  ${YELLOW}⬆️  Ahead by $AHEAD commit(s) - need to push${NC}"
        fi
        if [ "$BEHIND" -gt 0 ]; then
            echo -e "  ${YELLOW}⬇️  Behind by $BEHIND commit(s) - need to pull${NC}"
        fi
        if [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -eq 0 ]; then
            echo -e "  ${GREEN}✓ Up to date with remote${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  No remote tracking branch${NC}"
    fi

    # Show uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        MODIFIED=$(git diff --name-only | wc -l | tr -d ' ')
        STAGED=$(git diff --staged --name-only | wc -l | tr -d ' ')
        UNTRACKED=$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')

        echo -e "  ${YELLOW}Uncommitted changes:${NC}"
        [ "$STAGED" -gt 0 ] && echo -e "    ${GREEN}✓ Staged: $STAGED file(s)${NC}"
        [ "$MODIFIED" -gt 0 ] && echo -e "    ${YELLOW}⚠ Modified: $MODIFIED file(s)${NC}"
        [ "$UNTRACKED" -gt 0 ] && echo -e "    ${GRAY}? Untracked: $UNTRACKED file(s)${NC}"
    else
        echo -e "  ${GREEN}✓ Working directory clean${NC}"
    fi

    # Last commit
    LAST_COMMIT=$(git log -1 --pretty=format:"%h - %s" 2>/dev/null || echo "No commits")
    echo -e "  Last commit: ${GRAY}$LAST_COMMIT${NC}"
else
    echo -e "  ${RED}Git not available${NC}"
fi
echo ""

# Feature status
echo -e "${BOLD}${BLUE}📋 Features Status${NC}"

# Count specs
SPEC_COUNT=0
COMPLETED_COUNT=0
IN_PROGRESS_COUNT=0

if [ -d "specs" ]; then
    for spec_dir in specs/*/; do
        if [ -f "$spec_dir/spec.md" ]; then
            SPEC_COUNT=$((SPEC_COUNT + 1))
            FEATURE_NUM=$(basename "$spec_dir" | cut -d'-' -f1)
            FEATURE_NAME=$(basename "$spec_dir" | cut -d'-' -f2- | tr '-' ' ')

            # Check status from roadmap or spec
            if [ -f "specs/000-project-overview/roadmap.md" ]; then
                if grep -q "Feature $FEATURE_NUM.*✅.*COMPLETED" "specs/000-project-overview/roadmap.md" 2>/dev/null; then
                    STATUS="${GREEN}✅ Completed${NC}"
                    COMPLETED_COUNT=$((COMPLETED_COUNT + 1))
                elif grep -q "Feature $FEATURE_NUM.*🔜" "specs/000-project-overview/roadmap.md" 2>/dev/null; then
                    STATUS="${YELLOW}🔜 Next${NC}"
                    IN_PROGRESS_COUNT=$((IN_PROGRESS_COUNT + 1))
                else
                    STATUS="${GRAY}📝 Planned${NC}"
                fi
            else
                STATUS="${GRAY}📝 Documented${NC}"
            fi

            # Check if has plan
            HAS_PLAN=""
            [ -f "$spec_dir/plan.md" ] && HAS_PLAN=" ${CYAN}[plan]${NC}"

            # Check if has tasks
            HAS_TASKS=""
            [ -f "$spec_dir/tasks.md" ] && HAS_TASKS=" ${CYAN}[tasks]${NC}"

            echo -e "  $FEATURE_NUM: $FEATURE_NAME - $STATUS$HAS_PLAN$HAS_TASKS"
        fi
    done

    echo ""
    echo -e "  ${BOLD}Total:${NC} $SPEC_COUNT features ($COMPLETED_COUNT completed, $IN_PROGRESS_COUNT in progress)"
else
    echo -e "  ${YELLOW}No specs/ directory found${NC}"
fi
echo ""

# Current feature (based on branch name)
echo -e "${BOLD}${BLUE}🎯 Current Focus${NC}"
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    FEATURE_NUM_BRANCH=$(echo "$CURRENT_BRANCH" | grep -oE '^[0-9]+' || echo "")
    if [ -n "$FEATURE_NUM_BRANCH" ] && [ -d "specs/$CURRENT_BRANCH" ]; then
        echo -e "  Working on: ${GREEN}$CURRENT_BRANCH${NC}"

        # Show spec file location
        if [ -f "specs/$CURRENT_BRANCH/spec.md" ]; then
            echo -e "  Spec: ${CYAN}specs/$CURRENT_BRANCH/spec.md${NC}"
        fi

        # Show plan status
        if [ -f "specs/$CURRENT_BRANCH/plan.md" ]; then
            # Check plan progress
            if grep -q "Phase 1: Design complete" "specs/$CURRENT_BRANCH/plan.md" 2>/dev/null; then
                echo -e "  ${GREEN}✓ Implementation plan complete${NC}"
            fi
            echo -e "  Plan: ${CYAN}specs/$CURRENT_BRANCH/plan.md${NC}"
        else
            echo -e "  ${YELLOW}⚠️  No implementation plan yet - run /plan${NC}"
        fi

        # Show tasks status
        if [ -f "specs/$CURRENT_BRANCH/tasks.md" ]; then
            TOTAL_TASKS=$(grep -c "^- \[ \]" "specs/$CURRENT_BRANCH/tasks.md" 2>/dev/null || echo "0")
            DONE_TASKS=$(grep -c "^- \[x\]" "specs/$CURRENT_BRANCH/tasks.md" 2>/dev/null || echo "0")
            echo -e "  ${GREEN}✓ Task list generated ($DONE_TASKS/$TOTAL_TASKS done)${NC}"
            echo -e "  Tasks: ${CYAN}specs/$CURRENT_BRANCH/tasks.md${NC}"
        else
            echo -e "  ${YELLOW}⚠️  No task list yet - run /tasks${NC}"
        fi
    else
        echo -e "  Working on: ${GREEN}$CURRENT_BRANCH${NC}"
        echo -e "  ${GRAY}(Not a feature branch or no spec found)${NC}"
    fi
else
    echo -e "  ${GRAY}On main branch - no active feature${NC}"
fi
echo ""

# Next steps based on current state
echo -e "${BOLD}${BLUE}🚀 Recommended Next Steps${NC}"

if [ -f "todo.md" ]; then
    echo -e "  ${BOLD}Quick View:${NC} ${CYAN}cat todo.md${NC}"
fi

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    # On a feature branch
    if [ ! -f "specs/$CURRENT_BRANCH/spec.md" ]; then
        echo -e "  1. ${YELLOW}Create spec:${NC} Run /specify to document requirements"
    elif [ ! -f "specs/$CURRENT_BRANCH/plan.md" ]; then
        echo -e "  1. ${YELLOW}Create plan:${NC} Run /plan to generate implementation plan"
    elif [ ! -f "specs/$CURRENT_BRANCH/tasks.md" ]; then
        echo -e "  1. ${YELLOW}Create tasks:${NC} Run /tasks to break down into work items"
    else
        echo -e "  1. ${GREEN}Ready to implement${NC} - Check tasks in specs/$CURRENT_BRANCH/tasks.md"
        echo -e "  2. ${GRAY}Or merge to main and start next feature${NC}"
    fi
else
    # On main branch
    if [ -f "specs/000-project-overview/roadmap.md" ]; then
        NEXT_FEATURE=$(grep "🔜" "specs/000-project-overview/roadmap.md" | head -1 | cut -d':' -f1 | tr -d ' ')
        if [ -n "$NEXT_FEATURE" ]; then
            echo -e "  1. ${GREEN}Start next feature:${NC} $NEXT_FEATURE (see roadmap.md)"
            echo -e "  2. ${CYAN}Create branch:${NC} git checkout -b \$(echo $NEXT_FEATURE | tr ' ' '-' | tr '[:upper:]' '[:lower:]')"
        else
            echo -e "  1. ${CYAN}Check roadmap:${NC} cat specs/000-project-overview/roadmap.md"
        fi
    else
        echo -e "  1. ${YELLOW}Create project overview:${NC} Set up specs/000-project-overview/"
    fi
fi
echo ""

# Documentation links
echo -e "${BOLD}${BLUE}📚 Key Documentation${NC}"
[ -f "specs/000-project-overview/roadmap.md" ] && echo -e "  ${CYAN}Master Roadmap:${NC} specs/000-project-overview/roadmap.md"
[ -f "specs/000-project-overview/spec.md" ] && echo -e "  ${CYAN}Project Spec:${NC} specs/000-project-overview/spec.md"
[ -f "todo.md" ] && echo -e "  ${CYAN}Task Tracker:${NC} todo.md"
[ -f "CLAUDE.md" ] && echo -e "  ${CYAN}Agent Context:${NC} CLAUDE.md"
echo ""

# Spec Kit commands available
echo -e "${BOLD}${BLUE}🛠️  Available Spec Kit Commands${NC}"
echo -e "  ${CYAN}/specify${NC}    - Create feature specification from description"
echo -e "  ${CYAN}/plan${NC}       - Generate implementation plan from spec"
echo -e "  ${CYAN}/tasks${NC}      - Break down plan into actionable tasks"
echo -e "  ${CYAN}/implement${NC}  - Execute implementation tasks"
echo -e "  ${CYAN}/analyze${NC}    - Check cross-artifact consistency"
echo ""

# Footer
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GRAY}Run this anytime: ${CYAN}bash .specify/scripts/bash/status.sh${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
