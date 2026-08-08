"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

const FALLBACK_QUESTIONS = [
  { Question: "What is the difference between an Array and an ArrayList in Java?", Answer: "" },
  { Question: "Explain the difference between stack memory and heap memory in Java.", Answer: "" },
  { Question: "What are the main principles of object-oriented programming?", Answer: "" },
  { Question: "How does exception handling work in Java?", Answer: "" },
  { Question: "When would you use an interface instead of an abstract class?", Answer: "" },
];

const StartInterview = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState({});
  const [hasUnsavedCapture, setHasUnsavedCapture] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  const questions = mockInterviewQuestion?.length ? mockInterviewQuestion : FALLBACK_QUESTIONS;
  const totalQuestions = questions.length;

  useEffect(() => {
    const requestedQuestion = Number(searchParams.get("question"));

    if (
      !Number.isNaN(requestedQuestion) &&
      requestedQuestion >= 0 &&
      requestedQuestion < totalQuestions
    ) {
      setActiveQuestionIndex(requestedQuestion);
    }
  }, [searchParams, totalQuestions]);

  const confirmQuestionChange = (targetIndex) => {
    if (targetIndex === activeQuestionIndex) return false;
    if (!hasUnsavedCapture) return true;

    return window.confirm(
      "You have an in-progress recording or an unsaved response for this question. Do you want to leave this question?"
    );
  };

  const jumpToQuestion = (targetIndex) => {
    if (!confirmQuestionChange(targetIndex)) return;
    setActiveQuestionIndex(targetIndex);
    setHasUnsavedCapture(false);
  };

  const markAnswered = (questionIndex) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        answered: true,
        skipped: false,
        review: false,
      },
    }));
  };

  const toggleMarkForReview = (questionIndex) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        ...(prev[questionIndex] || {}),
        review: !(prev[questionIndex]?.review),
      },
    }));
  };

  const handlePrevious = () => {
    if (activeQuestionIndex === 0) return;
    if (!confirmQuestionChange(activeQuestionIndex - 1)) return;
    setActiveQuestionIndex((index) => index - 1);
    setHasUnsavedCapture(false);
  };

  const handleNext = () => {
    if (activeQuestionIndex === totalQuestions - 1) return;
    if (!confirmQuestionChange(activeQuestionIndex + 1)) return;
    setActiveQuestionIndex((index) => index + 1);
    setHasUnsavedCapture(false);
  };

  const handleSubmitInterview = () => {
    if (hasUnsavedCapture) {
      const shouldLeave = window.confirm(
        "You still have an in-progress recording or unsaved response. Do you want to submit the interview anyway?"
      );

      if (!shouldLeave) return;
    }

    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
  };

  return (
    <div className="premium-shell pt-36 pb-24">
      <div className="premium-container">
        <div className="mx-auto my-6 max-w-6xl rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] md:p-5">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <QuestionSection
              mockInterviewQuestion={questions}
              activeQuestionIndex={activeQuestionIndex}
              questionStates={questionStates}
              onJumpToQuestion={jumpToQuestion}
              onMarkForReview={toggleMarkForReview}
              onSubmit={handleSubmitInterview}
            />

            <RecordAnswerSection
              mockInterviewQuestion={questions}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
              onAnswerSaved={markAnswered}
              onBusyStateChange={setHasUnsavedCapture}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
