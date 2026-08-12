import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { cleanMathAndMarkdown } from "./src/utils/mathFormatter";
import { createChatRouter } from "./src/server/chatEngine";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Mount Secure Messaging & Authentication Backend Router
app.use('/api', createChatRouter());

// Helper to initialize Gemini API
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
}

const MATH_INSTRUCTION = `
CRITICAL MATHEMATICAL & FORMULA FORMATTING RULES:
- NEVER output raw LaTeX code or commands (such as $$, \\frac, \\Delta, \\begin{equation}, \\text{}, \\sqrt{}, etc.).
- Always write mathematical formulas, chemical equations, and economics functions using clean, readable standard text notation with Unicode math symbols.
- Required Notation Examples:
  - Production Function: Q = f(L, K)
  - Average Product: AP = TP / L
  - Marginal Product: MP = ΔTP / ΔL
  - Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a
  - Pythagorean Theorem: a² + b² = c²
  - Water: H₂O
  - Force: F = m × a
  - Speed/Velocity: v = s / t
- Keep all Bengali and English text properly formatted with clear line breaks. Numbers should render normally (e.g. 1, 2, 3... or ১, ২, ৩...).
`;

// ---------------------------
// 1. AI Tutor Chat Endpoint
// ---------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory = [], grade = 'ssc_class_9_10', subject = 'general', language = 'bilingual', bauContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGenAI();

    let bauContextInstruction = '';
    if (bauContext && (bauContext.courseCode || bauContext.courseTitle)) {
      bauContextInstruction = `
SPECIAL UNIVERSITY CONTEXT:
You are acting as an official AI Academic Tutor for Bangladesh Agricultural University (BAU), Mymensingh.
Selected BAU Course: ${bauContext.courseCode || ''} - ${bauContext.courseTitle || ''}
Faculty: ${bauContext.facultyId || 'Agricultural Sciences'}
Department: ${bauContext.departmentId || 'Academic Dept'}
Provide answers tailored to Bangladesh Agricultural University (BAU) undergraduate/graduate academic level and curriculum standards.
`;
    }

    const systemInstruction = `
You are "UEI & BAU Academic AI" (Universal Education AI / বাংলাদেশ কৃষি বিশ্ববিদ্যালয় অ্যাকাডেমিক এআই), an empathetic, expert educational AI tutor for school, college, and university students in Bangladesh and worldwide.
Target Audience Grade Level: ${grade}
Subject Context: ${subject}
Preferred Response Language Mode: ${language} (bn = pure Bengali/বাংলা, en = English, bilingual = Mix of clear Bengali & English explanations where complex technical terms are given in both languages).
${bauContextInstruction}

${MATH_INSTRUCTION}

REQUIRED STRUCTURE FOR YOUR EXPLANATION:
Whenever answering an academic question, your answer MUST be well-organized into these 5 clear section headings in Markdown:

### 📖 1. সংজ্ঞা (Definition)
Define the core concept clearly and concisely in 2-3 sentences.

### 💡 2. বিস্তারিত ব্যাখ্যা (Detailed Explanation)
Break down the topic with logical step-by-step reasoning, bullet points, and key mechanisms.

### 🌟 3. বাস্তব জীবনের উদাহরণ (Real-world Examples)
Provide 1-2 relatable real-life applications or practical examples suitable for students.

### 📐 4. গুরুত্বপূর্ণ সূত্র বা নিয়ম (Key Formulas / Rules / Principles)
Highlight any relevant formulas, chemical equations, grammar rules, or economic principles in bold clean code boxes. If none exist, state key takeaways.

### 📝 5. সংক্ষিপ্ত সারসংক্ষেপ (Short Summary)
Summarize the key takeaway in 2 sentences for rapid exam revision.

Provide response in JSON format matching this schema:
{
  "replyText": "Markdown formatted string with the 5 structured sections above",
  "suggestedFollowups": ["2-3 short relevant follow-up questions the student might ask next"]
}
`;

    const formattedHistory = chatHistory.slice(-6).map((item: any) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: cleanMathAndMarkdown(item.text) }]
    }));

    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: { type: Type.STRING },
              suggestedFollowups: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["replyText"]
          }
        }
      });
    } catch (primaryErr: any) {
      console.warn("Primary model gemini-3.6-flash failed, retrying with gemini-3.6-flash:", primaryErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: { type: Type.STRING },
              suggestedFollowups: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["replyText"]
          }
        }
      });
    }

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);

    res.json({
      replyText: cleanMathAndMarkdown(parsed.replyText || "I am ready to help you with your studies!"),
      suggestedFollowups: (parsed.suggestedFollowups || []).map((f: string) => cleanMathAndMarkdown(f))
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to process AI chat request." });
  }
});

