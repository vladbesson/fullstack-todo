import type { FC } from "react"
import { Alert, AlertDescription, AlertTitle, Skeleton } from "@/components/ui"
import { useProjects } from "@/features/projects/useProjects"
import { useTasks } from "../useTasks"
import { TaskCreateForm } from "./TaskCreateForm"
import { TaskList } from "./TaskList"

export const TasksPage: FC = () => {
  const { tasks, error, addTask, setTaskCompleted, removeTask } = useTasks()
  const { projects, error: projectsError, retry } = useProjects()

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-10 px-5 py-10 sm:px-8 sm:py-20">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Keep your next steps in one place.
          </p>
        </div>

        {tasks !== null ? (
          <span className="mt-1 shrink-0 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground tabular-nums">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        ) : null}
      </header>

      {error !== null ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load tasks</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <p>Refresh the page to try again.</p>
          </AlertDescription>
        </Alert>
      ) : tasks === null ? (
        <section aria-busy="true" aria-label="Task list">
          <p role="status" className="sr-only">
            Loading tasks…
          </p>
          <div aria-hidden="true" className="space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 motion-reduce:animate-none" />
              <Skeleton className="h-11 w-full rounded-lg motion-reduce:animate-none" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-24 motion-reduce:animate-none" />
              <div className="divide-y overflow-hidden rounded-xl border bg-card">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex min-h-16 items-center gap-3 px-5 py-4"
                  >
                    <Skeleton className="size-5 shrink-0 rounded-full motion-reduce:animate-none" />
                    <Skeleton className="h-4 w-1/2 motion-reduce:animate-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-10">
          <TaskCreateForm
            onCreate={addTask}
            projects={projects}
            projectsError={projectsError}
            onRetryProjects={retry}
          />
          <TaskList
            tasks={tasks}
            projects={projects}
            onCompletedChange={setTaskCompleted}
            onDelete={removeTask}
          />
        </div>
      )}
    </main>
  )
}
