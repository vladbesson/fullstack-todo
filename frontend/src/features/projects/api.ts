import { client } from "@/api/client"
import type { Project } from "@/api/generated/types.gen"
import { getProjectsProjectsGet } from "@/api/generated/sdk.gen"

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await getProjectsProjectsGet({
    client,
    throwOnError: true,
  })

  return data
}
