Integrating Claude subagents into a project using GitHub Spec-Kit involves creating a specific directory structure and custom agent markdown files. This setup allows the Spec-Kit workflow, executed by a main Claude agent, to automatically delegate specialized tasks to the appropriate subagents. 
Prerequisite steps
Install the Spec-Kit CLI:
Recommended (persistent install): uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
One-time use: uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
Initialize your project with Spec-Kit: Run specify init <PROJECT_NAME> to set up the necessary project scaffolding.
Start a Claude Code session in your project's directory. Crucially, you must do this after setting up Spec-Kit so that Claude Code recognizes the new commands.
Create a constitution.md file: Run the /constitution command with Claude Code to generate a file defining your project's governing principles. This guides the agents' work. 
Step-by-step integration
Step 1: Create the subagent directory
Create a specific folder structure within your project to house the subagents. This makes the configurations project-specific and keeps them version-controlled. 
sh
mkdir -p .claude/agents
Use code with caution.

Step 2: Assemble your subagent team
Create a markdown (.md) file for each specialized subagent you want to create within the .claude/agents/ directory. You can create these from scratch or start with an existing collection, like the one from zhsama/claude-sub-agent. 
Each file defines an agent's name, description, system_prompt, and tools. The system_prompt is key, as it provides the custom instructions and constraints that make the subagent a specialist. 
Example file: .claude/agents/code-reviewer.md
markdown
---
name: code-reviewer
description: A specialist agent for performing thorough code reviews.
system_prompt: |-
  You are a professional code reviewer. Your task is to analyze code changes
  for bugs, security vulnerabilities, adherence to coding standards, and
  overall quality. Provide constructive feedback and suggestions for improvement.
tools:
  - 'shell'
  - 'editor'
---
Use code with caution.

Step 3: Use Spec-Kit commands to trigger the workflow
Now, with your project-specific subagents configured, you can use the standard Spec-Kit commands within your Claude Code session. The main Claude agent will orchestrate the development process and delegate specific tasks to the appropriate subagents as needed, based on their descriptions. 
Generate a spec: Run the /specify command with a natural language prompt describing your feature.
/specify Create a new API endpoint for user profiles, including validation rules.
Create a plan: Run the /plan command to generate a technical plan based on the specification. The plan might include steps where specialized subagents can be useful, like [research] the best validation library.
Generate tasks: Run the /tasks command to break the plan down into a list of specific, executable tasks. 
Step 4: Let the subagents work
As you interact with Claude Code to work through the generated tasks, it will automatically invoke the specialized subagents you created.
If the main agent encounters a step involving code review, it will delegate the task to your code-reviewer agent.
When a task requires testing, a dedicated qa-agent you configured could handle writing tests, preventing the main agent from getting bogged down with a low-level testing context. 
Step 5: Iteration and refinement
After the tasks are completed, you can continue the Spec-Kit workflow to refine the results. Subagents can assist in this, for instance:
Use a subagent to perform a final review of the implemented code and report back.
Update the original specification and have the main agent regenerate the plan and tasks.


More info:
- https://github.com/zhsama/claude-sub-agent
- https://github.com/wshobson/agents
- 