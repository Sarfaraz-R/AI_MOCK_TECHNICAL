"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";
import { useContext } from 'react';
import { WebCamContext } from "../../layout";

const Interview = ({ params }) => {
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const [interviewData, setInterviewData] = useState();
  // const [webCamEnabled, setWebCamEnebled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);
  
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
      
    setInterviewData(result[0]);
  };
  return (
    <div className="premium-shell pt-36 pb-24">
      <div className="premium-container">
      <h2 className="mb-12 text-center text-5xl font-extrabold tracking-tight text-[#111111]">Let's Get Started</h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col my-5 gap-5">
          <div className="premium-card flex flex-col gap-4 p-6">
            <h2 className="text-lg text-[#666666]">
              <strong className="text-[#111111]">Job Role/Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg text-[#666666]">
              <strong className="text-[#111111]">Job Description/Job Stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg text-[#666666]">
              <strong className="text-[#111111]">Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="rounded-[20px] border border-[#E5E5E5] bg-[#F8F8F8] p-6">
            <h2 className="mb-3 flex items-center gap-2 text-[#111111]">
              <Lightbulb className="text-[#111111]" size={20} />
              <strong className="font-semibold">Information</strong>
            </h2>
            <h2 className="mt-2 text-sm leading-6 text-[#666666]">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <div className="premium-card flex items-center justify-center p-5">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                height={300}
                width={300}
                mirrored={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <WebcamIcon className="my-6 h-72 w-full rounded-[20px] border border-[#E5E5E5] bg-white p-20 text-[#111111]" />
            </div>
          )}
          <div className="mt-4">
            <Button
              className="premium-button-secondary w-full px-8 py-4 text-base"
              onClick={() => setWebCamEnabled((prev) => !prev)}
            >
              {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-5xl justify-center md:items-end md:justify-end">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button
            className="premium-button-primary px-8 py-4 text-base"
          >
            Start Interview
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Interview;
