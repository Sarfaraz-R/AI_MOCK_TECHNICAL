"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Lightbulb,
  MessageSquareQuote,
  RefreshCcw,
  Target,
  TriangleAlert,
} from "lucide-react";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { Button } from "@/components/ui/button";

const SAMPLE_FEEDBACK = [
  {
    id: 1,
    question:
      "What is the difference between an Array and an ArrayList in Java?",
    correctAns:
      "An array has a fixed size and can store primitives directly, while ArrayList is resizable, stores objects, and provides built-in methods for insert, remove, and search operations.",
    userAns:
      "Array is fixed and ArrayList is dynamic. ArrayList is easier to use and has methods.",
    feedback:
      "You identified the fixed vs dynamic size difference. You did not clearly explain primitive support, generic typing, and common built-in operations. Add a short example comparing when you would choose each structure in practice.",
    rating: "4",
  },
  {
    id: 2,
    question: "Explain how exception handling works in Java.",
    correctAns:
      "Java uses try, catch, finally, throw, and throws to handle exceptions. Checked exceptions must be declared or handled, while unchecked exceptions are runtime exceptions that do not need explicit declaration.",
    userAns:
      "Exception handling uses try and catch. Finally always runs and helps clean resources.",
    feedback:
      "Good start on try-catch-finally. You should also mention checked vs unchecked exceptions and when throw or throws is used. Give one concrete example of handling a file or parsing exception.",
    rating: "6",
  },
];

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "answer",
  "array",
  "arraylist",
  "because",
  "before",
  "between",
  "build",
  "built",
  "clear",
  "correct",
  "could",
  "difference",
  "explain",
  "feedback",
  "first",
  "from",
  "given",
  "great",
  "handle",
  "interview",
  "java",
  "level",
  "might",
  "needs",
  "other",
  "question",
  "response",
  "round",
  "should",
  "since",
  "solid",
  "still",
  "store",
  "strong",
  "there",
  "these",
  "thing",
  "using",
  "would",
  "your",
]);

const SCORE_STYLES = {
  low: {
    ring: "#ef4444",
    badge: "bg-[#3b1417] text-[#f8b4b4] border-[#7f1d1d]",
    card: "border-[#4b1c20] bg-[#1d1012]",
  },
  mid: {
    ring: "#f59e0b",
    badge: "bg-[#3d2a10] text-[#f6d189] border-[#7c4a03]",
    card: "border-[#4d3514] bg-[#1e1710]",
  },
  high: {
    ring: "#22c55e",
    badge: "bg-[#122d1c] text-[#b7f3c9] border-[#166534]",
    card: "border-[#1d4d2e] bg-[#101b14]",
  },
};

const clampRating = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return 0;
  return Math.max(0, Math.min(10, numericValue));
};

const getScoreBucket = (rating) => {
  if (rating < 4) return "low";
  if (rating <= 7) return "mid";
  return "high";
};

const toQuestionTitle = (question) => {
  if (!question) return "Interview Question";
  const cleaned = question.replace(/\?$/, "").trim();
  return cleaned.length > 72 ? `${cleaned.slice(0, 69)}...` : cleaned;
};

const inferTopic = (question = "", correctAns = "") => {
  const source = `${question} ${correctAns}`.toLowerCase();

  if (source.includes("arraylist") || source.includes("array")) return "Collections";
  if (source.includes("exception")) return "Exception Handling";
  if (source.includes("interface") || source.includes("abstract")) return "OOP Design";
  if (source.includes("stack") || source.includes("heap")) return "Memory Model";
  if (source.includes("binary") || source.includes("tree")) return "Data Structures";
  if (source.includes("thread") || source.includes("synchron")) return "Concurrency";

  return "Core Concepts";
};

const buildSummary = (rating) => {
  if (rating >= 8) {
    return "Strong delivery overall, with clear concepts and solid interview readiness.";
  }
  if (rating >= 6) {
    return "Solid foundation, with a few gaps to tighten for sharper interview answers.";
  }
  if (rating >= 4) {
    return "Decent start, but your answers need stronger structure and more precise terminology.";
  }
  return "Early progress is visible, and focused revision will quickly improve answer quality.";
};

const extractKeyTerms = (answer = "") => {
  const terms = answer
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 5 && !STOP_WORDS.has(token));

  return [...new Set(terms)].slice(0, 6);
};

