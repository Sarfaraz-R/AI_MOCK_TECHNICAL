import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="premium-shell">
      <div className="premium-container pt-36 pb-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#666666]">Workspace</p>
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">Dashboard</h2>
          <h2 className="text-lg font-medium text-[#666666]" >Create and start your AI mock interview.</h2>
        </div>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-3" >
          <AddNewInterview/>
        </div>

        <div className="">
          <InterviewList/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
