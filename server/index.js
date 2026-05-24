const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
  }),
);
app.use(express.json({ limit: "2mb" }));

function normalize(text) {
  return String(text || "").replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

function splitSentences(text) {
  const cleaned = normalize(text);
  return cleaned.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [cleaned];
}

function wordList(text) {
  return normalize(text)
    .toLowerCase()
    .match(/[a-zA-Z0-9]+/g)
    ?.filter((word) => word.length > 2) ?? [];
}

function buildLocalArtifact(text) {
  const sentences = splitSentences(text);
  const concept = sentences[0] || "the uploaded note";
  return {
    shortSummary: sentences.slice(0, 2).join(" ") || "No text extracted.",
    bulletNotes: sentences.slice(0, 5).map((sentence) => `- ${sentence}`),
    keyConcepts: [concept.split(" ").slice(0, 4).join(" ")],
    revisionNotes: [
      `Revise the main point: ${concept}`,
      "Review the definitions and examples mentioned in the note.",
      "Focus on repeated formulas, terms, and chapter headings.",
    ],
    importantQuestions: [
      `Explain ${concept} in simple words.`,
      "What are the most important points in this note?",
      "Which formulas or examples should be remembered?",
    ],
    formulaSheet: sentences.filter((sentence) => /=|\bformula\b|\bcalculate\b/i.test(sentence)).slice(0, 4),
  };
}

function buildLocalQuiz(text) {
  const sentences = splitSentences(text);
  const focus = sentences.slice(0, 3);
  return focus.flatMap((sentence, index) => [
    {
      id: `mcq-${index}`,
      type: "MCQ",
      question: `Which statement best matches the notes?`,
      options: [sentence, "It is unrelated to the note.", "It is a random guess.", "It is not in the chapter."],
      answer: sentence,
      explanation: `The answer comes from the uploaded text: ${sentence}`,
    },
    {
      id: `tf-${index}`,
      type: "True/False",
      question: `The uploaded note includes this idea: ${sentence}`,
      options: ["True", "False"],
      answer: "True",
      explanation: `The text contains this idea directly.`,
    },
    {
      id: `short-${index}`,
      type: "Short answer",
      question: `Write one short revision point from the note.`,
      answer: sentence,
      explanation: `A short answer should include the note idea.`,
    },
  ]).slice(0, 9);
}

function buildLocalAnswer(noteText, question, language) {
  const questionWords = new Set(wordList(question));
  const matched = splitSentences(noteText).filter((sentence) => wordList(sentence).some((word) => questionWords.has(word)));
  const answer = matched.slice(0, 3).join(" ") || "I could not find that detail in the uploaded notes.";

  if (language === "Hindi") {
    return `Hindi mode requested. ${answer}`;
  }

  if (language === "Kannada") {
    return `Kannada mode requested. ${answer}`;
  }

  return answer;
}

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
}

async function askGemini(prompt) {
  const model = getGeminiModel();
  if (!model) {
    return null;
  }

  const response = await model.generateContent(prompt);
  return response.response.text();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "Synapzi AI API" });
});

app.post("/notes/extract", upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf")) {
        const parsed = await pdfParse(req.file.buffer);
        return res.json({ text: normalize(parsed.text), title: req.file.originalname.replace(/\.pdf$/i, "") });
      }

      return res.json({ text: normalize(req.file.buffer.toString("utf8")), title: req.file.originalname });
    }

    const text = normalize(req.body?.text || "");
    return res.json({ text, title: req.body?.title || "Pasted notes" });
  } catch (error) {
    return res.status(400).json({ error: "Unable to extract notes.", detail: error.message });
  }
});

app.post("/ai/summary", async (req, res) => {
  try {
    const noteText = normalize(req.body?.noteText || "");
    const language = req.body?.language || "English";
    const localArtifact = buildLocalArtifact(noteText);

    const prompt = [
      "You are Synapzi AI.",
      `Language preference: ${language}.`,
      "Use only the uploaded notes below.",
      "Return strict JSON with keys shortSummary, bulletNotes, keyConcepts, revisionNotes, importantQuestions, and formulaSheet.",
      "If the notes do not contain enough information, say so instead of inventing content.",
      `Notes:\n${noteText}`,
    ].join("\n\n");

    const geminiText = await askGemini(prompt);
    if (!geminiText) {
      return res.json({ artifact: localArtifact, quiz: buildLocalQuiz(noteText) });
    }

    const parsed = JSON.parse(geminiText);
    return res.json({ artifact: parsed, quiz: buildLocalQuiz(noteText) });
  } catch (error) {
    return res.json({ artifact: buildLocalArtifact(req.body?.noteText || ""), quiz: buildLocalQuiz(req.body?.noteText || "") });
  }
});

app.post("/ai/chat", async (req, res) => {
  try {
    const noteText = normalize(req.body?.noteText || "");
    const question = normalize(req.body?.question || "");
    const language = req.body?.language || "English";

    const prompt = [
      "You are Synapzi AI.",
      `Language preference: ${language}.`,
      "Answer only from the uploaded notes.",
      "If the answer is not present in the notes, say that clearly.",
      `Notes:\n${noteText}`,
      `Question:\n${question}`,
      "Return a concise answer.",
    ].join("\n\n");

    const geminiText = await askGemini(prompt);
    if (!geminiText) {
      return res.json({ answer: buildLocalAnswer(noteText, question, language) });
    }

    return res.json({ answer: geminiText.trim() });
  } catch (error) {
    return res.json({ answer: buildLocalAnswer(req.body?.noteText || "", req.body?.question || "", req.body?.language || "English") });
  }
});

app.post("/ai/quiz", async (req, res) => {
  try {
    const noteText = normalize(req.body?.noteText || "");
    const language = req.body?.language || "English";

    const prompt = [
      "You are Synapzi AI.",
      `Language preference: ${language}.`,
      "Use only the uploaded notes.",
      "Generate JSON with a quiz array of MCQ, True/False, and Short answer items.",
      "Each item needs id, type, question, options, answer, and explanation.",
      `Notes:\n${noteText}`,
    ].join("\n\n");

    const geminiText = await askGemini(prompt);
    if (!geminiText) {
      return res.json({ quiz: buildLocalQuiz(noteText) });
    }

    const parsed = JSON.parse(geminiText);
    return res.json({ quiz: parsed.quiz || parsed });
  } catch (error) {
    return res.json({ quiz: buildLocalQuiz(req.body?.noteText || "") });
  }
});

app.listen(port, () => {
  console.log(`Synapzi AI API listening on http://localhost:${port}`);
});
