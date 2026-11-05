# VibeCode Editor

A browser-based IDE with an AI coding assistant and in-browser code execution. Built with Next.js, Monaco Editor, WebContainers, and local LLMs through Ollama.

## Features

- **Authentication**: Google and GitHub sign-in with NextAuth
- **Project templates**: React, Next.js, Express, Hono, Vue, and Angular
- **File explorer**: Create, rename, delete, and organize files and folders
- **Code editor**: Monaco Editor with syntax highlighting, formatting, and keybindings
- **AI autocomplete**: Inline suggestions from local models running on Ollama
- **AI chat**: Share files with the assistant for help, refactors, and explanations
- **Instant execution**: Run frontend and backend apps in the browser with WebContainers
- **Integrated terminal**: Interactive shell powered by xterm.js
- **Themes**: Light and dark mode

## Tech Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Next.js 15 (App Router)          |
| Language   | TypeScript                       |
| Styling    | Tailwind CSS v4, shadcn/ui       |
| Auth       | NextAuth (Google, GitHub)        |
| Editor     | Monaco Editor                    |
| AI         | Ollama (local LLMs)              |
| Runtime    | WebContainers                    |
| Terminal   | xterm.js                         |
| Database   | MongoDB via Prisma               |

## Prerequisites

- Node.js 20 or later
- A MongoDB database (local or hosted)
- [Ollama](https://ollama.com/) installed locally
- Google and/or GitHub OAuth app credentials

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/your-username/vibecode-editor.git
   cd vibecode-editor
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values:

   ```env
   AUTH_SECRET=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   AUTH_GITHUB_ID=
   AUTH_GITHUB_SECRET=
   DATABASE_URL=
   NEXTAUTH_URL=http://localhost:3000
   ```

   Generate `AUTH_SECRET` with `npx auth secret` or `openssl rand -base64 32`.

3. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start a local model:

   ```bash
   ollama run codellama
   ```

   Any Ollama model that supports code generation will work.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Keyboard Shortcuts

| Shortcut                   | Action                |
| -------------------------- | --------------------- |
| `Ctrl + Space`             | Trigger AI suggestion |
| `Enter` twice              | Trigger AI suggestion |
| `Tab`                      | Accept suggestion     |

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint`  | Lint the codebase        |

## Troubleshooting

- **Page looks unstyled or spacing is missing**: delete the `.next` folder and restart the dev server.
- **Prisma client errors**: run `npx prisma generate` after installing or changing the schema.
- **No AI suggestions**: confirm Ollama is running and the model is pulled.

## Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Ollama](https://ollama.com/)
- [WebContainers](https://webcontainers.io/)
- [xterm.js](https://xtermjs.org/)
- [NextAuth.js](https://next-auth.js.org/)