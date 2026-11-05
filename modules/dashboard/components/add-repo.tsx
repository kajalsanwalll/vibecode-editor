"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { importGithubRepo } from "@/modules/dashboard/actions/github"

const AddRepo = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleImport = () => {
    setError(null)
    startTransition(async () => {
      const result = await importGithubRepo(url)

      if (!result.success) {
        setError(result.error)
        return
      }

      toast.success(
        result.skipped > 0
          ? `Repository imported. ${result.skipped} files were skipped.`
          : "Repository imported"
      )
      setOpen(false)
      setUrl("")
      router.push(`/playground/${result.id}`)
    })
  }

  return (
    <>
      {/* div instead of button so the icon box inside can't nest buttons */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
      transition-all duration-300 ease-in-out
      hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
      shadow-[0_2px_10px_rgba(0,0,0,0.08)]
      hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-white transition-colors duration-300 group-hover:border-[#E93F3F] group-hover:bg-[#fff8f8] group-hover:text-[#E93F3F]">
            <ArrowDown
              size={20}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">Open Github Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Work with your repositories in our editor
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a GitHub repository</DialogTitle>
            <DialogDescription>
              Paste the link to a public repository. Its files are copied into a
              new project that you can edit and run.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (url.trim() && !isPending) handleImport()
            }}
            className="space-y-3 py-2"
          >
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              autoFocus
              disabled={isPending}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Lock files, build folders, images and files over 256 KB are skipped.
            </p>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={isPending || !url.trim()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing
                  </>
                ) : (
                  "Import repository"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddRepo