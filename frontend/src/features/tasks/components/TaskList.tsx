import { type FC } from "react"
import { type Task } from "@/api/generated/types.gen"
import { TaskItem } from "./TaskItem"

type TaskListProps = {
  tasks: Task[]
  onCompletedChange: (taskId: number, completed: boolean) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export const TaskList: FC<TaskListProps> = (props) => {
  const { tasks, onCompletedChange, onDelete } = props

  const completedCount = tasks.filter((task) => task.completed).length
  const openCount = tasks.length - completedCount

  return (
    <section aria-labelledby="task-list-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="task-list-heading" className="text-base font-semibold">
          Your tasks
        </h2>
        <p className="text-xs text-muted-foreground tabular-nums sm:text-sm">
          {openCount} open · {completedCount} done
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <h3 className="font-medium">No tasks yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first task above to get started.
          </p>
        </div>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onCompletedChange={onCompletedChange}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
