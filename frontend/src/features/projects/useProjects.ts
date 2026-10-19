import { useEffect, useState } from "react"
import type { Project, ProjectCreate } from "@/api/generated/types.gen"
import { createProject, getProjects } from "./api"

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadProjects = async () => {
      try {
        const data = await getProjects()

        if (!ignore) {
          setProjects(data)
        }
      } catch {
        if (!ignore) {
          setError(
            "Projects couldn't be loaded. You can still add a task without a project."
          )
        }
      }
    }

    void loadProjects()

    return () => {
      ignore = true
    }
  }, [requestId])

  const retry = () => {
    setProjects(null)
    setError(null)
    setRequestId((current) => current + 1)
  }

  const addProject = async (payload: ProjectCreate): Promise<Project> => {
    const created = await createProject(payload)

    setProjects((current) => [...(current ?? []), created])

    return created
  }

  return { projects, error, retry, addProject }
}
