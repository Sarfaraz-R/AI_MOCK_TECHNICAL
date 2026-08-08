"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Clock3, RotateCcw, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const scoreTone = (percentage) => {
  if (percentage >= 75) {
    return "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]";
  }

  if (percentage >= 50) {
    return "border-[#fde68a] bg-[#fffbeb] text-[#b45309]";
  }

  return "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]";
};

const AssessmentHistoryCard = ({ assessment }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const openAssessment = () => router.push("/dashboard/assessment");

  return (
    <>
      <div className="interview-hover-shell group">
        <div className="interview-hover-panel interview-hover-panel-top premium-card p-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-full w-full items-center justify-between rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-5 text-[#1d4ed8]"
          >
            <span className="text-sm font-semibold">Quick MCQ Result</span>
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="interview-hover-main premium-card premium-card-hover w-full p-6 text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-2 text-xl font-bold tracking-tight text-[#111111] transition-colors duration-300 group-hover:text-[#123524]">
                {assessment.subject}
              </h2>
              <h2 className="mb-3 text-sm font-medium text-[#666666] transition-colors duration-300 group-hover:text-[#355845]">
                {assessment.questionCount} Questions • {assessment.duration} mins
              </h2>
            </div>
            <div className="interview-hover-badge">
              <Trophy className="h-4 w-4" />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(assessment.percentage)}`}>
              {assessment.percentage}% Score
            </span>
            <span className="rounded-full border border-[#e9e1d2] bg-[#F5F5F5] px-3 py-1 text-xs font-semibold text-[#666666]">
              {assessment.rating}
            </span>
          </div>

          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#888888] transition-colors duration-300 group-hover:text-[#4c6f5d]">
            Taken At: {assessment.createdAt}
          </h2>

          <div className="interview-hover-meta">
            <span>{assessment.correct}/{assessment.questionCount} correct</span>
            <span>{assessment.difficulty} difficulty</span>
          </div>
        </button>

        <div className="interview-hover-panel interview-hover-panel-bottom premium-card p-4">
          <Button
            onClick={openAssessment}
            size="sm"
            className="premium-button-primary h-full w-full justify-between rounded-full px-5"
          >
            <span>Retake</span>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-[24px] border border-white/10 bg-[#111111] p-0 text-[#f7f3ea]">
          <div className="p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold text-[#f7f3ea]">
                Quick MCQ Result
              </DialogTitle>
              <p className="text-sm font-medium text-[#f7f3ea]">
                Your saved assessment summary for {assessment.subject}.
              </p>
            </DialogHeader>

            <div className="mt-6 rounded-[20px] border border-white/10 bg-[#171717] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#f7f3ea]">{assessment.subject}</h3>
                  <p className="mt-1 text-sm font-medium text-[#c9c1b3]">
                    {assessment.difficulty} difficulty
                  </p>
                </div>
                <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${scoreTone(assessment.percentage)}`}>
                  {assessment.percentage}% Score
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#1d1d1d] p-4">
                  <div className="flex items-center gap-2 text-[#1d4ed8]">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Accuracy</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-[#f7f3ea]">
                    {assessment.correct}/{assessment.questionCount}
                  </p>
                  <p className="text-sm text-[#c9c1b3]">Correct answers</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#1d1d1d] p-4">
                  <div className="flex items-center gap-2 text-[#b45309]">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Duration</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-[#f7f3ea]">
                    {assessment.duration} mins
                  </p>
                  <p className="text-sm text-[#c9c1b3]">{assessment.questionCount} questions</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#1d1d1d] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f9687]">
                  Attempt Summary
                </p>
                <p className="mt-2 text-sm leading-7 text-[#d7cfbf]">
                  You completed a {assessment.subject} quick MCQ round on {assessment.createdAt} and finished with a{" "}
                  <strong className="text-[#f7f3ea]">{assessment.rating}</strong> result.
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                className="premium-button-secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                className="premium-button-primary"
                onClick={openAssessment}
              >
                Retake Assessment
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentHistoryCard;
