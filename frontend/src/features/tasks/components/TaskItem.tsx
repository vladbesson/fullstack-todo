import { type FC, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, Folder01Icon } from "@hugeicons/core-free-icons"
import { type Task } from "@/api/generated/types.gen"
import { Button } from "@/components/ui"

type TaskItemProps = {
  task: Task
  projectName: string | null
  onCompletedChange: (taskId: number, completed: boolean) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export const TaskItem: FC<TaskItemProps> = (props) => {
  const { task, projectName, onCompletedChange, onDelete } = props

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
    <li className="flex min-h-18 items-center gap-2 py-3 sm:gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 rounded-full"
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

      <div className="min-w-0 flex-1 text-base leading-6 wrap-anywhere">
        <p
          className={
            task.completed
              ? "text-muted-foreground line-through"
              : "font-medium"
          }
        >
          {task.title}
        </p>

        {projectName !== null ? (
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <HugeiconsIcon
              icon={Folder01Icon}
              size={14}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0"
            />
            <span>{projectName}</span>
          </p>
        ) : null}

        {error !== null ? (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 rounded-lg text-muted-foreground/70 hover:text-destructive focus-visible:text-destructive"
        disabled={isPending}
        onClick={onDeleteHandler}
        aria-label={`Delete "${task.title}"`}
        title={`Delete "${task.title}"`}
      >
        <HugeiconsIcon
          icon={Delete02Icon}
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Button>
    </li>
  )
}
