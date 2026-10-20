import type { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from "@/components/ui"
import { useProjects } from "@/features/projects/useProjects"
import { useTasks } from "../useTasks"
import { TaskCreateForm } from "./TaskCreateForm"
import { TaskList } from "./TaskList"
import { TaskProjectFilter } from "./TaskProjectFilter"

export const TasksPage: FC = () => {
  const {
    tasks,
    error,
    projectId,
    setProjectFilter,
    retry: retryTasks,
    isMutating,
    hasHiddenCreatedTask,
    addTask,
    setTaskCompleted,
    removeTask,
  } = useTasks()
  const {
    projects,
    error: projectsError,
    retry: retryProjects,
    addProject,
  } = useProjects()
  const completedCount = tasks?.filter((task) => task.completed).length ?? 0
  const openCount = (tasks?.length ?? 0) - completedCount

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-7 px-5 py-10 sm:space-y-8 sm:px-8 sm:py-14">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Tasks
        </h1>
        <p className="text-sm text-muted-foreground tabular-nums">
          {tasks === null
            ? "One task at a time."
            : `${openCount} open · ${completedCount} completed`}
        </p>
      </header>

      <TaskCreateForm
        onCreate={addTask}
        onCreateProject={addProject}
        projects={projects}
        projectsError={projectsError}
        onRetryProjects={retryProjects}
        disabled={tasks === null}
      />

      <div className="space-y-4">
        <TaskProjectFilter
          projects={projects}
          projectId={projectId}
          disabled={isMutating}
          onChange={setProjectFilter}
        />

        {hasHiddenCreatedTask ? (
          <div
            role="status"
            className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground"
          >
            <p>Task added outside this view.</p>
            <Button
              type="button"
              variant="link"
              className="min-h-11 px-1"
              onClick={() => setProjectFilter(undefined)}
            >
              Show all tasks
            </Button>
          </div>
        ) : null}

        {error !== null ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load tasks</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 min-h-11"
                onClick={retryTasks}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : tasks === null ? (
          <section aria-busy="true" aria-label="Task list">
            <p role="status" className="sr-only">
              Loading tasks…
            </p>
            <div aria-hidden="true">
              <div className="divide-y border-y">
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
          </section>
        ) : (
          <TaskList
            tasks={tasks}
            projects={projects}
            isFiltered={projectId !== undefined}
            onCompletedChange={setTaskCompleted}
            onDelete={removeTask}
          />
        )}
      </div>
    </main>
  )
}
