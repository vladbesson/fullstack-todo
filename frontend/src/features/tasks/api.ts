import type { Task, TaskCreate, TaskUpdate } from "@/api/generated/types.gen"
import { client } from "@/api/client"
import {
  createTaskTasksPost,
  deleteTaskTasksTaskIdDelete,
  getTasksTasksGet,
  updateTaskTasksTaskIdPatch,
} from "@/api/generated/sdk.gen"

export const getTasks = async (
  projectId?: number,
  signal?: AbortSignal
): Promise<Task[]> => {
  const { data } = await getTasksTasksGet({
    client,
    query: projectId === undefined ? undefined : { project_id: projectId },
    signal,
    throwOnError: true,
  })

  return data
}

export const createTask = async (payload: TaskCreate): Promise<Task> => {
  const { data } = await createTaskTasksPost({
    client,
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
    client,
    path: { task_id: taskId },
    body: payload,
    throwOnError: true,
  })

  return data
}

export const deleteTask = async (taskId: number): Promise<void> => {
  await deleteTaskTasksTaskIdDelete({
    client,
    path: { task_id: taskId },
    throwOnError: true,
  })
}
