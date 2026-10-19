import { client } from "@/api/client"
import type { Project, ProjectCreate } from "@/api/generated/types.gen"
import {
  createProjectProjectsPost,
  getProjectsProjectsGet,
} from "@/api/generated/sdk.gen"

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await getProjectsProjectsGet({
    client,
    throwOnError: true,
  })

  return data
}

export const createProject = async (
  payload: ProjectCreate
): Promise<Project> => {
  const { data } = await createProjectProjectsPost({
    client,
    body: payload,
    throwOnError: true,
  })

  return data
}
