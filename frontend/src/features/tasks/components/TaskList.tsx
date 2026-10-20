import { type FC } from "react"
import type { Project, Task } from "@/api/generated/types.gen"
import { TaskItem } from "./TaskItem"

type TaskListProps = {
  tasks: Task[]
  projects: Project[] | null
  isFiltered: boolean
  onCompletedChange: (taskId: number, completed: boolean) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export const TaskList: FC<TaskListProps> = (props) => {
  const { tasks, projects, isFiltered, onCompletedChange, onDelete } = props
  const projectNames = new Map(
    (projects ?? []).map((project) => [project.id, project.name])
  )

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  )

  return (
    <section aria-labelledby="task-list-heading" className="space-y-4">
      <h2 id="task-list-heading" className="sr-only">
        Task list
      </h2>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <h3 className="font-medium">
            {isFiltered ? "No tasks in this project" : "No tasks yet"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {isFiltered
              ? "Choose another project, or add a task to this one."
              : "Add your first task above to get started."}
          </p>
        </div>
      ) : (
        <ul className="divide-y border-y">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectName={
                task.project_id === null
                  ? null
                  : (projectNames.get(task.project_id) ??
                    `Project #${task.project_id}`)
              }
              onCompletedChange={onCompletedChange}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
