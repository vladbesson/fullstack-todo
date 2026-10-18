import type { Task, TaskCreate, TaskUpdate } from "@/api/generated/types.gen"
import { client } from "@/api/generated/client.gen"
import {
  createTaskTasksPost,
  deleteTaskTasksTaskIdDelete,
  getTasksTasksGet,
  updateTaskTasksTaskIdPatch,
} from "@/api/generated/sdk.gen"

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")

if (!API_URL) {
  throw new Error("Set VITE_API_URL in the root .env file.")
}

client.setConfig({
  baseUrl: API_URL,
})

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await getTasksTasksGet({
    throwOnError: true,
  })

  return data
}

export const createTask = async (payload: TaskCreate): Promise<Task> => {
  const { data } = await createTaskTasksPost({
    body: payload,
    throwOnError: true,
  })

  return data
}

export const updateTask = async (
  taskId: number,
  payload: TaskUpdate
): Promise<Task> => {
  const { data } = await updateTaskTasksTaskIdPatch({
    path: { task_id: taskId },
    body: payload,
    throwOnError: true,
  })

  return data
}

export const deleteTask = async (taskId: number): Promise<void> => {
  await deleteTaskTasksTaskIdDelete({
    path: { task_id: taskId },
    throwOnError: true,
  })
}
