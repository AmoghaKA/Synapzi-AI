"use client";

import { useEffect, useMemo, useState } from "react";
import {
  answerFromNotes,
  buildNoteArtifact,
  buildQuizQuestions,
  evaluateQuizQuestion,
  normalizeText,
  splitSentences,
  type NoteArtifact,
  type QuizQuestion,
  type StudyLanguage,
} from "@/lib/note-tools";

type NoteRecord = {
  id: string;
  title: string;
  source: string;
  createdAt: string;
  text: string;
  artifact: NoteArtifact;
  quiz: QuizQuestion[];
};

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const languages: StudyLanguage[] = ["English", "Hindi", "Kannada"];
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createNoteRecord(title: string, text: string, source: string): NoteRecord {
  const artifact = buildNoteArtifact(text);
  return {
    id: uid(),
    title,
    source,
    createdAt: new Date().toLocaleString(),
    text,
    artifact,
    quiz: buildQuizQuestions(text),
  };
}

function createSampleNote() {
  const text =
    "Chapter 2 explains force, motion, and Newton's laws. A balanced force keeps an object in equilibrium. The formula F = ma connects mass and acceleration. Important concepts include inertia, friction, and free-body diagrams.";

  return createNoteRecord("Physics Chapter 2", text, "Sample note");
}

async function readFileText(file: File) {
  if (file.type === "application/pdf") {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiBase}/notes/extract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to extract PDF text.");
    }

    const data = (await response.json()) as { text: string; title?: string };
    return {
      title: data.title || file.name.replace(/\.pdf$/i, ""),
      text: normalizeText(data.text),
    };
  }

  const text = normalizeText(await file.text());
  return {
    title: file.name.replace(/\.[^.]+$/, ""),
    text,
  };
}

async function fetchJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return (await response.json()) as T;
}