const toFeedbackBullets = (feedback = "") => {
  const rawPieces = feedback
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return rawPieces.slice(0, 4).map((item) => {
    const lower = item.toLowerCase();

    if (
      lower.includes("good") ||
      lower.includes("solid") ||
      lower.includes("identified") ||
      lower.includes("clear")
    ) {
      return { icon: CheckCircle2, tone: "text-[#8ce3a5]", label: "Strength", text: item };
    }

    if (
      lower.includes("should") ||
      lower.includes("did not") ||
      lower.includes("missing") ||
      lower.includes("need")
    ) {
      return { icon: TriangleAlert, tone: "text-[#f6c177]", label: "Gap", text: item };
    }

    return { icon: Lightbulb, tone: "text-[#7aa2ff]", label: "Tip", text: item };
  });
};

const ScoreGauge = ({ rating }) => {
  const normalized = clampRating(rating);
  const bucket = getScoreBucket(normalized);
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (normalized / 10) * circumference;
  const ringColor = SCORE_STYLES[bucket].ring;

  return (
    <div className="relative flex h-[150px] w-[150px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-black text-[#f7f3ea]">{normalized.toFixed(1)}</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9a294]">
          Overall / 10
        </p>
      </div>
    </div>
  );
};

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const displayFeedback = feedbackList.length ? feedbackList : SAMPLE_FEEDBACK;

  useEffect(() => {
    getFeedback();
  }, []);

  useEffect(() => {
    if (!displayFeedback.length) return;
    const lowest = [...displayFeedback].sort(
      (a, b) => clampRating(a.rating) - clampRating(b.rating)
    )[0];
    if (lowest?.id) {
      setExpandedIds([lowest.id]);
    }
  }, [displayFeedback]);

  const getFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
  };

  const enrichedFeedback = useMemo(() => {
    return displayFeedback.map((item, index) => {
      const rating = clampRating(item.rating);
      const topic = inferTopic(item.question, item.correctAns);
      return {
        ...item,
        displayIndex: index + 1,
        numericRating: rating,
        topic,
        shortTitle: toQuestionTitle(item.question),
        keyTerms: extractKeyTerms(item.correctAns),
        bullets: toFeedbackBullets(item.feedback),
      };
    });
  }, [displayFeedback]);

  const overallRating = useMemo(() => {
    if (!enrichedFeedback.length) return 0;
    const total = enrichedFeedback.reduce((sum, item) => sum + item.numericRating, 0);
    return total / enrichedFeedback.length;
  }, [enrichedFeedback]);

  const strongestQuestion = useMemo(() => {
    return [...enrichedFeedback].sort((a, b) => b.numericRating - a.numericRating)[0];
  }, [enrichedFeedback]);

  const weakestQuestion = useMemo(() => {
    return [...enrichedFeedback].sort((a, b) => a.numericRating - b.numericRating)[0];
  }, [enrichedFeedback]);

  const answeredCount = enrichedFeedback.filter((item) => item.userAns?.trim()).length;

  const toggleCard = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAndScrollTo = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.requestAnimationFrame(() => {
      const element = document.getElementById(`feedback-card-${id}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const statCards = [
    {
      label: "Questions Answered",
      value: `${answeredCount}/${enrichedFeedback.length}`,
      helper: "Responses captured",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      label: "Avg. Rating",
      value: `${overallRating.toFixed(1)}/10`,
      helper: "Across all answers",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      label: "Strongest Topic",
      value: strongestQuestion?.topic || "Pending",
      helper: strongestQuestion?.shortTitle || "Not enough data yet",
      onClick: () => strongestQuestion?.id && expandAndScrollTo(strongestQuestion.id),
    },
    {
      label: "Weakest Topic",
      value: weakestQuestion?.topic || "Pending",
      helper: weakestQuestion?.shortTitle || "Not enough data yet",
      onClick: () => weakestQuestion?.id && expandAndScrollTo(weakestQuestion.id),
    },
  ];

  return (
    <div className="premium-shell relative overflow-hidden bg-[#0d0d0d] pt-28 pb-24 text-[#f7f3ea]">
      <div className="absolute inset-0 bg-[#0d0d0d]/96" />
      <div className="premium-container relative z-10">
        <div className="mx-auto max-w-6xl">
          <section className="mb-8 rounded-[28px] border border-white/10 bg-[#121212] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] md:p-6">
            <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
              <div className="flex justify-center">
                <ScoreGauge rating={overallRating} />
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a9a294]">
                  Interview Complete
                </p>
                <h1 className="text-3xl font-black tracking-tight text-[#f7f3ea] md:text-4xl">
                  Your interview results are ready
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d8d2c5]">
                  {buildSummary(overallRating)}
                </p>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => (
                    <button
                      key={card.label}
                      type="button"
                      onClick={card.onClick}
                      className="rounded-[20px] border border-white/10 bg-[#181818] px-3.5 py-3.5 text-left transition-all duration-200 hover:border-[#3b82f6] hover:bg-[#1d1d1d]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                        {card.label}
                      </p>
                      <p className="mt-2 text-base font-bold text-[#f7f3ea]">{card.value}</p>
                      <p className="mt-1.5 text-xs leading-5 text-[#c9c2b4]">{card.helper}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {!feedbackList.length ? (
            <div className="mb-8 rounded-[24px] border border-[#59430f] bg-[#241d11] px-5 py-4 text-[#f1d49a]">
              Live feedback data was not found yet, so this page is showing a sample layout preview.
            </div>
          ) : null}

          <section className="space-y-4">
            {enrichedFeedback.map((item) => {
              const isOpen = expandedIds.includes(item.id);
              const bucket = SCORE_STYLES[getScoreBucket(item.numericRating)];

              return (
                <article
                  key={item.id}
                  id={`feedback-card-${item.id}`}
                  className="overflow-hidden rounded-[26px] border border-white/10 bg-[#121212] shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleCard(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-white/[0.03] md:px-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-[#1d1d1d] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a294]">
                          Question {item.displayIndex}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${bucket.badge}`}
                        >
                          {item.numericRating.toFixed(1)}/10
                        </span>
                      </div>
                      <h2 className="mt-3 truncate text-lg font-bold text-[#f7f3ea] md:text-xl">
                        {item.shortTitle}
                      </h2>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#a9a294] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/10 px-5 py-5 md:px-6">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="rounded-[22px] border border-white/10 bg-[#1a1a1a] p-5">
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#202020] text-[#d9d4ca]">
                                <MessageSquareQuote className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a294]">
                                  Your Answer
                                </p>
                                <p className="text-sm text-[#d8d2c5]">What you said in the interview</p>
                              </div>
                            </div>
                            <blockquote className="rounded-[18px] border border-white/8 bg-[#161616] p-4 text-sm leading-7 text-[#d8d2c5]">
                              {item.userAns || "No answer was recorded for this question."}
                            </blockquote>
                          </div>

                          <div className="rounded-[22px] border border-[#20482f] bg-[#101813] p-5">
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#245236] bg-[#122217] text-[#8ce3a5]">
                                <Target className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9acaa8]">
                                  Ideal Answer
                                </p>
                                <p className="text-sm text-[#cbe3d2]">A stronger target response</p>
                              </div>
                            </div>
                            <div className="rounded-[18px] border border-[#20482f] bg-[#0d1510] p-4 text-sm leading-7 text-[#d8f1df]">
                              {item.correctAns || "Reference answer was not available for this question."}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-white/10 bg-[#181818] p-5">
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a294]">
                            Feedback
                          </p>
                          <div className="space-y-3">
                            {item.bullets.map((bullet, index) => {
                              const Icon = bullet.icon;
                              return (
                                <div
                                  key={`${item.id}-bullet-${index}`}
                                  className="flex items-start gap-3 rounded-[18px] border border-white/8 bg-[#141414] p-3"
                                >
                                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${bullet.tone}`} />
                                  <p className="text-sm leading-7 text-[#d8d2c5]">{bullet.text}</p>
                                </div>
                              );
                            })}
                          </div>

                          {!!item.keyTerms.length && (
                            <div className="mt-5">
                              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a294]">
                                Key terms you missed
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.keyTerms.map((term) => (
                                  <span
                                    key={`${item.id}-${term}`}
                                    className="rounded-full border border-[#27406f] bg-[#101928] px-3 py-1 text-xs font-semibold text-[#9fc3ff]"
                                  >
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <Button
                            onClick={() =>
                              router.push(
                                `/dashboard/interview/${params.interviewId}/start?question=${item.displayIndex - 1}`
                              )
                            }
                            className="premium-button-secondary px-4 py-2 text-[10px]"
                          >
                            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                            Retry This Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <div className="mt-10 flex flex-col items-stretch justify-between gap-3 rounded-[24px] border border-white/10 bg-[#121212] px-5 py-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a294]">
                Next step
              </p>
              <p className="mt-2 text-sm leading-7 text-[#d8d2c5]">
                Revisit a weak answer now, or download your report and review it later.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push(`/dashboard/interview/${params.interviewId}`)}
                className="premium-button-primary px-4 py-2 text-[10px]"
              >
                Practice Again
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => window.print()}
                className="premium-button-secondary px-4 py-2 text-[10px]"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download Report as PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
