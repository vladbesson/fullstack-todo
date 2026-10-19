import { useState, type FC, type SubmitEvent } from "react"
import type { Project, ProjectCreate } from "@/api/generated/types.gen"
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldLabel,
  Input,
} from "@/components/ui"

type ProjectCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: ProjectCreate) => Promise<Project>
  onCreated: (project: Project) => void
}

export const ProjectCreateDialog: FC<ProjectCreateDialogProps> = (props) => {
  const { open, onOpenChange, onCreate, onCreated } = props

  const [name, setName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openChangeHandler = (nextOpen: boolean) => {
    if (isCreating) {
      return
    }

    if (!nextOpen) {
      setName("")
      setError(null)
    }

    onOpenChange(nextOpen)
  }

  const submitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isCreating || name.trim() === "") {
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const created = await onCreate({ name: name.trim() })

      onCreated(created)
      onOpenChange(false)
      setName("")
    } catch {
      setError("Unable to create the project. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={openChangeHandler}>
      <DialogContent
        className="rounded-xl border shadow-xl"
        showCloseButton={!isCreating}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            New project
          </DialogTitle>
          <DialogDescription>Keep related tasks together.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
          aria-label="Create a project"
          aria-busy={isCreating}
        >
          <Field className="gap-2">
            <FieldLabel htmlFor="project-name">Project name</FieldLabel>
            <Input
              id="project-name"
              name="name"
              placeholder="e.g. Interview preparation"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={200}
              required
              disabled={isCreating}
              className="h-11 rounded-lg"
              aria-describedby={
                error !== null ? "project-create-error" : undefined
              }
            />
          </Field>

          {error !== null ? (
            <Alert variant="destructive">
              <AlertDescription id="project-create-error" role="alert">
                {error}
              </AlertDescription>
            </Alert>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg"
              disabled={isCreating}
              onClick={() => openChangeHandler(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-lg"
              disabled={isCreating || name.trim() === ""}
            >
              {isCreating ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
