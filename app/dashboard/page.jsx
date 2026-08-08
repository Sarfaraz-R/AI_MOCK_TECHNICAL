import React from "react";
import Link from "next/link";
import { BookOpenCheck, Layers3 } from "lucide-react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="premium-shell">
      <div className="premium-container pt-28 pb-24">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">Dashboard</h2>
          <div className="mx-auto mb-4 mt-1 h-3 w-[470px] max-w-[88%]">
            <svg
              viewBox="0 0 470 20"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 15C118 5 244 4 462 9"
                stroke="#ef4444"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-[#666666]">
            Show up sharp, stay confident, and turn practice into your edge.
          </h2>
        </div>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-3" >
          <AddNewInterview/>
          <div className="premium-card flex min-h-[265px] flex-col justify-between p-7 text-[#111111]">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#bfdbfe] bg-[#dbeafe] text-[#1d4ed8]">
                <BookOpenCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-8 text-xl font-bold tracking-tight text-[#111111]">Quick Revise</h3>
              <p className="mt-3 max-w-md text-base font-medium leading-7 text-[#666666]">
                Practice core CS subjects with a timed MCQ assessment.
              </p>
            </div>
            <Link
              href="/dashboard/assessment"
              className="premium-button-primary mt-8 h-12 w-full"
            >
              Start
            </Link>
          </div>
          <div className="premium-card flex min-h-[265px] flex-col justify-between p-7 text-[#111111]">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#fecaca] bg-[#fee2e2] text-[#dc2626]">
                <Layers3 className="h-6 w-6" />
              </div>
              <h3 className="mt-8 text-xl font-bold tracking-tight text-[#111111]">Subject Top 50</h3>
              <p className="mt-3 max-w-md text-base font-medium leading-7 text-[#666666]">
                Revise each subject separately with a focused Top 50 interview-ready question deck.
              </p>
            </div>
            <Link
              href="/dashboard/revise"
              className="premium-button-primary mt-8 h-12 w-full"
            >
              Explore
            </Link>
          </div>
        </div>

        <div className="">
          <InterviewList/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