// ---------------------------
// 2. Snap & Solve Endpoint
// ---------------------------
app.post("/api/snap-solve", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", grade = "ssc_class_9_10", language = "bilingual" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are an expert OCR & Academic Problem Solver in UEI (Universal Education AI).
You analyze images of textbook questions, handwritten math/science problems, diagrams, or exam sheets.
Grade Context: ${grade}
Language Preference: ${language}

${MATH_INSTRUCTION}

Instructions:
1. Extract the text/question from the image accurately in 'extractedQuestionText'.
2. Identify the subject (e.g. Physics, Math, Chemistry, Biology, English Grammar, General Science, Economics, ICT).
3. Provide a clear final answer in both Bengali ('finalAnswerBn') and English ('finalAnswerEn').
4. Break down the solution step-by-step in 'solutionSteps' (Step 1, Step 2, Step 3...).
5. State any key formula or principle used in 'keyFormula'.
6. Provide a concept explanation for conceptual understanding in 'conceptExplanationBn' and 'conceptExplanationEn'.
`;

    const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType
              }
            },
            { text: "Solve this question in detail with step-by-step breakdown." }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedQuestionText: { type: Type.STRING },
            subject: { type: Type.STRING },
            finalAnswerBn: { type: Type.STRING },
            finalAnswerEn: { type: Type.STRING },
            keyFormula: { type: Type.STRING },
            solutionSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  titleBn: { type: Type.STRING },
                  titleEn: { type: Type.STRING },
                  explanationBn: { type: Type.STRING },
                  explanationEn: { type: Type.STRING }
                },
                required: ["stepNumber", "titleBn", "explanationBn"]
              }
            },
            conceptExplanationBn: { type: Type.STRING },
            conceptExplanationEn: { type: Type.STRING }
          },
          required: ["extractedQuestionText", "finalAnswerBn", "solutionSteps"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    if (parsed.extractedQuestionText) parsed.extractedQuestionText = cleanMathAndMarkdown(parsed.extractedQuestionText);
    if (parsed.finalAnswerBn) parsed.finalAnswerBn = cleanMathAndMarkdown(parsed.finalAnswerBn);
    if (parsed.finalAnswerEn) parsed.finalAnswerEn = cleanMathAndMarkdown(parsed.finalAnswerEn);
    if (parsed.conceptExplanationBn) parsed.conceptExplanationBn = cleanMathAndMarkdown(parsed.conceptExplanationBn);
    if (parsed.conceptExplanationEn) parsed.conceptExplanationEn = cleanMathAndMarkdown(parsed.conceptExplanationEn);
    if (parsed.keyFormula) parsed.keyFormula = cleanMathAndMarkdown(parsed.keyFormula);

    if (Array.isArray(parsed.solutionSteps)) {
      parsed.solutionSteps = parsed.solutionSteps.map((step: any) => ({
        ...step,
        titleBn: cleanMathAndMarkdown(step.titleBn),
        titleEn: cleanMathAndMarkdown(step.titleEn),
        explanationBn: cleanMathAndMarkdown(step.explanationBn),
        explanationEn: cleanMathAndMarkdown(step.explanationEn)
      }));
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/snap-solve:", error);
    res.status(500).json({ error: error.message || "Failed to process Snap & Solve image." });
  }
});

// ---------------------------
// 3. Lesson Notes Generator Endpoint
// ---------------------------
app.post("/api/explain-lesson", async (req, res) => {
  try {
    const { topic, textContent, subject = "general", grade = "ssc_class_9_10", language = "bilingual" } = req.body;

    if (!topic && !textContent) {
      return res.status(400).json({ error: "Topic or text content is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are an expert Lesson Notes & Study Guide Generator for UEI (Universal Education AI).
Subject: ${subject}
Target Grade: ${grade}
Preferred Language: ${language}
${textContent ? `Provided Text / Chapter Content:\n${textContent}` : ""}

${MATH_INSTRUCTION}

Ensure:
- Concise, clear summaries in Bengali (Bangla) and English.
- Key concepts listed as bullet points.
- Formulas, grammar rules, or core equations highlighted using clean Unicode math notation.
- Important vocabulary / terms table with Bengali & English meanings.
- 3 self-test practice questions.
    `;

    const prompt = `Generate comprehensive, exam-oriented study notes for: ${topic || "The provided lesson content"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            summaryBn: { type: Type.STRING },
            summaryEn: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            formulasOrRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            importantTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  meaningBn: { type: Type.STRING },
                  meaningEn: { type: Type.STRING }
                },
                required: ["term", "meaningBn", "meaningEn"]
              }
            },
            practiceQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summaryBn", "keyConcepts", "practiceQuestions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    if (parsed.topic) parsed.topic = cleanMathAndMarkdown(parsed.topic);
    if (parsed.summaryBn) parsed.summaryBn = cleanMathAndMarkdown(parsed.summaryBn);
    if (parsed.summaryEn) parsed.summaryEn = cleanMathAndMarkdown(parsed.summaryEn);
    if (Array.isArray(parsed.keyConcepts)) parsed.keyConcepts = parsed.keyConcepts.map((k: string) => cleanMathAndMarkdown(k));
    if (Array.isArray(parsed.formulasOrRules)) parsed.formulasOrRules = parsed.formulasOrRules.map((f: string) => cleanMathAndMarkdown(f));
    if (Array.isArray(parsed.practiceQuestions)) parsed.practiceQuestions = parsed.practiceQuestions.map((q: string) => cleanMathAndMarkdown(q));
    if (Array.isArray(parsed.importantTerms)) {
      parsed.importantTerms = parsed.importantTerms.map((termObj: any) => ({
        term: cleanMathAndMarkdown(termObj.term),
        meaningBn: cleanMathAndMarkdown(termObj.meaningBn),
        meaningEn: cleanMathAndMarkdown(termObj.meaningEn)
      }));
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/explain-lesson:", error);
    res.status(500).json({ error: error.message || "Failed to generate lesson notes." });
  }
});

// ---------------------------
// 4. Quiz & MCQ Generator Endpoint
// ---------------------------
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, subject = "general", count = 5, difficulty = "medium", grade = "ssc_class_9_10", language = "bilingual" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Quiz topic is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are an expert Educational Quiz Master for UEI (Universal Education AI).
Subject: ${subject}
Grade: ${grade}
Difficulty Level: ${difficulty}
Language Preference: ${language}

${MATH_INSTRUCTION}

Requirements:
- Generate ${count} high quality MCQs.
- Each question MUST have 4 options (Index 0, 1, 2, 3).
- Provide text in both Bengali (questionBn, optionsBn, explanationBn) and English (questionEn, optionsEn, explanationEn).
- Set correctIndex (0, 1, 2, or 3).
    `;

    const prompt = `Create a ${count}-question MCQ Quiz on: ${topic}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionBn: { type: Type.STRING },
                  questionEn: { type: Type.STRING },
                  optionsBn: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  optionsEn: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanationBn: { type: Type.STRING },
                  explanationEn: { type: Type.STRING }
                },
                required: ["questionBn", "optionsBn", "correctIndex", "explanationBn"]
              }
            }
          },
          required: ["quizTitle", "questions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    if (parsed.quizTitle) parsed.quizTitle = cleanMathAndMarkdown(parsed.quizTitle);
    if (Array.isArray(parsed.questions)) {
      parsed.questions = parsed.questions.map((q: any) => ({
        ...q,
        questionBn: cleanMathAndMarkdown(q.questionBn),
        questionEn: cleanMathAndMarkdown(q.questionEn),
        explanationBn: cleanMathAndMarkdown(q.explanationBn),
        explanationEn: cleanMathAndMarkdown(q.explanationEn),
        optionsBn: (q.optionsBn || []).map((opt: string) => cleanMathAndMarkdown(opt)),
        optionsEn: (q.optionsEn || []).map((opt: string) => cleanMathAndMarkdown(opt))
      }));
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/generate-quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz." });
  }
});

// ---------------------------
// 5. Assignment Generator Endpoint
// ---------------------------
app.post("/api/generate-assignment", async (req, res) => {
  try {
    const { topic, classLevel = "College / Class 11-12", language = "bilingual", length = "medium" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Assignment topic is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are an Academic Assignment Generator for UEI (Universal Education AI).
Target Education Level: ${classLevel}
Preferred Language: ${language}
Desired Length: ${length} (short = ~400 words, medium = ~800 words, long = ~1200+ words).

${MATH_INSTRUCTION}

Generate a structured, professional academic assignment on the requested topic:
1. Title
2. Introduction
3. Main Discussion Points (3-5 comprehensive paragraphs or subheadings)
4. Key Examples / Case Studies (2-3 bullet points)
5. Conclusion
6. References / Bibliography (3-4 standard academic citations)
    `;

    const prompt = `Generate an academic assignment on: "${topic}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            classLevel: { type: Type.STRING },
            introduction: { type: Type.STRING },
            mainDiscussion: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            examples: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            conclusion: { type: Type.STRING },
            references: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "introduction", "mainDiscussion", "conclusion"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    if (parsed.title) parsed.title = cleanMathAndMarkdown(parsed.title);
    if (parsed.introduction) parsed.introduction = cleanMathAndMarkdown(parsed.introduction);
    if (parsed.conclusion) parsed.conclusion = cleanMathAndMarkdown(parsed.conclusion);
    if (Array.isArray(parsed.mainDiscussion)) parsed.mainDiscussion = parsed.mainDiscussion.map((m: string) => cleanMathAndMarkdown(m));
    if (Array.isArray(parsed.examples)) parsed.examples = parsed.examples.map((e: string) => cleanMathAndMarkdown(e));
    if (Array.isArray(parsed.references)) parsed.references = parsed.references.map((r: string) => cleanMathAndMarkdown(r));

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/generate-assignment:", error);
    res.status(500).json({ error: error.message || "Failed to generate assignment." });
  }
});

// ---------------------------
// 6. Study Planner Endpoint
// ---------------------------
app.post("/api/generate-study-plan", async (req, res) => {
  try {
    const { subjects = [], availableTime = "3 hours", examDate = "In 1 month", dailyHours = "3 hours", language = "bilingual" } = req.body;

    const ai = getGenAI();

    const systemInstruction = `
You are an Academic Study Planner & Routine Specialist for UEI (Universal Education AI).
Subjects to cover: ${subjects.join(", ") || "General Academic Subjects"}
Daily Available Study Hours: ${dailyHours}
Exam Date / Deadline: ${examDate}
Language Mode: ${language}

Create a realistic, balanced, highly practical daily and weekly study timetable with breaks, milestone targets, and exam preparation strategies.
    `;

    const prompt = `Create a study planner and routine for exam preparation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            dailySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  activity: { type: Type.STRING }
                },
                required: ["timeSlot", "subject", "activity"]
              }
            },
            weeklyMilestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            examPrepStrategy: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "summary", "dailySchedule", "weeklyMilestones", "examPrepStrategy"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/generate-study-plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate study plan." });
  }
});

