import type { FC } from "react"
import { SiteFooter } from "@/components/SiteFooter"
import { TasksPage } from "@/features/tasks/components/TasksPage"

export const App: FC = () => {
  return (
    <div className="flex min-h-svh flex-col bg-muted/20 selection:bg-primary selection:text-primary-foreground">
      <TasksPage />
      <SiteFooter />
    </div>
  )
}
