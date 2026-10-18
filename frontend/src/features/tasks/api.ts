import type { Task, TaskCreate } from "@/api/generated/types.gen"

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")

if (!API_URL) {
  throw new Error("Set VITE_API_URL in the root .env file.")
}

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
