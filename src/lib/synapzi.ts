import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where, type DocumentData } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebase";

export type StudyLanguage = "English" | "Hindi" | "Kannada";

export type NoteItem = {
  id: string;
  title: string;
  text: string;
  source: string;
  userId: string;
  createdAt: string;
  artifact?: NoteArtifact;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type NoteArtifact = {
  shortSummary: string;
  bulletNotes: string[];
  keyConcepts: string[];
  revisionNotes: string[];
  importantQuestions: string[];
  formulaSheet: string[];
};

export type ExamArtifact = {
  quickSummary: string;
  importantTopics: string[];
  quickRevisionNotes: string[];
  probableQuestions: string[];
  formulas: string[];
  definitions: string[];
  fastRevisionMode: string[];
  lastMinuteTips?: string[];
  additionalNotes?: string[];
};

export type UserProfile = {
  fullName: string;
  phone: string;
  email: string;
  school: string;
  city: string;
  goal: string;
  preferredLanguage: StudyLanguage;
};

export const demoProfile: UserProfile = {
  fullName: "Student User",
  phone: "+91 90000 00000",
  email: "student@synapzi.ai",
  school: "Synapzi Academy",
  city: "Bengaluru",
  goal: "Prepare for exams faster with AI notes and revision tools.",
  preferredLanguage: "English",
};

export const demoNotes: NoteItem[] = [
  {
    id: "sample-note",
    title: "Sample Physics Notes",
    text: "Force, motion, and energy are key ideas in this chapter. Use the chat to ask what each concept means, how formulas work, and which points matter most for revision.",
    source: "Demo content",
    userId: "demo-user",
    createdAt: "Just now",
    artifact: {
      shortSummary: "This chapter explains how force changes motion and how energy is used in everyday examples.",
      bulletNotes: [
        "Force changes motion.",
        "Energy can be transferred.",
        "Revision should focus on definitions and formulas.",
      ],
      keyConcepts: ["Force", "Motion", "Energy"],
      revisionNotes: [
        "Revise the main definitions before attempting problems.",
        "Review formulas and examples carefully.",
      ],
      importantQuestions: [
        "What is force?",
        "How does energy transfer in motion?",
      ],
      formulaSheet: ["Work = Force x Distance"],
    },
  },
];

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function extractNoteText(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBase}/notes/extract`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to extract note text.");
  }

  const data = (await response.json()) as { text: string; title?: string };
  return {
    title: data.title || file.name.replace(/\.[^.]+$/, ""),
    text: data.text.trim(),
  };
}

export async function saveNote(userId: string, note: Omit<NoteItem, "id" | "userId" | "createdAt">) {
  const services = getFirebaseServices();
  if (!services) {
    throw new Error("Firebase is not configured.");
  }

  const result = await addDoc(collection(services.db, "notes"), {
    userId,
    title: note.title,
    text: note.text,
    source: note.source,
    artifact: note.artifact ?? null,
    createdAt: serverTimestamp(),
  });

  return result.id;
}

export async function loadNotes(userId: string) {
  const services = getFirebaseServices();
  if (!services) {
    return demoNotes.map((note) => ({ ...note, userId }));
  }

  const noteQuery = query(collection(services.db, "notes"), where("userId", "==", userId));
  const snapshot = await getDocs(noteQuery);

  return snapshot.docs.map((item) => {
    const data = item.data() as DocumentData;
    const artifact = data.artifact && typeof data.artifact === "object" ? (data.artifact as NoteArtifact) : undefined;
    return {
      id: item.id,
      title: String(data.title ?? "Untitled note"),
      text: String(data.text ?? ""),
      source: String(data.source ?? "Manual entry"),
      userId: String(data.userId ?? userId),
      createdAt: data.createdAt?.toDate?.().toLocaleString?.() ?? new Date().toLocaleString(),
      artifact,
    } satisfies NoteItem;
  });
}

export async function removeNote(noteId: string) {
  const services = getFirebaseServices();
  if (!services) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(services.db, "notes", noteId));
}

async function postJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return (await response.json()) as T;
}

export async function getNoteSummary(noteText: string, language: StudyLanguage) {
  return postJson<{ artifact: NoteArtifact }>('/ai/summary', { noteText, language });
}

export async function askNoteQuestion(noteText: string, question: string, language: StudyLanguage) {
  return postJson<{ answer: string }>('/ai/chat', { noteText, question, language });
}

export async function createNoteQuiz(
  noteText: string,
  language: StudyLanguage,
  options?: { count?: number; onlyMCQ?: boolean }
) {
  return postJson<{ quiz: Array<{ id: string; type: string; question: string; options?: string[]; answer: string; explanation: string }> }>('/ai/quiz', { noteText, language, ...(options ?? {}) });
}

export async function getExamMode(noteText: string, language: StudyLanguage) {
  return postJson<{ artifact: ExamArtifact }>('/ai/exam', { noteText, language });
}

function getProfileStorageKey(userId: string) {
  return `synapzi-profile:${userId}`;
}

export async function loadUserProfile(userId: string) {
  const services = getFirebaseServices();
  if (!services) {
    if (typeof window === "undefined") {
      return { ...demoProfile };
    }

    const stored = window.localStorage.getItem(getProfileStorageKey(userId));
    return stored ? ({ ...demoProfile, ...JSON.parse(stored) } as UserProfile) : { ...demoProfile };
  }

  const profileRef = doc(services.db, "profiles", userId);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    return { ...demoProfile };
  }

  const data = snapshot.data() as Partial<UserProfile> & { userId?: string };
  return {
    fullName: String(data.fullName ?? demoProfile.fullName),
    phone: String(data.phone ?? demoProfile.phone),
    email: String(data.email ?? demoProfile.email),
    school: String(data.school ?? demoProfile.school),
    city: String(data.city ?? demoProfile.city),
    goal: String(data.goal ?? demoProfile.goal),
    preferredLanguage: data.preferredLanguage === "Hindi" || data.preferredLanguage === "Kannada" ? data.preferredLanguage : "English",
  };
}

export async function saveUserProfile(userId: string, profile: UserProfile) {
  const services = getFirebaseServices();
  if (!services) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(profile));
    }

    return;
  }

  await setDoc(doc(services.db, "profiles", userId), {
    userId,
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
