# Synapzi AI 

Synapzi AI is a simple AI-powered student learning platform demo — upload PDFs or notes and use AI to generate summaries, quizzes, revision notes, and chat with your uploaded material.

This repository is a Next.js (App Router, TypeScript) frontend plus a small Express backend used for PDF extraction and AI endpoints.

## Key features

- Upload PDFs or paste notes and extract text
- Generate summaries, key points, revision notes, and quizzes
- Chat with your notes (answers restricted to uploaded material)
- Multilingual support (English, Hindi, Kannada)
- Demo-mode sign-in that routes to the dashboard (no enforced auth)

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- Express server for PDF extraction & AI endpoints (server/index.js)
- AI integration: Gemini (or local fallback prompts)

## Development

Prerequisites: Node.js 18+ and npm.

Install dependencies:

```bash
npm install
```

Run frontend dev server:

```bash
npm run dev
# or
next dev
```

Run backend (API used for PDF extraction and AI endpoints):

```bash
node server/index.js
# default: http://localhost:4000 (see NEXT_PUBLIC_API_BASE_URL in frontend)
```

By default the frontend expects the API base at `http://localhost:4000`. You can change that via `NEXT_PUBLIC_API_BASE_URL`.

## Scripts

Typical scripts (check `package.json`):

- `npm run dev` — start Next dev server
- `npm run build` — build for production
- `npm run start` — start built Next app (if configured)

## Notable API endpoints (backend)

- `POST /notes/extract` — accepts `multipart/form-data` `file` (PDF) and returns extracted text
- `POST /ai/summary` — generate note artifact / summary
- `POST /ai/chat` — ask a question against provided note text
- `POST /ai/quiz` — generate quiz questions
- `GET /health` — basic server health

## Branding & migration notes

- Project was renamed from NoteMind AI → Synapzi AI. UI strings and theme key changed to `synapzi-theme` in several files.
- Some build artifacts in `.next` may still contain the old name until you run a fresh build.

## Next steps / recommendations

- Run a full search & replace across `src/` for any remaining legacy references.
- Run `npm run build` to regenerate `.next` so the public pages reflect renamed text.
- Optionally create a compatibility re-export for `src/lib/notemind.ts` → `src/lib/synapzi.ts` before removing old files.

## Contact

For questions or changes: hello@synapzi.ai

---

Generated README for local development and quick onboarding.
