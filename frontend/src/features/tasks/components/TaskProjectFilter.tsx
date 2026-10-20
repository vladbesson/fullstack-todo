import type { FC } from "react"
import type { Project } from "@/api/generated/types.gen"
import {
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

type TaskProjectFilterProps = {
  projects: Project[] | null
  projectId: number | undefined
  disabled: boolean
  onChange: (projectId: number | undefined) => void
}

export const TaskProjectFilter: FC<TaskProjectFilterProps> = (props) => {
  const { projects, projectId, disabled, onChange } = props
  const items = [
    { value: "all", label: "All projects" },
    ...(projects ?? []).map((project) => ({
      value: String(project.id),
      label: project.name,
    })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <FieldLabel
        htmlFor="task-project-filter"
        className="text-sm font-normal text-muted-foreground"
      >
        Show tasks from
      </FieldLabel>
      <Select
        items={items}
        value={projectId === undefined ? "all" : String(projectId)}
        onValueChange={(value) =>
          onChange(
            value === null || value === "all" ? undefined : Number(value)
          )
        }
        disabled={disabled || projects === null}
      >
        <SelectTrigger
          id="task-project-filter"
          className="w-full min-w-0 rounded-lg data-[size=default]:h-11 sm:w-60"
        >
          <SelectValue className="min-w-0 truncate" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span
                className="max-w-[calc(var(--anchor-width)-3rem)] truncate"
                title={item.label}
              >
                {item.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
