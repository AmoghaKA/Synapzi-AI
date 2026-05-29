require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
});

const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : true,
  })
);

app.use(express.json({ limit: "10mb" }));

function normalize(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  const cleaned = normalize(text);

  return (
    cleaned
      .match(/[^.!?]+[.!?]?/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || [cleaned]
  );
}

function wordList(text) {
  return (
    normalize(text)
      .toLowerCase()
      .match(/[a-zA-Z0-9]+/g)
      ?.filter((word) => word.length > 2) || []
  );
}

function buildLocalArtifact(text) {
  const sentences = splitSentences(text);

  const concept = sentences[0] || "the uploaded note";

  return {
    shortSummary:
      sentences.slice(0, 2).join(" ") ||
      "No readable text found.",

    bulletNotes: sentences
      .slice(0, 5)
      .map((sentence) => sentence),

    keyConcepts: sentences
      .slice(0, 5)
      .map((sentence) =>
        sentence.split(" ").slice(0, 4).join(" ")
      ),

    revisionNotes: [
      `Revise the main topic: ${concept}`,
      "Review formulas and examples carefully.",
      "Focus on important concepts.",
    ],

    importantQuestions: [
      `Explain ${concept}.`,
      "What are the key concepts?",
      "Which formulas are important?",
    ],

    formulaSheet: sentences.filter((sentence) =>
      /=|\bformula\b|\bcalculate\b/i.test(sentence)
    ),
  };
}

function buildLocalQuiz(text) {
  const sentences = splitSentences(text);

  return sentences
    .slice(0, 3)
    .flatMap((sentence, index) => [
      {
        id: `mcq-${index}`,
        type: "MCQ",
        question:
          "Which statement matches the uploaded note?",
        options: [
          sentence,
          "Random statement",
          "Incorrect idea",
          "Not from the note",
        ],
        answer: sentence,
        explanation:
          "This statement exists in the uploaded notes.",
      },

      {
        id: `tf-${index}`,
        type: "True/False",
        question: `The note contains this idea: ${sentence}`,
        options: ["True", "False"],
        answer: "True",
        explanation:
          "The sentence exists in the uploaded notes.",
      },

      {
        id: `short-${index}`,
        type: "Short Answer",
        question:
          "Write one revision point from the notes.",
        answer: sentence,
        explanation:
          "This answer comes from the uploaded notes.",
      },
    ])
    .slice(0, 9);
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => normalize(value)).filter(Boolean))];
}

function buildLocalExamArtifact(text) {
  const sentences = splitSentences(text);
  const importantTopics = uniqueValues(
    sentences
      .map((sentence) => sentence.split(" ").slice(0, 5).join(" "))
      .filter(Boolean)
  ).slice(0, 6);

  const quickRevisionNotes = sentences.slice(0, 5).map((sentence) => sentence);

  const probableQuestions = uniqueValues([
    importantTopics[0] ? `Explain ${importantTopics[0]}.` : "Explain the main topic from the chapter.",
    importantTopics[1] ? `What should you remember about ${importantTopics[1]}?` : "What are the key points from the note?",
    "Which formulas or definitions are most important?",
    "Write a short revision answer from the note.",
  ]).slice(0, 4);

  const formulas = sentences.filter((sentence) => /=|\bformula\b|\bcalculate\b|\bwork\b|\bspeed\b/i.test(sentence)).slice(0, 5);
  const definitions = sentences.filter((sentence) => /\bis\b|\bare\b|\bmeans\b|\bdefined\b/i.test(sentence)).slice(0, 5);

  return {
    quickSummary: quickRevisionNotes.slice(0, 2).join(" ") || "No readable text found in the uploaded notes.",
    importantTopics: importantTopics.length ? importantTopics : ["Main topic", "Key formulas", "Core definitions"],
    quickRevisionNotes: quickRevisionNotes.length ? quickRevisionNotes : ["Review the note and identify the key concepts."],
    probableQuestions,
    formulas: formulas.length ? formulas : ["No explicit formulas found in the note."],
    definitions: definitions.length ? definitions : ["No direct definitions detected in the note."],
    fastRevisionMode: [
      "Read the important topics once without stopping.",
      "Memorize formulas and definitions before looking at the full text again.",
      "Answer the probable questions aloud to test recall.",
    ],
  };
}

