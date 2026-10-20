import { useEffect, useState } from "react"
import type { Task, TaskCreate } from "@/api/generated/types.gen"
import { getTasks, createTask, updateTask, deleteTask } from "./api"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [requestId, setRequestId] = useState(0)
  const [pendingMutations, setPendingMutations] = useState(0)
  const [hasHiddenCreatedTask, setHasHiddenCreatedTask] = useState(false)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadTasks() {
      try {
        const data = await getTasks(projectId, controller.signal)

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
      controller.abort()
    }
  }, [projectId, requestId])

  const setProjectFilter = (nextProjectId: number | undefined) => {
    if (pendingMutations > 0 || nextProjectId === projectId) {
      return
    }

    setTasks(null)
    setError(null)
    setHasHiddenCreatedTask(false)
    setProjectId(nextProjectId)
  }

  const retry = () => {
    setTasks(null)
    setError(null)
    setRequestId((current) => current + 1)
  }

  const runMutation = async (operation: () => Promise<void>): Promise<void> => {
    setPendingMutations((current) => current + 1)

    try {
      await operation()
    } finally {
      setPendingMutations((current) => current - 1)
    }
  }

  const addTask = (payload: TaskCreate): Promise<void> =>
    runMutation(async () => {
      setHasHiddenCreatedTask(false)
      const created = await createTask(payload)

      if (projectId !== undefined && created.project_id !== projectId) {
        setHasHiddenCreatedTask(true)
        return
      }

      setTasks((current) => (current === null ? null : [...current, created]))
    })

  const setTaskCompleted = (
    taskId: number,
    completed: boolean
  ): Promise<void> =>
    runMutation(async () => {
      const updated = await updateTask(taskId, { completed })

      setTasks((current) =>
        current === null
          ? null
          : current.map((task) => (task.id === updated.id ? updated : task))
      )
    })

  const removeTask = (taskId: number): Promise<void> =>
    runMutation(async () => {
      await deleteTask(taskId)

      setTasks((current) =>
        current === null ? null : current.filter((task) => task.id !== taskId)
      )
    })

  return {
    tasks,
    error,
    projectId,
    setProjectFilter,
    retry,
    isMutating: pendingMutations > 0,
    hasHiddenCreatedTask,
    addTask,
    setTaskCompleted,
    removeTask,
  }
}
