import type { FC } from "react"

export const SiteFooter: FC = () => {
  return (
    <footer className="mx-auto w-full max-w-3xl px-5 pb-6 sm:px-8 sm:pb-8">
      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Fullstack TODO</p>
            <p className="text-xs text-muted-foreground">One task at a time.</p>
          </div>
        </div>

        <a
          href="https://github.com/vladbesson/fullstack-todo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-md text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:self-center"
        >
          Source on GitHub
          <span className="sr-only"> (opens in a new tab)</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
