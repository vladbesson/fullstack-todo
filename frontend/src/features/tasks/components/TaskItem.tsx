import { type FC, useState } from "react"
import { type Task } from "@/api/generated/types.gen"
import { Button } from "@/components/ui"

type TaskItemProps = {
  task: Task
  onCompletedChange: (taskId: number, completed: boolean) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export const TaskItem: FC<TaskItemProps> = (props) => {
  const { task, onCompletedChange, onDelete } = props

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClickHandler = async (): Promise<void> => {
    if (isPending) {
      return
    }

    setIsPending(true)
    setError(null)

    try {
      await onCompletedChange(task.id, !task.completed)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update task. Please try again."
      )
    } finally {
      setIsPending(false)
    }
  }

  const onDeleteHandler = async (): Promise<void> => {
    if (isPending) {
      return
    }

    setIsPending(true)
    setError(null)

    try {
      await onDelete(task.id)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete task. Please try again."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <li className="flex min-h-16 items-center gap-3 px-4 py-4 sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={onClickHandler}
        aria-pressed={task.completed}
        aria-label={
          task.completed
            ? `Mark "${task.title}" as incomplete`
            : `Mark "${task.title}" as complete`
        }
      >
        <span
          aria-hidden="true"
          className={
            task.completed
              ? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              : "mt-0.5 size-5 shrink-0 rounded-full border-2 border-muted-foreground/60"
          }
        >
          {task.completed ? (
            <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </Button>

      <div className="min-w-0 flex-1 text-sm leading-6 wrap-anywhere">
        <p
          className={
            task.completed ? "text-muted-foreground line-through" : undefined
          }
        >
          {task.title}
        </p>

        {error !== null ? (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        disabled={isPending}
        onClick={onDeleteHandler}
        aria-label={`Delete "${task.title}"`}
      >
        Delete
      </Button>
    </li>
  )
}
