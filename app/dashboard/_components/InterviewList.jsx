"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton"


const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  };
  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#111111]">Previous Mock Interviews</h2>
  
      {interviewList ? (
        <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      ) : (
        <p className="text-[#666666]">Loading previous interviews...</p>
      )}
    </div>
  );
};

export default InterviewList;
