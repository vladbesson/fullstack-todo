import { useState, useCallback, type FC, type SubmitEvent } from "react"
import { type TaskCreate } from "@/api/generated/types.gen"
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldLabel,
  Input,
} from "@/components/ui"

type TaskCreateFormProps = {
  onCreate: (payload: TaskCreate) => Promise<void>
}

export const TaskCreateForm: FC<TaskCreateFormProps> = (props) => {
  const { onCreate } = props

  const [title, setTitle] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const submitHandler = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (isCreating || title.trim() === "") {
        return
      }

      setIsCreating(true)
      setCreateError(null)

      try {
        await onCreate({ title: title.trim() })
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
    [title, isCreating, onCreate]
  )

  return (
    <form
      onSubmit={submitHandler}
      className="space-y-3"
      aria-label="Add a task"
      aria-busy={isCreating}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
          />
        </Field>

        <Button
          type="submit"
          className="h-11 w-full rounded-lg px-5 sm:w-auto"
          disabled={isCreating || title.trim() === ""}
        >
          {isCreating ? "Adding…" : "Add task"}
        </Button>
      </div>

      {createError !== null ? (
        <Alert variant="destructive">
          <AlertDescription>{createError}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  )
}
