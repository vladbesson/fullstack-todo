import { type Task, type TaskCreate } from "@/api/generated/types.gen"

const API_URL = "http://127.0.0.1:8000"

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`)

  if (!response.ok) {
    throw new Error(`Unable to load tasks (HTTP ${response.status}).`)
  }

  return response.json()
}

export const createTask = async (payload: TaskCreate): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Unable to add task (HTTP ${response.status}).`)
  }

  return response.json()
}
