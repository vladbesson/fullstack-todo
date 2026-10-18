# Working on this project

## Learning workflow

- This is a learning project for Python backend and full-stack development. The user is experienced in JavaScript/frontend and Git, and is learning Python and SQL.
- The user implements application code and configuration. Explain the next small task, its purpose, relevant syntax, and how to verify the result. Read code and run appropriate diagnostics when reviewing progress.
- Edit application code or configuration when the user explicitly requests that edit. A request to explain, review, or continue learning calls for guidance, not automatic implementation.
- Communicate in Russian. Explain Python concepts as they arise; use JavaScript comparisons when useful. Separate established conventions from project preferences.
- Git and Claude usage do not need separate lessons. Keep infrastructure and architectural layers tied to a concrete learning scenario.
- When resuming the learning plan, read `.git/info/learning-context.md` if available. It contains private context and the roadmap; keep that material out of tracked documentation.

## Repository boundaries

- The repository root contains `backend/` and `frontend/`; both belong to the same Git repository.
- Use uv for backend dependencies and commands, and pnpm for frontend dependencies and commands. Read the current configuration and package scripts before proposing changes.
- Frontend conventions are in `frontend/AGENTS.md`. Keep Python naming and style consistent with the existing Python tooling.
- Treat Pydantic models and FastAPI routes as the source of the API contract. Regenerate frontend artifacts after contract changes; edit their source rather than the generated output.

## Development commands

Run these commands from the repository root. The root `package.json` is the source of truth for their implementation.

| Command | When to use |
| --- | --- |
| `pnpm dev:backend` / `pnpm dev:frontend` | Start each development server in its own terminal. |
| `pnpm check` | Format both parts, run all configured pre-commit checks, and build the frontend. Use this single command when asking the user to verify a completed task or prepare a checkpoint commit. |
| `pnpm build` | Verify the frontend production build after UI, import, or build-configuration changes. |
| `pnpm test:backend` | Run the existing API tests after backend behavior changes. |
| `pnpm lint:backend` / `pnpm lint:frontend` | Check lint rules for the affected part. |
| `pnpm typecheck:backend` / `pnpm typecheck:frontend` | Check types for the affected part. |
| `pnpm format:backend` / `pnpm format:frontend` | Apply the configured formatting to the affected part. |
| `pnpm generate:api` | Regenerate frontend API artifacts after contract changes; the backend must be running. |

`pnpm check` applies formatting before running the hooks, so formatting changes alone do not require a second run. Review the resulting changes. A Git commit can still stop if its hooks modify files; review those changes and retry. Leave staging and committing to the user unless explicitly requested.

## Git preferences

- Commit only when explicitly requested. Never skip Git hooks; address the underlying failure.
- Never include temporary files, plans, baselines, previews, generated diagnostics, or other working artifacts in a commit. Before staging, inspect every changed and untracked file and stage only the production changes explicitly belonging to the requested commit.
- Never push or force-push unless the user explicitly requests that specific push. Permission to commit, rewrite history, or fix a branch does not imply permission to push.
