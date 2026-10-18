import { type FC } from "react"
import { type Task } from "@/api/generated/types.gen"

type TaskItemProps = {
  task: Task
}

export const TaskItem: FC<TaskItemProps> = (props) => {
  const { task } = props

  return (
    <li className="flex min-h-16 items-start gap-3 px-4 py-4 sm:px-5">
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

      <span
        className={
          task.completed
            ? "min-w-0 flex-1 text-sm leading-6 [overflow-wrap:anywhere] text-muted-foreground line-through"
            : "min-w-0 flex-1 text-sm leading-6 [overflow-wrap:anywhere]"
        }
      >
        {task.title}
      </span>

      <span className="mt-0.5 shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {task.completed ? "Done" : "To do"}
      </span>
    </li>
  )
}