// ---------------------------
// 7. Academic Translator Endpoint
// ---------------------------
app.post("/api/translate", async (req, res) => {
  try {
    const { text, direction = "bn_to_en" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text to translate is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are an Academic Bengali ↔ English Translator for UEI (Universal Education AI).
Translation Direction: ${direction === "bn_to_en" ? "Bengali (বাংলা) to English" : "English to Bengali (বাংলা)"}.

Instructions:
1. Provide an accurate, natural, context-aware academic translation.
2. Maintain technical, mathematical, and scientific terms accurately.
3. Extract key academic terms in 'keyTerms' with their corresponding translations.
    `;

    const prompt = `Translate the following text accurately:\n"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            direction: { type: Type.STRING },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["term", "meaning"]
              }
            }
          },
          required: ["translatedText"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.translatedText) parsed.translatedText = cleanMathAndMarkdown(parsed.translatedText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/translate:", error);
    res.status(500).json({ error: error.message || "Failed to translate text." });
  }
});

// ---------------------------
// 8. AI Explainer ("Explain Simply") Endpoint
// ---------------------------
app.post("/api/explain-simply", async (req, res) => {
  try {
    const { topic, targetLevel = "school", language = "bilingual" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are "Explain Simply" Engine in UEI (Universal Education AI).
Target Education Audience Level: ${targetLevel} (beginner = extremely simple everyday analogies; school = Class 6-10; college = HSC/Class 11-12; university = Higher education / conceptual depth).
Preferred Language: ${language}

${MATH_INSTRUCTION}

Task:
Explain the topic in simple, intuitive terms matched strictly to the selected target level (${targetLevel}).
Provide:
- 'explanationBn': Bengali explanation
- 'explanationEn': English explanation
- 'keyTakeaways': 3 easy-to-remember key bullet points
- 'realWorldAnalogy': A fun, relatable everyday real-life analogy.
    `;

    const prompt = `Explain simply: "${topic}" for level: ${targetLevel}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            targetLevel: { type: Type.STRING },
            explanationBn: { type: Type.STRING },
            explanationEn: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            realWorldAnalogy: { type: Type.STRING }
          },
          required: ["explanationBn", "keyTakeaways", "realWorldAnalogy"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.explanationBn) parsed.explanationBn = cleanMathAndMarkdown(parsed.explanationBn);
    if (parsed.explanationEn) parsed.explanationEn = cleanMathAndMarkdown(parsed.explanationEn);
    if (parsed.realWorldAnalogy) parsed.realWorldAnalogy = cleanMathAndMarkdown(parsed.realWorldAnalogy);
    if (Array.isArray(parsed.keyTakeaways)) parsed.keyTakeaways = parsed.keyTakeaways.map((k: string) => cleanMathAndMarkdown(k));

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/explain-simply:", error);
    res.status(500).json({ error: error.message || "Failed to explain topic." });
  }
});


// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UEI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
