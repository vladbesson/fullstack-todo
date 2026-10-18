# Frontend conventions

## Components and files

- Name authored React component files in PascalCase, matching the component: `TaskCreateForm.tsx`, `TaskList.tsx`, `TasksPage.tsx`.
- Use camelCase for utility files and hooks: `createTask.ts`, `useTasks.ts`. Feature folders use lowercase names, such as `features/tasks/`.
- Declare React components as named exported arrow functions assigned to `const`, typed with `FC<Props>`.
- Accept a parameter named `props`; destructure it inside the component body.
- Keep `ComponentProps` beside its component. Use `types.ts` for types genuinely shared between multiple files. Use `PropsWithChildren` when children belong to the contract.
- Prefer named exports for authored components, hooks, and utilities. Retain default exports where a tool requires them, such as Vite configuration. When replacing an existing component default export, update its consumers.

```tsx
import { type FC } from "react"
import { type Task } from "@/api/generated/types.gen"

type TaskTitleProps = {
  task: Task
}

export const TaskTitle: FC<TaskTitleProps> = (props) => {
  const { task } = props

  return <span>{task.title}</span>
}
```

## TypeScript and imports

- Prefer `type` over `interface`; mark type-only imports with inline `type` specifiers.
- Use React imports first, then other external dependencies, project aliases, and local imports. Use `@/` for imports across feature boundaries; use relative imports within a feature when clearer.
- Import shared UI through `@/components/ui`. Within `components/ui`, keep direct sibling imports to avoid cycles through the barrel.
- Keep `index.ts` files limited to re-exports. Add barrels at useful public boundaries instead of creating one for every directory.
- Reuse generated API types rather than maintaining duplicate handwritten DTOs. Do not manually edit `src/api/generated/`.
- Use specific types instead of explicit `any`. Resolve type errors at their source; any necessary `@ts-expect-error` needs an explanation.

## Organization and UI

- Write interface copy in English, including labels, buttons, loading/empty/error states, and page titles.
- Group task-specific code in `features/tasks/`. Separate HTTP operations, shared task state, and visual components when they have distinct responsibilities.
- Keep input values, pending state, and form errors in the form. Keep the task collection with the code responsible for loading and updating it. Use typed async callbacks between them.
- Reuse installed shadcn/ui components and semantic theme tokens. Keep labels, keyboard interaction, and visible loading/error states when composing the UI.
- Small helpers and component props can remain in their component file. Add folders and layers when actual dependencies justify them.
- Apply these conventions to authored feature code. Keep installed shadcn/ui component names and structure unless a task specifically calls for changing them; use the generator for generated API files.

## Formatting and verification

- Follow the current Prettier and ESLint configuration. Use braces for control-flow blocks and a blank line before returns and between declarations and the next logical step.
- Formatting preferences from another repository do not override this project's configuration. A formatting migration is a separate change.
- Check the affected TypeScript and lint rules after extraction or renaming; verify the existing user scenario still works.
- When frontend tests are introduced, test observable behavior with semantic queries. Keep internal components and business logic real; mock network and other external boundaries when needed for deterministic tests.