export default function SynapziStudio() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<StudyLanguage>("English");
  const [notes, setNotes] = useState<NoteRecord[]>([createSampleNote()]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0].id);
  const [manualNote, setManualNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content: "Upload a note, then ask anything from it. The assistant will answer only from the selected note.",
    },
  ]);
  const [quizResponses, setQuizResponses] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const activeNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? notes[0], [activeNoteId, notes]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("synapzi-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme ?? (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("synapzi-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (activeNoteId && !notes.some((note) => note.id === activeNoteId)) {
      setActiveNoteId(notes[0]?.id ?? "");
    }
  }, [activeNoteId, notes]);

  async function addNoteFromText(title: string, text: string, source: string) {
    const response = await fetchJson<{ artifact?: NoteArtifact; quiz?: QuizQuestion[] }>("/ai/summary", {
      noteText: text,
      language,
    }).catch(() => null);

    const note: NoteRecord = {
      id: uid(),
      title,
      source,
      createdAt: new Date().toLocaleString(),
      text,
      artifact: response?.artifact ?? buildNoteArtifact(text),
      quiz: response?.quiz ?? buildQuizQuestions(text),
    };

    setNotes((current) => [note, ...current]);
    setActiveNoteId(note.id);
    setQuizResponses({});
    setQuizScore(null);
  }

  async function handleUpload() {
    if (!manualNote.trim()) {
      return;
    }

    setBusy(true);
    try {
      await addNoteFromText("Pasted notes", normalizeText(manualNote), "Pasted text");
      setManualNote("");
    } finally {
      setBusy(false);
    }
  }

  async function handleFileUpload(file: File | null) {
    if (!file) {
      return;
    }

    setBusy(true);
    try {
      const extracted = await readFileText(file);
      await addNoteFromText(extracted.title || file.name, extracted.text, file.name);
    } finally {
      setBusy(false);
    }
  }

  async function generateChatAnswer() {
    const question = chatInput.trim();
    if (!question || !activeNote) {
      return;
    }

    setBusy(true);
    setChatTurns((current) => [...current, { role: "user", content: question }]);
    try {
      const data = await fetchJson<{ answer: string }>("/ai/chat", {
        noteText: activeNote.text,
        question,
        language,
      }).catch(() => ({ answer: answerFromNotes(activeNote.text, question, language) }));

      setChatTurns((current) => [...current, { role: "assistant", content: data.answer }]);
      setChatInput("");
    } finally {
      setBusy(false);
    }
  }

  async function generateQuiz() {
    if (!activeNote) {
      return;
    }

    setBusy(true);
    try {
      const data = await fetchJson<{ quiz: QuizQuestion[] }>("/ai/quiz", {
        noteText: activeNote.text,
        language,
      }).catch(() => ({ quiz: buildQuizQuestions(activeNote.text) }));

      setNotes((current) => current.map((note) => (note.id === activeNote.id ? { ...note, quiz: data.quiz } : note)));
      setQuizResponses({});
      setQuizScore(null);
    } finally {
      setBusy(false);
    }
  }

  function submitQuiz() {
    if (!activeNote) {
      return;
    }

    const score = activeNote.quiz.reduce((total, question) => {
      return total + (evaluateQuizQuestion(question, quizResponses[question.id] ?? "") ? 1 : 0);
    }, 0);

    setQuizScore(score);
  }

  const stats = [
    { label: "Uploaded notes", value: notes.length.toString() },
    { label: "Key concepts", value: activeNote?.artifact.keyConcepts.length.toString() ?? "0" },
    { label: "Quiz cards", value: activeNote?.quiz.length.toString() ?? "0" },
    { label: "Languages", value: "3" },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="sticky top-4 z-20 mb-6 rounded-3xl border border-white/20 bg-[var(--surface)] px-4 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/30">
              N
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-cyan-300">Synapzi AI</p>
              <p className="text-sm text-[var(--muted)]">Study smarter from your own notes</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="hidden gap-5 text-sm font-medium text-[var(--muted)] md:flex">
              <a href="#dashboard" className="transition hover:text-[var(--foreground)]">
                Dashboard
              </a>
              <a href="#features" className="transition hover:text-[var(--foreground)]">
                Features
              </a>
              <a href="#faq" className="transition hover:text-[var(--foreground)]">
                FAQ
              </a>
            </nav>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as StudyLanguage)}
              className="rounded-2xl border border-white/20 bg-[var(--surface-strong)] px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-400"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="rounded-2xl border border-white/20 bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-cyan-200">
            AI study assistant
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-balance text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Upload notes, ask questions, and revise faster with Synapzi AI.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              A focused MVP for students: PDF upload, summaries, note chat, quiz generation, revision sheets, and multilingual answers from a clean dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#dashboard" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-cyan-300 dark:text-slate-950">
              Open dashboard
            </a>
            <a href="#features" className="rounded-2xl border border-white/20 bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 dark:bg-slate-900/70">
              Explore features
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/20 bg-[var(--surface-strong)] p-5 shadow-sm transition hover:-translate-y-1">
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              <p className="mt-3 text-3xl font-black tracking-tight text-[var(--foreground)]">{stat.value}</p>
            </article>
          ))}
          <article className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-emerald-400/15 p-5 shadow-sm sm:col-span-2">
            <p className="text-sm text-[var(--muted)]">Main promise</p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Answers stay grounded in the uploaded notes instead of drifting to generic AI replies.</p>
          </article>
        </div>
      </section>

      <section id="dashboard" className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">Upload notes</p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Add a PDF or paste notes</h2>
              </div>
              <label className="cursor-pointer rounded-2xl border border-white/20 bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5">
                <input type="file" accept="application/pdf,text/plain" className="hidden" onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)} />
                Upload PDF
              </label>
            </div>

            <textarea
              value={manualNote}
              onChange={(event) => setManualNote(event.target.value)}
              placeholder="Paste your notes here, then save them to the dashboard..."
              className="mt-5 min-h-44 w-full rounded-3xl border border-white/20 bg-white/70 p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-sky-400 dark:bg-slate-950/50"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={handleUpload} disabled={busy} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950">
                {busy ? "Working..." : "Save notes"}
              </button>
              <button type="button" onClick={() => setNotes([createSampleNote()])} className="rounded-2xl border border-white/20 bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 dark:bg-slate-900/70">
                Reset sample
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">Dashboard</p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Your uploaded notes</h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{notes.length} items</p>
            </div>

            <div className="mt-5 space-y-3">
              {notes.map((note) => (
                <button
                  type="button"
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    activeNoteId === note.id ? "border-sky-400/60 bg-sky-400/12 shadow-sm" : "border-white/20 bg-white/50 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{note.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {note.source} · {note.createdAt}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {splitSentences(note.text).length} lines
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">AI summaries</p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Short summary, bullets, and key concepts</h2>
              </div>
              <button type="button" onClick={generateQuiz} disabled={busy} className="rounded-2xl border border-white/20 bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 dark:bg-slate-900/70">
                Regenerate quiz
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Short summary</p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{activeNote.artifact.shortSummary}</p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Bullet notes</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--foreground)]">
                  {activeNote.artifact.bulletNotes.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Key concepts</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeNote.artifact.keyConcepts.map((concept) => (
                    <span key={concept} className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-cyan-200">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl md:col-span-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">Chat with notes</p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Ask chapter questions and get grounded answers</h2>
            </div>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
              {chatTurns.map((turn, index) => (
                <div key={`${turn.role}-${index}`} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-7 ${turn.role === "user" ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950" : "bg-sky-400/15 text-[var(--foreground)]"}`}>
                    {turn.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder='Try: "Explain chapter 2" or "Give important questions"' className="flex-1 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 dark:bg-slate-950/50" />
              <button type="button" onClick={generateChatAnswer} disabled={busy} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950">
                Ask note
              </button>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl md:col-span-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">Quiz generator</p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">MCQs, True/False, and short answers</h2>
            </div>

            <div className="mt-5 space-y-4">
              {activeNote.quiz.map((question) => (
                <div key={question.id} className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--foreground)]">{question.question}</p>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{question.type}</span>
                  </div>

                  {question.options ? (
                    <div className="mt-4 grid gap-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/20 bg-[var(--surface-strong)] px-4 py-3 text-sm">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={quizResponses[question.id] === option}
                            onChange={(event) =>
                              setQuizResponses((current) => ({
                                ...current,
                                [question.id]: event.target.value,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={quizResponses[question.id] ?? ""}
                      onChange={(event) =>
                        setQuizResponses((current) => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      className="mt-4 w-full rounded-2xl border border-white/20 bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none"
                      placeholder="Write your answer..."
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={submitQuiz} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-cyan-300 dark:text-slate-950">
                Submit quiz
              </button>
              {quizScore !== null && (
                <span className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Score: {quizScore} / {activeNote.quiz.length}
                </span>
              )}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl md:col-span-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">Revision tools</p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Quick revision notes, important questions, formula sheets</h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Quick revision</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--foreground)]">
                  {activeNote.artifact.revisionNotes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Important questions</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--foreground)]">
                  {activeNote.artifact.importantQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-[var(--muted)]">Formula sheet</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--foreground)]">
                  {activeNote.artifact.formulaSheet.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="features" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Notes upload", "Upload PDFs or paste notes, then extract the content into a simple dashboard."],
          ["AI summaries", "Short summary, bullet notes, and key concepts generated from the active note."],
          ["Chat with notes", "Ask exam questions, chapter explanations, or simple-language summaries."],
          ["Quiz + revision", "Generate MCQs, True/False, and short answers with instant scoring."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-[1.75rem] border border-white/20 bg-[var(--surface)] p-5 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:-translate-y-1">
            <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          ["Step 1", "Upload your notes or a PDF."],
          ["Step 2", "Read summaries, chat with the note, and generate a quiz."],
          ["Step 3", "Revise with important questions, formulas, and multilingual help."],
        ].map(([step, description]) => (
          <article key={step} className="rounded-[1.75rem] border border-white/20 bg-[var(--surface)] p-5 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-cyan-200">{step}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{description}</p>
          </article>
        ))}
      </section>

      <section id="faq" className="mt-8 rounded-[2rem] border border-white/20 bg-[var(--surface)] p-6 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">FAQ</h2>
        <div className="mt-5 grid gap-4">
          {[
            ["Can the assistant answer only from uploaded notes?", "Yes. The API prompts and local fallback both stay grounded in the note text."],
            ["Does the UI work on mobile?", "Yes. The layout collapses into a single column on smaller screens and keeps the dashboard readable."],
            ["Where do Firebase and Gemini fit?", "The app includes ready-to-fill config hooks so you can connect auth, storage, Firestore, and Gemini keys next."],
          ].map(([question, answer]) => (
            <details key={question} className="rounded-3xl border border-white/20 bg-white/55 p-4 dark:bg-slate-950/50">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">{question}</summary>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-8 flex flex-col gap-3 rounded-[2rem] border border-white/20 bg-[var(--surface)] px-6 py-5 text-sm text-[var(--muted)] shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p>Synapzi AI is a simple MVP for note-based studying, quizzes, and revision.</p>
        <p>Built with Next.js, React, Tailwind CSS, Express, Gemini, Firebase, and pdf-parse.</p>
      </footer>
    </main>
  );
}
