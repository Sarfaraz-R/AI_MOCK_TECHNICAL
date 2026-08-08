"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { useAuth } from "@/components/AuthProvider";
import AssessmentHistoryCard from "./AssessmentHistoryCard";
import {
  ASSESSMENT_HISTORY_UPDATED_EVENT,
  readAssessmentHistory,
} from "../assessment/_data/assessmentHistory";


const InterviewList = () => {
  const { user } = useAuth();
  const [interviewList, setInterviewList] = useState([]);
  const [assessmentList, setAssessmentList] = useState([]);

  const loadAssessmentHistory = React.useCallback(() => {
    const userEmail = user?.email?.toLowerCase?.();

    const history = readAssessmentHistory().filter((item) => {
      if (!userEmail) return true;
      if (!item?.userEmail) return true;
      return item.userEmail.toLowerCase() === userEmail;
    });

    setAssessmentList(history);
  }, [user?.email]);

  useEffect(() => {
    if (!user) return;

    GetInterviewList();
    loadAssessmentHistory();
  }, [user, loadAssessmentHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    window.addEventListener(ASSESSMENT_HISTORY_UPDATED_EVENT, loadAssessmentHistory);
    window.addEventListener("storage", loadAssessmentHistory);
    window.addEventListener("focus", loadAssessmentHistory);

    return () => {
      window.removeEventListener(ASSESSMENT_HISTORY_UPDATED_EVENT, loadAssessmentHistory);
      window.removeEventListener("storage", loadAssessmentHistory);
      window.removeEventListener("focus", loadAssessmentHistory);
    };
  }, [loadAssessmentHistory]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.email)
      )
      .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  };
  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#111111]">Previous Mock Interviews</h2>
  
      {interviewList.length ? (
        <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      ) : (
        <p className="text-[#666666]">No previous mock interviews yet.</p>
      )}

      <div className="mt-12">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#111111]">Quick MCQ Test Results</h2>

        {assessmentList.length ? (
          <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessmentList.map((assessment) => (
              <AssessmentHistoryCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        ) : (
          <p className="text-[#666666]">No quick MCQ test results yet.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewList;
