---
description: Show comprehensive project status including git state, feature progress, and next steps.
---

Run the project status command to display:
- Current git branch and sync status
- Feature completion progress
- What you're currently working on
- Recommended next steps
- Links to all key documentation

Execute this command:

```bash
bash .specify/scripts/bash/status.sh
```

After the status is displayed, summarize the key information for the user:
1. Current branch and git status
2. Active feature (if on a feature branch)
3. What phase you're in (spec/plan/tasks/implementation)
4. What the recommended next step is

This command helps you quickly re-orient yourself when starting a new session or after being away from the project.
