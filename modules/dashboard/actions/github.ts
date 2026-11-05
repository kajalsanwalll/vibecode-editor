"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";

type RepoFile = { filename: string; fileExtension: string; content: string };
type RepoFolder = { folderName: string; items: (RepoFile | RepoFolder)[] };
type TemplateKey = "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";

type ImportResult =
  | { success: true; id: string; skipped: number }
  | { success: false; error: string };

// Limits keep the saved project small enough for the database and the browser
const MAX_FILES = 400;
const MAX_FILE_BYTES = 256 * 1024;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  ".idea",
  ".vscode",
  "dist",
  "build",
  "coverage",
]);

const IGNORED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  ".DS_Store",
]);

const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "ico", "bmp", "pdf", "zip", "gz",
  "tar", "mp4", "mp3", "mov", "woff", "woff2", "ttf", "eot", "otf",
]);

function parseRepo(input: string) {
  const cleaned = input.trim().replace(/\.git$/, "").replace(/\/+$/, "");

  const urlMatch = cleaned.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/tree\/([^/]+))?/i
  );
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2], branch: urlMatch[3] };
  }

  const shortMatch = cleaned.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2], branch: undefined };
  }

  return null;
}

async function github(apiPath: string, token?: string) {
  const request = (auth?: string) =>
    fetch(`https://api.github.com${apiPath}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "vibecode-editor",
        ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      },
      cache: "no-store",
    });

  const res = await request(token);
  // An expired or invalid saved token should not block public repos
  if (res.status === 401 && token) return request();
  return res;
}

function explain(res: Response) {
  if (res.status === 404) {
    return "Repository not found. Check the URL. Private repositories aren't supported yet.";
  }
  if (res.status === 403 || res.status === 429) {
    return "GitHub rate limit reached. Try again in a few minutes.";
  }
  return `GitHub returned an error (${res.status}).`;
}

function shouldSkip(filePath: string) {
  const parts = filePath.split("/");
  const name = parts[parts.length - 1];
  const ext = path.extname(name).slice(1).toLowerCase();

  return (
    parts.some((part) => IGNORED_DIRS.has(part)) ||
    IGNORED_FILES.has(name) ||
    BINARY_EXTENSIONS.has(ext)
  );
}

function insertFile(root: RepoFolder, filePath: string, content: string) {
  const parts = filePath.split("/");
  const fileName = parts.pop()!;

  let node = root;
  for (const part of parts) {
    let next = node.items.find(
      (item): item is RepoFolder => "folderName" in item && item.folderName === part
    );
    if (!next) {
      next = { folderName: part, items: [] };
      node.items.push(next);
    }
    node = next;
  }

  // Same split the template loader uses: "package.json" -> "package" + "json"
  const parsed = path.parse(fileName);
  node.items.push({
    filename: parsed.name,
    fileExtension: parsed.ext.slice(1),
    content,
  });
}

function detectTemplate(packageJson: string | undefined): TemplateKey {
  if (!packageJson) return "REACT";
  try {
    const pkg = JSON.parse(packageJson);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps["next"]) return "NEXTJS";
    if (deps["@angular/core"]) return "ANGULAR";
    if (deps["vue"]) return "VUE";
    if (deps["hono"]) return "HONO";
    if (deps["express"]) return "EXPRESS";
  } catch {
    // fall through to the default
  }
  return "REACT";
}

export const importGithubRepo = async (input: string): Promise<ImportResult> => {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "You must be logged in to import a repository." };
  }

  const parsed = parseRepo(input);
  if (!parsed) {
    return {
      success: false,
      error: "Enter a GitHub URL like https://github.com/owner/repo",
    };
  }
  const { owner, repo } = parsed;

  try {
    // A saved GitHub token only raises the API rate limit for public repos
    const account = await db.account.findFirst({
      where: { userId: user.id, provider: "github" },
      select: { access_token: true },
    });
    const token = account?.access_token ?? undefined;

    const repoRes = await github(`/repos/${owner}/${repo}`, token);
    if (!repoRes.ok) return { success: false, error: explain(repoRes) };
    const repoInfo = await repoRes.json();

    const branch: string = parsed.branch ?? repoInfo.default_branch;

    const treeRes = await github(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      token
    );
    if (!treeRes.ok) return { success: false, error: explain(treeRes) };
    const treeData = await treeRes.json();

    const allBlobs: { path: string; size?: number }[] = treeData.tree.filter(
      (entry: { type: string }) => entry.type === "blob"
    );
    const candidates = allBlobs.filter(
      (entry) => !shouldSkip(entry.path) && (entry.size ?? 0) <= MAX_FILE_BYTES
    );
    const selected = candidates.slice(0, MAX_FILES);

    let skipped = allBlobs.length - selected.length;

    // Download file contents in small parallel batches
    const downloaded: { path: string; content: string }[] = [];
    for (let i = 0; i < selected.length; i += 20) {
      const batch = selected.slice(i, i + 20);
      const results = await Promise.all(
        batch.map(async (entry) => {
          const url = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${entry.path
            .split("/")
            .map(encodeURIComponent)
            .join("/")}`;
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) return null;
          const content = await res.text();
          if (content.includes("\u0000")) return null; // binary file
          return { path: entry.path, content };
        })
      );
      for (const result of results) {
        if (result) downloaded.push(result);
        else skipped++;
      }
    }

    const root: RepoFolder = { folderName: repoInfo.name, items: [] };
    let totalBytes = 0;
    downloaded.sort((a, b) => a.path.localeCompare(b.path));

    for (const file of downloaded) {
      totalBytes += file.content.length;
      if (totalBytes > MAX_TOTAL_BYTES) {
        skipped++;
        continue;
      }
      insertFile(root, file.path, file.content);
    }

    if (root.items.length === 0) {
      return { success: false, error: "No importable files were found in this repository." };
    }

    const packageJson = downloaded.find((f) => f.path === "package.json")?.content;

    const playground = await db.playground.create({
      data: {
        title: repoInfo.name,
        description:
          repoInfo.description ?? `Imported from github.com/${owner}/${repo}`,
        template: detectTemplate(packageJson),
        userId: user.id,
        templateFiles: {
          create: { content: JSON.stringify(root) },
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, id: playground.id, skipped };
  } catch (error) {
    console.error("GitHub import error:", error);
    return { success: false, error: "Failed to import the repository. Please try again." };
  }
};