"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, CheckCircle2, Clock3, Flag, RotateCcw, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DIFFICULTIES, DURATIONS, QUESTION_BANK, QUESTION_COUNTS, SUBJECTS } from "../_data/questionBank";
import { saveAssessmentHistoryEntry } from "../_data/assessmentHistory";
import { useAuth } from "@/components/AuthProvider";

const shuffle = (items) =>
  [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const buildAssessment = (config) => {
  const filtered = QUESTION_BANK.filter((question) => {
    const subjectMatches = config.subject === "Mixed Subjects" || question.subject === config.subject;
    const difficultyMatches = config.difficulty === "Mixed" || question.difficulty === config.difficulty;
    return subjectMatches && difficultyMatches;
  });

  const source = config.randomizeQuestions ? shuffle(filtered) : filtered;
  const repeated = Array.from({ length: Math.ceil(config.questionCount / source.length) || 1 }, () => source).flat();

  return repeated.slice(0, config.questionCount).map((question, index) => ({
    ...question,
    instanceId: `${question.id}-${index}`,
    options: config.randomizeOptions ? shuffle(question.options) : question.options,
  }));
};

const getRating = (percentage) => {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Strong";
  if (percentage >= 50) return "Developing";
  return "Needs Practice";
};

const difficultyBadgeClass = {
  Easy: "bg-[#dcfce7] text-[#166534] border-[#86efac]",
  Medium: "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]",
  Hard: "bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]",
  Mixed: "bg-[#e0e7ff] text-[#3730a3] border-[#a5b4fc]",
};

const MiniBar = ({ label, value, max, detail, color = "#2563eb", track = "#dbeafe" }) => (
  <div>
    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-[#111111]">{label}</span>
      <span className="text-[#666666]">{detail ?? value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: track }}>
      <div className="h-full rounded-full" style={{ width: `${max ? Math.min((value / max) * 100, 100) : 0}%`, backgroundColor: color }} />
    </div>
  </div>
);

export default function AssessmentModule() {
  const { user } = useAuth();
  const [mode, setMode] = useState("setup");
  const [config, setConfig] = useState({
    subject: SUBJECTS[0],
    difficulty: "Mixed",
    questionCount: 10,
    duration: 20,
    randomizeQuestions: true,
    randomizeOptions: true,
    includeAttempted: true,
  });
  const [customCount, setCustomCount] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const remainingCount = Math.max(questions.length - answeredCount, 0);
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const currentQuestion = questions[currentIndex];
  const selectedCount = Number(customCount) || config.questionCount;
  const selectedDuration = Number(customDuration) || config.duration;

  const setupPoolCount = useMemo(() => {
    return QUESTION_BANK.filter((question) => {
      const subjectMatches = config.subject === "Mixed Subjects" || question.subject === config.subject;
      const difficultyMatches = config.difficulty === "Mixed" || question.difficulty === config.difficulty;
      return subjectMatches && difficultyMatches;
    }).length;
  }, [config.subject, config.difficulty]);

  const result = useMemo(() => {
    if (!questions.length) return null;

    const rows = questions.map((question) => {
      const selected = answers[question.instanceId];
      const status = selected ? (selected === question.correctAnswer ? "correct" : "incorrect") : "skipped";
      return { ...question, selected, status };
    });
    const correct = rows.filter((row) => row.status === "correct").length;
    const incorrect = rows.filter((row) => row.status === "incorrect").length;
    const skipped = rows.filter((row) => row.status === "skipped").length;
    const attempted = correct + incorrect;
    const percentage = Math.round((correct / questions.length) * 100);
    const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
    const timeTaken = startedAt ? Math.max(Math.round(((submittedAt || Date.now()) - startedAt) / 1000), 0) : 0;

    const bySubject = SUBJECTS.map((subject) => {
      const subjectRows = rows.filter((row) => row.subject === subject);
      const subjectCorrect = subjectRows.filter((row) => row.status === "correct").length;
      return {
        label: subject,
        total: subjectRows.length,
        correct: subjectCorrect,
        percentage: subjectRows.length ? Math.round((subjectCorrect / subjectRows.length) * 100) : 0,
      };
    }).filter((item) => item.total);

    const byDifficulty = ["Easy", "Medium", "Hard"].map((difficulty) => {
      const difficultyRows = rows.filter((row) => row.difficulty === difficulty);
      const difficultyCorrect = difficultyRows.filter((row) => row.status === "correct").length;
      return {
        label: difficulty,
        total: difficultyRows.length,
        correct: difficultyCorrect,
        percentage: difficultyRows.length ? Math.round((difficultyCorrect / difficultyRows.length) * 100) : 0,
      };
    }).filter((item) => item.total);

    const sortedSubjects = [...bySubject].sort((a, b) => b.percentage - a.percentage);

    return {
      rows,
      correct,
      incorrect,
      skipped,
      attempted,
      percentage,
      accuracy,
      timeTaken,
      rating: getRating(percentage),
      bySubject,
      byDifficulty,
      strongSubjects: sortedSubjects.filter((item) => item.percentage >= 70).slice(0, 3),
      weakSubjects: sortedSubjects.filter((item) => item.percentage < 70).slice(-3),
    };
  }, [answers, questions, startedAt, submittedAt]);

  const submitAssessment = (message = "Assessment submitted.") => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const submittedTime = Date.now();
    setSubmittedAt(submittedTime);

    if (result) {
      saveAssessmentHistoryEntry({
        id: `assessment-${submittedTime}`,
        userEmail: user?.email?.toLowerCase?.() || "",
        subject: config.subject,
        difficulty: config.difficulty,
        questionCount: questions.length,
        duration: selectedDuration,
        correct: result.correct,
        percentage: result.percentage,
        rating: result.rating,
        createdAt: new Date(submittedTime).toISOString().split("T")[0],
      });
    }

    setMode("result");
    setConfirmOpen(false);
    toast(message);
  };

  useEffect(() => {
    if (mode !== "test" || submittedRef.current) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer);
          submitAssessment("Time is up. Assessment submitted automatically.");
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  const startAssessment = () => {
    const nextConfig = {
      ...config,
      questionCount: Math.max(1, Math.min(Number(customCount) || config.questionCount, 50)),
      duration: Math.max(1, Number(customDuration) || config.duration),
    };
    const nextQuestions = buildAssessment(nextConfig);

    setQuestions(nextQuestions);
    setAnswers({});
    setReviewMarked({});
    setCurrentIndex(0);
    setTimeLeft(nextConfig.duration * 60);
    setStartedAt(Date.now());
    setSubmittedAt(null);
    submittedRef.current = false;
    setConfig(nextConfig);
    setMode("test");
  };

  const selectAnswer = (answer) => {
    setAnswers((previous) => ({ ...previous, [currentQuestion.instanceId]: answer }));
  };

  const clearResponse = () => {
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[currentQuestion.instanceId];
      return next;
    });
  };

  const toggleReview = () => {
    setReviewMarked((previous) => ({
      ...previous,
      [currentQuestion.instanceId]: !previous[currentQuestion.instanceId],
    }));
  };

  if (mode === "result" && result) {
    const maxSubject = Math.max(...result.bySubject.map((item) => item.total), 1);
    const maxDifficulty = Math.max(...result.byDifficulty.map((item) => item.total), 1);
    const scoreCards = [
      ["Final Score", `${result.correct}/${questions.length}`],
      ["Percentage", `${result.percentage}%`],
      ["Accuracy", `${result.accuracy}%`],
      ["Time Taken", formatTime(result.timeTaken)],
    ];

    return (
      <div>
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#666666]">Assessment report</p>
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">Your Results</h2>
          <h2 className="text-lg font-medium text-[#666666]">Detailed performance breakdown and answer review.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {scoreCards.map(([label, value]) => (
            <div key={label} className="rounded-[20px] border border-[#60a5fa]/35 bg-[#111827] p-5 shadow-[0_14px_42px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold text-[#bfdbfe]">{label}</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ffffff]">{value}</h3>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="premium-card p-6">
            <h3 className="mb-5 text-2xl font-bold text-[#111111]">Analytics</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <MiniBar label="Correct" value={result.correct} max={questions.length} color="#22c55e" track="#e5e7eb" />
              <MiniBar label="Incorrect" value={result.incorrect} max={questions.length} color="#ef4444" track="#e5e7eb" />
              <MiniBar label="Skipped" value={result.skipped} max={questions.length} color="#f59e0b" track="#e5e7eb" />
              <MiniBar label="Attempt Rate" value={result.attempted} max={questions.length} detail={`${Math.round((result.attempted / questions.length) * 100)}%`} color="#3b82f6" track="#e5e7eb" />
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 font-semibold text-[#111111]">Subject-wise Performance</p>
                <div className="space-y-4">
                  {result.bySubject.map((item) => (
                    <MiniBar key={item.label} label={item.label} value={item.correct} max={maxSubject} detail={`${item.correct}/${item.total} (${item.percentage}%)`} color="#3b82f6" track="#e5e7eb" />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-4 font-semibold text-[#111111]">Difficulty-wise Performance</p>
                <div className="space-y-4">
                  {result.byDifficulty.map((item) => (
                    <MiniBar
                      key={item.label}
                      label={item.label}
                      value={item.correct}
                      max={maxDifficulty}
                      detail={`${item.correct}/${item.total} (${item.percentage}%)`}
                      color="#3b82f6"
                      track="#e5e7eb"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6">
              <h3 className="mb-4 text-2xl font-bold text-[#111111]">Performance</h3>
              <div className="grid gap-3 text-sm text-[#666666]">
                <p><strong className="text-[#111111]">Rating:</strong> <span className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-bold text-[#1d4ed8]">{result.rating}</span></p>
                <p><strong className="text-[#111111]">Strong Subjects:</strong> <span>{result.strongSubjects.map((item) => item.label).join(", ") || "Keep practicing"}</span></p>
                <p><strong className="text-[#111111]">Weak Subjects:</strong> <span>{result.weakSubjects.map((item) => item.label).join(", ") || "None"}</span></p>
                <p><strong className="text-[#111111]">Time per Question:</strong> {formatTime(Math.round(result.timeTaken / questions.length))}</p>
              </div>
            </div>
            <div className="premium-card p-6">
              <h3 className="mb-4 text-2xl font-bold text-[#111111]">Status Distribution</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[#166534]"><CheckCircle2 className="mx-auto mb-2 h-5 w-5" /><p className="font-bold">{result.correct}</p><p className="text-xs font-semibold">Correct</p></div>
                <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-[#991b1b]"><XCircle className="mx-auto mb-2 h-5 w-5" /><p className="font-bold">{result.incorrect}</p><p className="text-xs font-semibold">Incorrect</p></div>
                <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] p-4 text-[#92400e]"><Clock3 className="mx-auto mb-2 h-5 w-5" /><p className="font-bold">{result.skipped}</p><p className="text-xs font-semibold">Skipped</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 premium-card p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-[#111111]">Answer Review</h3>
            <Button className="premium-button-secondary" onClick={() => setMode("setup")}>
              <RotateCcw className="mr-2 h-4 w-4" /> New Assessment
            </Button>
          </div>
          <div className="space-y-4">
            {result.rows.map((question, index) => (
              <div key={question.instanceId} className="rounded-2xl border border-[#e9e1d2] bg-[#fffefa] p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#bfdbfe] bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">Q{index + 1}</span>
                  <span className="rounded-full border border-[#e9e1d2] bg-[#F5F5F5] px-3 py-1 text-xs font-semibold text-[#666666]">{question.subject}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyBadgeClass[question.difficulty]}`}>{question.difficulty}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${question.status === "correct" ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]" : question.status === "incorrect" ? "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]" : "border-[#fde68a] bg-[#fffbeb] text-[#92400e]"}`}>{question.status}</span>
                </div>
                <p className="font-semibold text-[#111111]">{question.question}</p>
                <div className="mt-3 grid gap-2 text-sm text-[#666666]">
                  <p>Selected Answer: <strong className={question.status === "correct" ? "text-[#166534]" : "text-[#991b1b]"}>{question.selected || "Skipped"}</strong></p>
                  <p>Correct Answer: <strong className="text-[#166534]">{question.correctAnswer}</strong></p>
                  <p>{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "test" && currentQuestion) {
    return (
      <div>
        <div className="sticky top-24 z-30 mb-5 rounded-2xl border border-[#1d4ed8]/25 bg-[#111827]/95 p-3 shadow-[0_18px_60px_rgba(17,24,39,0.18)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-3 py-2 text-sm font-bold text-white">
              <Clock3 className="h-5 w-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div className="min-w-[220px] flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-[#facc15]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white">
              <span className="rounded-xl bg-[#16a34a] px-2.5 py-1.5">Answered {answeredCount}</span>
              <span className="rounded-xl bg-[#dc2626] px-2.5 py-1.5">Remaining {remainingCount}</span>
              <Button className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white [--button-bg:rgba(255,255,255,0.1)] [--button-hover-bg:rgba(255,255,255,0.2)] [--button-text:#ffffff] [--button-text-hover:#ffffff]" onClick={toggleReview}>
                <Flag className="mr-1.5 h-3.5 w-3.5" /> {reviewMarked[currentQuestion.instanceId] ? "Marked" : "Review"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_260px]">
          <div className="premium-card p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#bfdbfe] bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">Question {currentIndex + 1}</span>
              <span className="rounded-full border border-[#c4b5fd] bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#6d28d9]">{currentQuestion.subject}</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyBadgeClass[currentQuestion.difficulty]}`}>{currentQuestion.difficulty}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111] md:text-2xl">{currentQuestion.question}</h2>
            <div className="mt-5 grid gap-2.5">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.instanceId] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectAnswer(option)}
                    className={`premium-button-animated rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                      selected
                        ? "border-[#2563eb] bg-[#2563eb] text-[#ffffff] [--button-bg:#2563eb] [--button-hover-bg:#1d4ed8] [--button-text:#ffffff] [--button-text-hover:#ffffff]"
                        : "border-[#e9e1d2] bg-[#fffefa] text-[#111111] [--button-bg:#fffefa] [--button-hover-bg:#1d4ed8] [--button-text:#111111] [--button-text-hover:#ffffff] hover:border-[#60a5fa]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button className="premium-button-secondary px-3 py-1.5 text-[10px]" onClick={clearResponse}>Clear Response</Button>
              <div className="flex gap-3">
                <Button className="premium-button-secondary px-3 py-1.5 text-[10px]" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => index - 1)}>Previous</Button>
                {currentIndex < questions.length - 1 ? (
                  <Button className="premium-button-primary px-3.5 py-1.5 text-[10px]" onClick={() => setCurrentIndex((index) => index + 1)}>Next</Button>
                ) : (
                  <Button className="premium-button-primary px-3.5 py-1.5 text-[10px]" onClick={() => setConfirmOpen(true)}>
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Finish Test
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside className="premium-card h-fit p-4">
            <h3 className="mb-4 text-lg font-bold text-[#111111]">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const answered = Boolean(answers[question.instanceId]);
                const marked = Boolean(reviewMarked[question.instanceId]);
                const className = isCurrent
                  ? "border-[#2563eb] bg-[#2563eb] text-white"
                  : marked
                    ? "border-[#f59e0b] bg-[#fef3c7] text-[#92400e]"
                    : answered
                      ? "border-[#16a34a] bg-[#dcfce7] text-[#166534]"
                      : "border-[#e9e1d2] bg-transparent text-[#666666]";
                return (
                  <button key={question.instanceId} type="button" onClick={() => setCurrentIndex(index)} className={`premium-button-animated h-9 rounded-lg border text-xs font-semibold ${className} ${isCurrent ? "[--button-bg:#2563eb] [--button-hover-bg:#1d4ed8] [--button-text:#ffffff] [--button-text-hover:#ffffff]" : marked ? "[--button-bg:#fef3c7] [--button-hover-bg:#f59e0b] [--button-text:#92400e] [--button-text-hover:#78350f]" : answered ? "[--button-bg:#dcfce7] [--button-hover-bg:#16a34a] [--button-text:#166534] [--button-text-hover:#ffffff]" : "[--button-bg:transparent] [--button-hover-bg:#f6f2e8] [--button-text:#666666] [--button-text-hover:#15130f]"}`}>
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 grid gap-2 text-xs font-medium text-[#666666]">
              <p><span className="mr-2 inline-block h-3 w-3 rounded bg-[#2563eb]" />Current</p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded bg-[#dcfce7]" />Answered</p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded bg-[#fef3c7]" />Marked for Review</p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded border border-[#e9e1d2]" />Not Answered</p>
            </div>
          </aside>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-md rounded-[20px] border-[#E5E5E5] bg-white text-[#111111]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#111111]">Submit assessment?</DialogTitle>
              <DialogDescription className="text-[#666666]">
                You have answered {answeredCount}/{questions.length} questions. {remainingCount} questions are unanswered.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className="premium-button-secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button className="premium-button-primary" onClick={() => submitAssessment("Assessment submitted.")}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mb-6 max-w-4xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#666666]">Assessment</p>
        <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">MCQ Assessment</h2>
        <h2 className="text-lg font-medium text-[#666666]">Configure a timed CS fundamentals test before you begin.</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="premium-card p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111111]">Subject</span>
              <select className="premium-input" value={config.subject} onChange={(event) => setConfig({ ...config, subject: event.target.value })}>
                <option>Mixed Subjects</option>
                {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111111]">Difficulty</span>
              <select className="premium-input" value={config.difficulty} onChange={(event) => setConfig({ ...config, difficulty: event.target.value })}>
                {DIFFICULTIES.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#111111]">Number of Questions</span>
              <div className="grid grid-cols-5 gap-2">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => { setCustomCount(""); setConfig({ ...config, questionCount: count }); }}
                    className={`inline-flex min-h-[2.25rem] items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold tracking-normal transition-colors ${
                      selectedCount === count
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#3a3a3a] bg-[#1b1b1b] text-white hover:bg-[#242424]"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <Input className="premium-input mt-3" type="number" min="1" max="50" placeholder="Custom value" value={customCount} onChange={(event) => setCustomCount(event.target.value)} />
            </div>
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#111111]">Test Duration</span>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => { setCustomDuration(""); setConfig({ ...config, duration }); }}
                    className={`inline-flex min-h-[2.25rem] items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold tracking-normal normal-case transition-colors ${
                      selectedDuration === duration
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#3a3a3a] bg-[#1b1b1b] text-white hover:bg-[#242424]"
                    }`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>
              <Input className="premium-input mt-3" type="number" min="1" placeholder="Custom minutes" value={customDuration} onChange={(event) => setCustomDuration(event.target.value)} />
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {[
              ["randomizeQuestions", "Randomize Questions"],
              ["randomizeOptions", "Randomize Options"],
              ["includeAttempted", "Include Previously Attempted"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9e1d2] bg-[#fffefa] px-4 py-3 text-sm font-semibold text-[#111111]">
                <span>{label}</span>
                <input type="checkbox" checked={config[key]} onChange={(event) => setConfig({ ...config, [key]: event.target.checked })} />
              </label>
            ))}
          </div>
        </div>

        <aside className="premium-card h-fit p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold text-[#111111]">Assessment Summary</h3>
          <div className="mt-5 grid gap-3 text-sm text-[#666666]">
            <p><strong className="text-[#111111]">Estimated completion:</strong> {selectedDuration} mins</p>
            <p><strong className="text-[#111111]">Difficulty:</strong> {config.difficulty}</p>
            <p><strong className="text-[#111111]">Question count:</strong> {Math.min(selectedCount, 50)}</p>
            <p><strong className="text-[#111111]">Available pool:</strong> {setupPoolCount} base questions</p>
          </div>
          <Button className="premium-button-primary mt-6 w-full px-4 py-2 text-[10px]" onClick={startAssessment}>
            Start Assessment
          </Button>
        </aside>
      </div>
    </div>
  );
}