function buildLocalAnswer(
  noteText,
  question,
  language
) {
  const questionWords = new Set(wordList(question));

  const matched = splitSentences(noteText).filter(
    (sentence) =>
      wordList(sentence).some((word) =>
        questionWords.has(word)
      )
  );

  const answer =
    matched.slice(0, 3).join(" ") ||
    "I could not find that information in the uploaded notes.";

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

  return client.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL ||
      "gemini-2.0-flash",
  });
}

async function askGemini(prompt) {
  try {
    console.log("Sending request to OpenRouter AI...");

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log("OpenRouter Error:");
    console.log(error);

    return null;
  }
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Synapzi AI API",
  });
});

app.post(
  "/notes/extract",
  upload.single("file"),
  async (req, res) => {
    try {
      if (req.file) {
        if (
          req.file.mimetype === "application/pdf" ||
          req.file.originalname
            .toLowerCase()
            .endsWith(".pdf")
        ) {
          const parsed = await pdfParse(
            req.file.buffer
          );

          return res.json({
            text: normalize(parsed.text),
            title:
              req.file.originalname.replace(
                /\.pdf$/i,
                ""
              ),
          });
        }

        return res.json({
          text: normalize(
            req.file.buffer.toString("utf8")
          ),
          title: req.file.originalname,
        });
      }

      const text = normalize(
        req.body?.text || ""
      );

      return res.json({
        text,
        title:
          req.body?.title || "Pasted notes",
      });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        error: "Unable to extract notes.",
        detail: error.message,
      });
    }
  }
);

