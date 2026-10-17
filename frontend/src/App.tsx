import { useEffect, useState } from "react"
import type { Task } from "@/api/generated/types.gen"

export function App() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadTasks() {
      try {
        const response = await fetch("http://127.0.0.1:8000/tasks")

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: HTTP ${response.status}`)
        }

        const data: Task[] = await response.json()

        if (!ignore) {
          setTasks(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error instanceof Error ? error.message : "Неизвестная ошибка"
          )
        }
      }
    }

    void loadTasks()

    return () => {
      ignore = true
    }
  }, [])

  if (error !== null) {
    return <p role="alert">{error}</p>
  }

  if (tasks === null) {
    return <p>Загрузка задач…</p>
  }

  return (
    <main className="mx-auto max-w-lg space-y-4 p-6">
      <h1 className="text-2xl font-bold">Задачи</h1>

      {tasks.length === 0 ? (
        <p>Задач пока нет</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              {task.completed ? "✓" : "○"} {task.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
