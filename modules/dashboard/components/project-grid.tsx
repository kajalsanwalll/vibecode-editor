"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Project {
  id: string
  title: string
  description: string | null
  template: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface ProjectGridProps {
  projects: Project[]
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string }
  ) => Promise<unknown>
  onDeleteProject?: (id: string) => Promise<unknown>
  onDuplicateProject?: (id: string) => Promise<unknown>
}

const templateMeta: Record<string, { label: string; className: string }> = {
  REACT: { label: "React", className: "bg-sky-50 text-sky-700" },
  NEXTJS: { label: "Next.js", className: "bg-gray-100 text-gray-800" },
  EXPRESS: { label: "Express", className: "bg-green-50 text-green-700" },
  VUE: { label: "Vue", className: "bg-emerald-50 text-emerald-700" },
  HONO: { label: "Hono", className: "bg-orange-50 text-orange-700" },
  ANGULAR: { label: "Angular", className: "bg-red-50 text-red-700" },
}

const getTemplate = (key: string) =>
  templateMeta[key] ?? { label: key, className: "bg-gray-100 text-gray-700" }

export default function ProjectGrid({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: ProjectGridProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState("")
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  const [editing, setEditing] = useState<Project | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [deleting, setDeleting] = useState<Project | null>(null)

  const templatesInUse = useMemo(
    () => Array.from(new Set(projects.map((p) => p.template))),
    [projects]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesTemplate = !activeTemplate || p.template === activeTemplate
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      return matchesTemplate && matchesQuery
    })
  }, [projects, query, activeTemplate])

  const run = (
    action: () => Promise<unknown>,
    successMessage: string,
    onDone?: () => void
  ) => {
    startTransition(async () => {
      try {
        await action()
        toast.success(successMessage)
        onDone?.()
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong. Please try again.")
      }
    })
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setEditTitle(project.title)
    setEditDescription(project.description ?? "")
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="pl-9"
          />
        </div>
      </div>

      {/* Template filters */}
      {templatesInUse.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTemplate(null)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              activeTemplate === null
                ? "border-red-500 bg-red-500 text-white"
                : "bg-background text-muted-foreground hover:border-red-200 hover:text-foreground"
            }`}
          >
            All
          </button>
          {templatesInUse.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() =>
                setActiveTemplate(activeTemplate === template ? null : template)
              }
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                activeTemplate === template
                  ? "border-red-500 bg-red-500 text-white"
                  : "bg-background text-muted-foreground hover:border-red-200 hover:text-foreground"
              }`}
            >
              {getTemplate(template).label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No projects match your search.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const template = getTemplate(project.template)

            return (
              <div
                key={project.id}
                className="group relative flex flex-col rounded-2xl border bg-card p-6 transition hover:border-red-200 hover:shadow-md"
              >
                {/* Whole card is a link; the menu sits above it */}
                <Link
                  href={`/playground/${project.id}`}
                  aria-label={`Open ${project.title}`}
                  className="absolute inset-0 rounded-2xl"
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${template.className}`}
                  >
                    {template.label}
                  </span>

                  <div className="relative z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label="Project actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/playground/${project.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            run(
                              () => onDuplicateProject!(project.id),
                              "Project duplicated"
                            )
                          }
                          disabled={!onDuplicateProject}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleting(project)}
                          disabled={!onDeleteProject}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <h3 className="mt-6 line-clamp-1 text-lg font-semibold">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                  {project.description || "No description"}
                </p>

                <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">
                  Updated{" "}
                  {formatDistanceToNow(new Date(project.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Update the name and description of this project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Project name"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isPending || !editTitle.trim() || !onUpdateProject}
              onClick={() =>
                editing &&
                run(
                  () =>
                    onUpdateProject!(editing.id, {
                      title: editTitle.trim(),
                      description: editDescription.trim(),
                    }),
                  "Project updated",
                  () => setEditing(null)
                )
              }
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              {deleting?.title} and all of its files will be permanently
              deleted. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending || !onDeleteProject}
              onClick={() =>
                deleting &&
                run(
                  () => onDeleteProject!(deleting.id),
                  "Project deleted",
                  () => setDeleting(null)
                )
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}