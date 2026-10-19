import { useState, useCallback, type FC, type SubmitEvent } from "react"
import type {
  Project,
  ProjectCreate,
  TaskCreate,
} from "@/api/generated/types.gen"
import { ProjectCreateDialog } from "@/features/projects/components/ProjectCreateDialog"
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
  onCreateProject: (payload: ProjectCreate) => Promise<Project>
  projects: Project[] | null
  projectsError: string | null
  onRetryProjects: () => void
}

export const TaskCreateForm: FC<TaskCreateFormProps> = (props) => {
  const {
    onCreate,
    onCreateProject,
    projects,
    projectsError,
    onRetryProjects,
  } = props

  const [title, setTitle] = useState<string>("")
  const [projectId, setProjectId] = useState("none")
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
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
    <>
      <form
        onSubmit={submitHandler}
        className="space-y-3"
        aria-label="Add a task"
        aria-busy={isCreating}
      >
        <div className="flex items-end gap-2">
          <Field className="min-w-0 flex-1 gap-0">
            <FieldLabel htmlFor="task-title" className="sr-only">
              Task title
            </FieldLabel>
            <Input
              id="task-title"
              name="title"
              placeholder="Add a task…"
              className="h-12 rounded-lg px-4 caret-primary md:text-base"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isCreating}
              maxLength={200}
            />
          </Field>

          <Button
            type="submit"
            className="h-12 rounded-lg px-4 sm:px-5"
            disabled={isCreating || title.trim() === ""}
          >
            {isCreating ? "Adding…" : "Add task"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Field className="min-w-0 flex-1 gap-0 sm:w-60 sm:flex-none">
            <FieldLabel htmlFor="task-project" className="sr-only">
              Project
            </FieldLabel>
            <Select
              items={projectItems}
              value={projectId}
              onValueChange={(value) => setProjectId(value ?? "none")}
              disabled={
                isCreating || projects === null || projects.length === 0
              }
            >
              <SelectTrigger
                id="task-project"
                className="w-full min-w-0 rounded-lg text-muted-foreground data-[size=default]:h-11"
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
            type="button"
            variant="outline"
            className="h-11 rounded-lg px-3 text-muted-foreground hover:text-foreground"
            disabled={isCreating || projects === null}
            onClick={() => setIsProjectDialogOpen(true)}
            aria-haspopup="dialog"
          >
            <span aria-hidden="true" className="text-base leading-none">
              +
            </span>
            New project
          </Button>
        </div>

        {projectsError !== null ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <p
              id="projects-error"
              role="alert"
              className="text-muted-foreground"
            >
              {projectsError}
            </p>
            <Button
              type="button"
              variant="link"
              className="min-h-11 px-2"
              onClick={onRetryProjects}
            >
              Try again
            </Button>
          </div>
        ) : projects?.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No projects yet. Create one, or add a task without a project.
          </p>
        ) : null}

        {createError !== null ? (
          <Alert variant="destructive">
            <AlertDescription>{createError}</AlertDescription>
          </Alert>
        ) : null}
      </form>
      <ProjectCreateDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onCreate={onCreateProject}
        onCreated={(project) => setProjectId(String(project.id))}
      />
    </>
  )
}