app.post("/ai/summary", async (req, res) => {
  try {
    const noteText = normalize(
      req.body?.noteText ||
        req.body?.text ||
        ""
    );

    const language =
      req.body?.language || "English";

    if (!noteText) {
      return res.status(400).json({
        error: "No note text provided.",
      });
    }

    const localArtifact =
      buildLocalArtifact(noteText);

    const prompt = `
You are Synapzi AI.

Language preference: ${language}

Analyze the uploaded study notes.

Return ONLY valid JSON.

JSON format:

{
  "shortSummary": "Brief summary",
  "bulletNotes": ["point 1", "point 2"],
  "keyConcepts": ["concept 1", "concept 2"],
  "revisionNotes": ["revision point"],
  "importantQuestions": ["question 1"],
  "formulaSheet": ["formula 1"]
}

Use ONLY the uploaded notes.

Notes:
${noteText.slice(0, 30000)}
`;

    const geminiText =
      await askGemini(prompt);

    if (!geminiText) {
      return res.json({
        artifact: localArtifact,
        quiz: buildLocalQuiz(noteText),
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(geminiText);
    } catch {
      parsed = localArtifact;
    }

    return res.json({
      artifact: parsed,
      quiz: buildLocalQuiz(noteText),
    });
  } catch (error) {
    console.error(error);

    return res.json({
      artifact: buildLocalArtifact(
        req.body?.noteText || ""
      ),

      quiz: buildLocalQuiz(
        req.body?.noteText || ""
      ),
    });
  }
});

app.post("/ai/chat", async (req, res) => {
  try {
    const noteText = normalize(
      req.body?.noteText || ""
    );

    const question = normalize(
      req.body?.question || ""
    );

    const language =
      req.body?.language || "English";

    const prompt = `
You are Synapzi AI.

Language preference: ${language}

Answer ONLY from the uploaded notes.

If the answer is not present in the notes,
say that clearly.

Notes:
${noteText}

Question:
${question}

Return a concise answer.
`;

    const geminiText =
      await askGemini(prompt);

    if (!geminiText) {
      return res.json({
        answer: buildLocalAnswer(
          noteText,
          question,
          language
        ),
      });
    }

    return res.json({
      answer: geminiText.trim(),
    });
  } catch (error) {
    console.error(error);

    return res.json({
      answer: buildLocalAnswer(
        req.body?.noteText || "",
        req.body?.question || "",
        req.body?.language || "English"
      ),
    });
  }
});

app.post("/ai/quiz", async (req, res) => {
  try {
    const noteText = normalize(
      req.body?.noteText || ""
    );

    const language =
      req.body?.language || "English";

    const prompt = `
You are Synapzi AI.

Language preference: ${language}

Use ONLY the uploaded notes.

Return ONLY valid JSON.

JSON format:

{
  "quiz": [
    {
      "id": "1",
      "type": "MCQ",
      "question": "Question",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct Answer",
      "explanation": "Explanation"
    }
  ]
}

Generate:
- MCQ
- True/False
- Short Answer

Notes:
${noteText.slice(0, 30000)}
`;

    const geminiText =
      await askGemini(prompt);

    if (!geminiText) {
      return res.json({
        quiz: buildLocalQuiz(noteText),
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(geminiText);
    } catch {
      parsed = {
        quiz: buildLocalQuiz(noteText),
      };
    }

    return res.json({
      quiz:
        parsed.quiz ||
        buildLocalQuiz(noteText),
    });
  } catch (error) {
    console.error(error);

    return res.json({
      quiz: buildLocalQuiz(
        req.body?.noteText || ""
      ),
    });
  }
});

app.post("/ai/exam", async (req, res) => {
  try {
    const noteText = normalize(req.body?.noteText || "");
    const language = req.body?.language || "English";

    if (!noteText) {
      return res.status(400).json({ error: "No note text provided." });
    }

    const localArtifact = buildLocalExamArtifact(noteText);
    const prompt = `
You are Synapzi AI.

Language preference: ${language}

Create a last-minute exam preparation pack from the uploaded notes.

Return ONLY valid JSON in this exact shape:

{
  "quickSummary": "One concise summary paragraph",
  "importantTopics": ["topic 1", "topic 2"],
  "quickRevisionNotes": ["note 1", "note 2"],
  "probableQuestions": ["question 1", "question 2"],
  "formulas": ["formula 1"],
  "definitions": ["definition 1"],
  "fastRevisionMode": ["step 1", "step 2"],
  "lastMinuteTips": ["tip 1", "tip 2"],
  "additionalNotes": ["note 1", "note 2"]
}

Use only the uploaded notes. Keep the output concise, practical, and exam-focused.

Notes:
${noteText.slice(0, 30000)}
`;

    const geminiText = await askGemini(prompt);

    if (!geminiText) {
      return res.json({ artifact: localArtifact });
    }

    let parsed;

    try {
      parsed = JSON.parse(geminiText);
    } catch {
      parsed = localArtifact;
    }

    return res.json({
      artifact: {
        quickSummary: String(parsed.quickSummary || localArtifact.quickSummary),
        importantTopics: Array.isArray(parsed.importantTopics) ? parsed.importantTopics.map(String) : localArtifact.importantTopics,
        quickRevisionNotes: Array.isArray(parsed.quickRevisionNotes) ? parsed.quickRevisionNotes.map(String) : localArtifact.quickRevisionNotes,
        probableQuestions: Array.isArray(parsed.probableQuestions) ? parsed.probableQuestions.map(String) : localArtifact.probableQuestions,
        formulas: Array.isArray(parsed.formulas) ? parsed.formulas.map(String) : localArtifact.formulas,
        definitions: Array.isArray(parsed.definitions) ? parsed.definitions.map(String) : localArtifact.definitions,
        fastRevisionMode: Array.isArray(parsed.fastRevisionMode) ? parsed.fastRevisionMode.map(String) : localArtifact.fastRevisionMode,
        lastMinuteTips: Array.isArray(parsed.lastMinuteTips) ? parsed.lastMinuteTips.map(String) : (localArtifact.fastRevisionMode ? localArtifact.fastRevisionMode.slice(0,3) : []),
        additionalNotes: Array.isArray(parsed.additionalNotes) ? parsed.additionalNotes.map(String) : [],
      },
    });
  } catch (error) {
    console.error(error);

    return res.json({
      artifact: buildLocalExamArtifact(req.body?.noteText || ""),
    });
  }
});

app.listen(port, () => {
  console.log(
    `Synapzi AI API listening on http://localhost:${port}`
  );
});