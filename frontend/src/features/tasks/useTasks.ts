import { useEffect, useState } from "react"
import { type Task, type TaskCreate } from "@/api/generated/types.gen"
import { getTasks, createTask, updateTask } from "./api"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadTasks() {
      try {
        const data = await getTasks()

        if (!ignore) {
          setTasks(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load tasks. Please try again."
          )
        }
      }
    }

    void loadTasks()

    return () => {
      ignore = true
    }
  }, [])

  const addTask = async (payload: TaskCreate): Promise<void> => {
    const created = await createTask(payload)

    setTasks((current) => [...(current ?? []), created])
  }

  const setTaskCompleted = async (
    taskId: number,
    completed: boolean
  ): Promise<void> => {
    const updated = await updateTask(taskId, { completed })

    setTasks((current) =>
      current === null
        ? null
        : current.map((task) => (task.id === updated.id ? updated : task))
    )
  }

  return {
    tasks,
    error,
    addTask,
    setTaskCompleted,
  }
}
