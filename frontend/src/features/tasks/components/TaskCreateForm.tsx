import { useState, useCallback, type FC, type SubmitEvent } from "react"
import type { Project, TaskCreate } from "@/api/generated/types.gen"
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

type TaskCreateFormProps = {
  onCreate: (payload: TaskCreate) => Promise<void>
  projects: Project[] | null
  projectsError: string | null
  onRetryProjects: () => void
}

export const TaskCreateForm: FC<TaskCreateFormProps> = (props) => {
  const { onCreate, projects, projectsError, onRetryProjects } = props

  const [title, setTitle] = useState<string>("")
  const [projectId, setProjectId] = useState("none")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const isLoadingProjects = projects === null && projectsError === null
  const projectItems = [
    { value: "none", label: "No project" },
    ...(projects ?? []).map((project) => ({
      value: String(project.id),
      label: project.name,
    })),
  ]

  const submitHandler = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (isCreating || title.trim() === "") {
        return
      }

      setIsCreating(true)
      setCreateError(null)

      try {
        await onCreate({
          title: title.trim(),
          project_id: projectId === "none" ? null : Number(projectId),
        })
        setTitle("")
      } catch (error) {
        setCreateError(
          error instanceof Error
            ? error.message
            : "Unable to add task. Please try again."
        )
      } finally {
        setIsCreating(false)
      }
    },
    [title, projectId, isCreating, onCreate]
  )

  return (
    <form
      onSubmit={submitHandler}
      className="space-y-4 rounded-xl border bg-card p-4 sm:p-5"
      aria-label="Add a task"
      aria-busy={isCreating}
    >
      <h2 className="text-base font-semibold">Add a task</h2>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_auto] sm:items-end">
        <Field className="min-w-0 flex-1 gap-2">
          <FieldLabel htmlFor="task-title">Task title</FieldLabel>
          <Input
            id="task-title"
            name="title"
            placeholder="e.g. Learn SQL"
            className="h-11 rounded-lg caret-primary"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isCreating}
            maxLength={200}
          />
        </Field>

        <Field className="min-w-0 gap-2">
          <FieldLabel htmlFor="task-project">Project</FieldLabel>
          <Select
            items={projectItems}
            value={projectId}
            onValueChange={(value) => setProjectId(value ?? "none")}
            disabled={isCreating || projects === null || projects.length === 0}
          >
            <SelectTrigger
              id="task-project"
              className="w-full min-w-0 rounded-lg bg-background data-[size=default]:h-11"
              aria-describedby={
                projectsError !== null ? "projects-error" : undefined
              }
            >
              <SelectValue className="min-w-0 truncate">
                {isLoadingProjects ? "Loading projects…" : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {projectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <span className="truncate">{item.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Button
          type="submit"
          className="h-11 w-full rounded-lg px-5 sm:w-auto"
          disabled={isCreating || title.trim() === ""}
        >
          {isCreating ? "Adding…" : "Add task"}
        </Button>
      </div>

      {projectsError !== null ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <p id="projects-error" role="alert" className="text-muted-foreground">
            {projectsError}
          </p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={onRetryProjects}
          >
            Try again
          </Button>
        </div>
      ) : projects?.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No projects yet. Tasks will be created without a project.
        </p>
      ) : null}

      {createError !== null ? (
        <Alert variant="destructive">
          <AlertDescription>{createError}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  )
}
