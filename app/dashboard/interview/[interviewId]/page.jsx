"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Camera,
  CheckCircle2,
  MessageSquareQuote,
  ShieldCheck,
  WebcamIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { useContext } from "react";
import { WebCamContext } from "../../layout";
import { useRouter } from "next/navigation";

const Interview = ({ params }) => {
  const router = useRouter();
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const [interviewData, setInterviewData] = useState();

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
  };

  const enableInterviewWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setWebCamEnabled(true);
    } catch (error) {
      console.error("Error enabling webcam:", error);
      setWebCamEnabled(false);
    }
  };

  return (
    <div className="premium-shell relative overflow-hidden bg-[#0f0f0f] pt-32 pb-24">
      <div className="absolute inset-0 bg-[#0f0f0f]/92" />
      <div className="premium-container relative z-10">
        <div className="mx-auto mb-11 max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#c6bfb0]">
            Interview Briefing
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#f5f1e8] md:text-4xl">
            Let&apos;s Get Started
          </h2>
          <div className="mx-auto mb-4 mt-1 h-3 w-[430px] max-w-[82%]">
            <svg
              viewBox="0 0 430 20"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 15C112 5 212 3 422 9"
                stroke="#78A8FF"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-7 text-[#d6d0c3] md:text-base">
            Treat this like a real interview round. Settle in, test your setup, and
            answer clearly as if you were speaking to an interviewer live.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[#0f0f0f] p-0 text-[#f5f1e8] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 md:p-8">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2e4232] bg-[#132318] text-[#8ce3a5]">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Interview Context
                    </p>
                    <h3 className="text-xl font-bold text-[#f7f3ea]">
                      Your prompt for this round
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Job Role / Position
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#f7f3ea]">
                      {interviewData?.jobPosition}
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Job Description / Stack
                    </p>
                    <p className="mt-2 text-base leading-7 text-[#ddd7ca]">
                      {interviewData?.jobDesc}
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Experience Level
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#f7f3ea]">
                      {interviewData?.jobExperience} years
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Interview Instructions
                    </p>
                    <div className="mt-3 space-y-3">
                      {[
                        "Answer like you are in a live round. Speak in full sentences and explain your reasoning clearly.",
                        "Use a simple structure: idea first, then approach, tradeoffs, and a short example when useful.",
                        "Think aloud if you need time. Clear reasoning is better than a rushed answer.",
                        "Keep your microphone and camera ready. Your responses will be recorded for feedback.",
                        process.env.NEXT_PUBLIC_INFORMATION ||
                          "Stay in a quiet place and make sure your face is clearly visible before you begin.",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ce3a5]" />
                          <p className="text-sm leading-6 text-[#d8d2c5]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[#131313] p-7 md:border-l md:border-t-0 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                    Device Check
                  </p>
                  <h3 className="text-xl font-bold text-[#f7f3ea]">
                    Camera and mic setup
                  </h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2d4052] bg-[#121d27] text-[#9fd2ff]">
                  <Camera className="h-5 w-5" />
                </div>
              </div>
              {webCamEnabled ? (
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-center rounded-[20px] bg-black/20 p-2">
                    <Webcam
                      onUserMedia={() => setWebCamEnabled(true)}
                      onUserMediaError={() => setWebCamEnabled(false)}
                      height={300}
                      width={300}
                      mirrored={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-[24px] border border-white/10 bg-black/25 p-4">
                  <WebcamIcon className="h-72 w-full rounded-[20px] border border-white/10 bg-[#171717] p-20 text-[#d8d2c5]" />
                </div>
              )}
              <div className="mt-4">
                <Button
                  className="premium-button-secondary w-full px-4 py-2 text-[10px]"
                  disabled={webCamEnabled}
                  onClick={enableInterviewWebcam}
                >
                  {webCamEnabled ? "WebCam Enabled" : "Enable WebCam"}
                </Button>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#4f431f] bg-[#2c250f] text-[#f4cb67]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a294]">
                      Final Prompt
                    </p>
                    <h3 className="text-lg font-bold text-[#f7f3ea]">
                      Join when you are ready
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-7 text-[#d8d2c5]">
                  Once you begin, answer each question as if you are speaking to a
                  recruiter or hiring manager. Stay calm, structured, and confident.
                </p>
                {!webCamEnabled ? (
                  <div className="mt-5 rounded-2xl border border-[#5a4a19] bg-[#2a2417] px-4 py-3 text-sm leading-6 text-[#f3ddb0]">
                    Enable your webcam before starting the interview. This helps simulate a real interview setup and keeps response recording ready from the first question.
                  </div>
                ) : null}
                <div className="mt-5">
                  <Button
                    className="premium-button-primary w-full px-4 py-2 text-[10px]"
                    disabled={!webCamEnabled}
                    onClick={() => {
                      if (webCamEnabled) {
                        router.push("/dashboard/interview/" + params.interviewId + "/start");
                      }
                    }}
                  >
                    Start Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
