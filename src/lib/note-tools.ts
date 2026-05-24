export type StudyLanguage = "English" | "Hindi" | "Kannada";

export type NoteArtifact = {
  shortSummary: string;
  bulletNotes: string[];
  keyConcepts: string[];
  revisionNotes: string[];
  importantQuestions: string[];
  formulaSheet: string[];
};

export type QuizQuestion = {
  id: string;
  type: "MCQ" | "True/False" | "Short answer";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

const stopWords = new Set([
  "the",
  "and",
  "are",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "your",
  "their",
  "about",
  "have",
  "has",
  "was",
  "were",
  "what",
  "when",
  "where",
  "why",
  "how",
  "which",
  "can",
  "will",
  "shall",
  "should",
  "could",
  "would",
  "also",
  "there",
  "here",
  "note",
  "notes",
  "chapter",
]);

export function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

export function splitSentences(text: string) {
  const cleaned = normalizeText(text);
  const sentences = cleaned.match(/[^.!?]+[.!?]?/g) ?? [cleaned];
  return sentences.map((sentence) => sentence.trim()).filter(Boolean);
}

function words(text: string) {
  return normalizeText(text)
    .toLowerCase()
    .match(/[a-zA-Z0-9]+/g)
    ?.filter((word) => word.length > 2 && !stopWords.has(word)) ?? [];
}

function topKeywords(text: string, limit = 8) {
  const counts = new Map<string, number>();
  for (const word of words(text)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function cleanConcept(candidate: string) {
  return candidate
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractConceptPhrases(text: string) {
  const matches = text.match(/(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}|[A-Za-z]+(?:\s+[A-Za-z]+){1,3})/g) ?? [];
  const unique = new Set<string>();
  for (const match of matches) {
    const concept = cleanConcept(match);
    if (concept.length >= 4 && concept.length <= 40) {
      unique.add(concept);
    }
    if (unique.size >= 8) {
      break;
    }
  }
  return [...unique];
}

export function buildNoteArtifact(text: string): NoteArtifact {
  const sentences = splitSentences(text);
  const keywords = topKeywords(text, 8);
  const concepts = extractConceptPhrases(text);

  const shortSummary = sentences.slice(0, 2).join(" ") || "No text was extracted from this note.";
  const bulletNotes = (sentences.slice(0, 5).length ? sentences.slice(0, 5) : [shortSummary]).map((sentence) => `- ${sentence}`);

  const keyConcepts = (concepts.length ? concepts : keywords.map((keyword) => keyword.replace(/\b\w/g, (char) => char.toUpperCase()))).slice(0, 6);

  const revisionNotes = [
    `Revise the main flow: ${keyConcepts[0] ?? "core ideas"}.`,
    `Check definitions for ${keyConcepts[1] ?? "important terms"}.`,
    `Revisit examples and formulas tied to ${keyConcepts[2] ?? "the chapter"}.`,
  ];

  const importantQuestions = [
    `Explain ${keyConcepts[0] ?? "the main topic"} in simple words.`,
    "What are the most important points in this note?",
    "Which examples or formulas should be remembered?",
  ];

  const formulaSheet = sentences.filter((sentence) => /=|\bformula\b|\bcalculate\b|\bvalue\b|\bderive\b/i.test(sentence)).slice(0, 4);

  return {
    shortSummary,
    bulletNotes,
    keyConcepts,
    revisionNotes,
    importantQuestions,
    formulaSheet: formulaSheet.length ? formulaSheet : ["No explicit formulas found in the note text."],
  };
}

export function buildQuizQuestions(text: string): QuizQuestion[] {
  const concepts = extractConceptPhrases(text);
  const keywords = topKeywords(text, 8);
  const focus = concepts.slice(0, 4).concat(keywords.slice(0, 4)).slice(0, 4);

  return focus.flatMap((topic, index) => {
    const mcqAnswer = `${topic} is described in the notes.`;
    const trueFalseAnswer = index % 2 === 0 ? "True" : "False";

    return [
      {
        id: `mcq-${index}`,
        type: "MCQ" as const,
        question: `Which statement best matches the notes about ${topic}?`,
        options: [mcqAnswer, "It is unrelated to the notes.", "It is only an exam trick.", "It never appears in the chapter."],
        answer: mcqAnswer,
        explanation: `The question is based on the note topic ${topic}.`,
      },
      {
        id: `tf-${index}`,
        type: "True/False" as const,
        question: `${topic} is an important idea from the uploaded notes.`,
        options: ["True", "False"],
        answer: trueFalseAnswer,
        explanation: `This is a simple revision check for ${topic}.`,
      },
      {
        id: `short-${index}`,
        type: "Short answer" as const,
        question: `Write one short explanation for ${topic}.`,
        answer: topic,
        explanation: `Mention the note topic ${topic} in your answer.`,
      },
    ];
  }).slice(0, 9);
}

export function answerFromNotes(noteText: string, question: string, language: StudyLanguage) {
  const questionWords = new Set(words(question));
  const matched = splitSentences(noteText).filter((sentence) => words(sentence).some((word) => questionWords.has(word)));
  const answer = matched.slice(0, 3).join(" ") || "I could not find that detail in the uploaded notes.";

  if (language === "Hindi") {
    return `Hindi mode requested. ${answer}`;
  }

  if (language === "Kannada") {
    return `Kannada mode requested. ${answer}`;
  }

  return answer;
}

export function evaluateQuizQuestion(question: QuizQuestion, response: string) {
  const normalizedResponse = response.trim().toLowerCase();
  const normalizedAnswer = question.answer.trim().toLowerCase();

  if (!normalizedResponse) {
    return false;
  }

  if (question.type === "MCQ" || question.type === "True/False") {
    return normalizedResponse === normalizedAnswer;
  }

  const keywords = words(question.answer);
  return keywords.some((keyword) => normalizedResponse.includes(keyword)) || normalizedAnswer === normalizedResponse;
}
