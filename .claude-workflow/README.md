# .claude-workflow

Reusable **workflow knowledge** — agents, skills, and slash commands. Project-agnostic; identical across every project.

> **Status (V1):** scaffolded as real folders on the `harnessContextSystemTest-DGL` branch for testing.
> **Long-term:** replace this folder with a symlink to a shared GitHub repo so every project uses one canonical workflow layer.

Keep **project knowledge** (code, `docs/`, `features/`) in the repo; keep **workflow knowledge** (this folder) reusable.

## Layout
- `agents/` — agent definitions
- `skills/` — skill definitions
- `commands/` — slash command definitions
