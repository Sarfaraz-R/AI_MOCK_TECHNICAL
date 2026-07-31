import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddQuestions from "../_components/AddQuestions";
import QuestionList from "../_components/QuestionList";

const Questions = () => {
  return (
    <div className="premium-shell">
      <div className="premium-container pt-36 pb-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#666666]">Question bank</p>
        <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">Master Your Interviews</h2>
        <h2 className="mb-10 text-lg font-medium text-[#666666]" >Comprehensive question preparation with AI.</h2>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-3" >
          <AddQuestions/>
        </div>

        <QuestionList/>
      </div>
    </div>
  );
};

export default Questions;
