"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import QuestionItemCard from "./QuestionItemCard";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionList = () => {
  const { user } = useUser();
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    user && GetQuestionList();
  }, [user]);

  const GetQuestionList = async () => {
    const result = await db
      .select()
      .from(Question)
      .where(eq(Question.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Question.id));

    console.log(result);
    setQuestionList(result);
  };
  return (
    <div>
      {questionList.length > 0 ? (
        <>
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#111111]">Previous Question Sets</h2>
          <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questionList.map((question, index) => (
              <QuestionItemCard key={index} question={question} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-[#666666]">Loading previous interviews...</p>
      )}
    </div>
  );
};

export default QuestionList;
