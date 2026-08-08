import { QUESTION_BANK, SUBJECTS } from "@/app/dashboard/assessment/_data/questionBank";

export const slugifySubject = (subject) =>
  subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getSubjectBySlug = (slug) =>
  SUBJECTS.find((subject) => slugifySubject(subject) === slug);

const stripDifficultySuffix = (question = "") =>
  question.replace(/\s*\((Easy|Medium|Hard)\)\s*$/i, "").trim();

const buildTemplates = (subject) => [
  {
    label: "Core recall",
    create: (question) => ({
      prompt: stripDifficultySuffix(question.question),
      answer: question.correctAnswer,
      note: question.explanation,
      difficulty: question.difficulty,
    }),
  },
  {
    label: "Why it matters",
    create: (question) => ({
      prompt: `Why does "${question.correctAnswer}" matter in ${subject}?`,
      answer: question.explanation,
      note: `Tie the definition back to one practical ${subject} use case.`,
      difficulty: question.difficulty,
    }),
  },
  {
    label: "Example drill",
    create: (question) => ({
      prompt: `Give one interview-ready example for: ${stripDifficultySuffix(question.question)}`,
      answer: `A strong answer should define "${question.correctAnswer}" and connect it to one short practical example.`,
      note: "Examples make answers easier to remember and explain under pressure.",
      difficulty: question.difficulty,
    }),
  },
  {
    label: "Pitfall check",
    create: (question) => ({
      prompt: `What is the most common confusion point around "${question.correctAnswer}"?`,
      answer: `Candidates often miss the exact meaning of "${question.correctAnswer}" or confuse it with a nearby concept from the distractor options.`,
      note: "Use precise language first, then contrast it with the common wrong idea.",
      difficulty: question.difficulty,
    }),
  },
  {
    label: "Rapid recap",
    create: (question) => ({
      prompt: `Say this in one line: ${stripDifficultySuffix(question.question)}`,
      answer: question.correctAnswer,
      note: "Practice giving the answer in one crisp sentence before expanding.",
      difficulty: question.difficulty,
    }),
  },
  {
    label: "20-second answer",
    create: (question) => ({
      prompt: `If this appears in an interview, how would you answer in 20 seconds? ${stripDifficultySuffix(question.question)}`,
      answer: `Start with "${question.correctAnswer}", then add one short support line: ${question.explanation}`,
      note: "Use a simple structure: answer first, then one supporting detail.",
      difficulty: question.difficulty,
    }),
  },
];

export const buildRevisionDeck = (subject, limit = 50) => {
  const subjectQuestions = QUESTION_BANK.filter((question) => question.subject === subject);

  if (!subjectQuestions.length) return [];

  const templates = buildTemplates(subject);
  const deck = [];

  for (const template of templates) {
    for (const question of subjectQuestions) {
      deck.push({
        id: `${slugifySubject(subject)}-${deck.length + 1}`,
        subject,
        type: template.label,
        ...template.create(question),
      });

      if (deck.length >= limit) {
        return deck;
      }
    }
  }

  return deck.slice(0, limit);
};
