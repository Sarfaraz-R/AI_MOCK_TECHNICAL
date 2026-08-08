import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Lightbulb, Volume2 } from "lucide-react";
import React, { useState } from "react";

const QuestionSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  questionStates,
  onJumpToQuestion,
  onMarkForReview,
  onSubmit,
}) => {
  const [tipsOpen, setTipsOpen] = useState(true);

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech.");
    }
  };

  const currentQuestion = mockInterviewQuestion?.[activeQuestionIndex];
  const legendItems = [
    { label: "Current", className: "border-[#000000] bg-[#000000] text-white" },
    { label: "Answered", className: "border-[#404040] bg-[#262626] text-white" },
    { label: "Marked for Review", className: "border-[#7c5c14] bg-[#3a2b0f] text-[#f4d58d]" },
    { label: "Not Answered", className: "border-[#3a3a3a] bg-[#1b1b1b] text-[#c4c4c4]" },
  ];

  return (
    currentQuestion && (
      <div className="flex h-full flex-col justify-between rounded-[24px] px-4 py-5 text-[#f5f5f5] md:px-6 md:py-6 lg:rounded-none lg:border-r lg:border-[#2f2f2f]">
        <div>
          <div className="mb-5 border-b border-[#2f2f2f] pb-5">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              {mockInterviewQuestion.map((_, index) => {
                const state = questionStates[index] || {};
                const isCurrent = index === activeQuestionIndex;
                const isAnswered = Boolean(state.answered);
                const isMarkedForReview = Boolean(state.review);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onJumpToQuestion(index)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                      isCurrent
                        ? "border-[#000000] bg-[#000000] text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                        : isMarkedForReview
                          ? "border-[#7c5c14] bg-[#3a2b0f] text-[#f4d58d]"
                        : isAnswered
                          ? "border-[#404040] bg-[#262626] text-white"
                          : "border-[#3a3a3a] bg-[#1b1b1b] text-[#c4c4c4] hover:border-[#5a5a5a] hover:bg-[#242424] hover:text-white"
                    }`}
                  >
                    {isAnswered ? <Check className="h-4 w-4" /> : null}
                  {`Q${index + 1}`}
                </button>
              );
            })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {legendItems.map((item) => (
                <div
                  key={item.label}
                  className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-semibold ${item.className}`}
                >
                  {item.label}
                </div>
              ))}

              <Button
                onClick={() => onMarkForReview(activeQuestionIndex)}
                className="premium-button-primary px-3 py-1.5 text-[10px] md:text-[10px]"
              >
                Mark for Review
              </Button>

              <Button
                onClick={onSubmit}
                className="premium-button-primary ml-auto px-3 py-1.5 text-[10px] md:text-[10px]"
              >
                Submit Interview
              </Button>
            </div>
          </div>

          <div className="rounded-[22px] border border-[#2f2f2f] bg-[#202020] p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#3a3a3a] bg-[#111111] px-4 py-1.5 text-xs font-semibold text-white">
                  Question {activeQuestionIndex + 1}
                </span>
                <span className="rounded-full border border-[#3a3a3a] bg-[#262626] px-4 py-1.5 text-xs font-semibold text-[#d4d4d4]">
                  Technical Round
                </span>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#3a3a3a] bg-[#111111] p-3 text-white transition-colors duration-200 hover:border-[#5a5a5a] hover:bg-[#1a1a1a]"
                onClick={() => textToSpeech(currentQuestion?.Question)}
              >
                <Volume2 size={20} />
              </button>
            </div>

            <h2 className="text-2xl font-bold leading-[1.22] text-[#f5f5f5] md:text-[2.05rem]">
              {currentQuestion?.Question}
            </h2>
          </div>

          <div className="mt-5 overflow-hidden rounded-[20px] border border-[#2f2f2f] bg-[#1b1b1b]">
            <button
              type="button"
              onClick={() => setTipsOpen((open) => !open)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2 text-white">
                <Lightbulb size={20} className="text-[#facc15]" />
                <strong className="font-semibold">Notes / Tips</strong>
              </span>
              <ChevronDown
                className={`h-5 w-5 text-[#a3a3a3] transition-transform duration-200 ${
                  tipsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {tipsOpen ? (
              <div className="border-t border-[#2f2f2f] px-5 pb-5 pt-4">
                <p className="text-sm leading-6 text-[#c4c4c4]">
                  {process.env.NEXT_PUBLIC_QUESTION_NOTE}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
