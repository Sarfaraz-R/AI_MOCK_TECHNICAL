"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendGeminiMessage } from "@/utils/GeminiAIModal";
import { LoaderCircle, MessageSquarePlus } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

const AddNewInterview = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `
  Job Positions: ${jobPosition}, 
  Job Description: ${jobDesc}, 
  Years of Experience: ${jobExperience}. 
  Based on this information, please provide 5 interview questions with answers in JSON format, ensuring "Question" and "Answer" are fields in the JSON.
`;

    try {
      const result = await sendGeminiMessage(InputPrompt);
      const MockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      JSON.parse(MockJsonResp);
      setJsonResponse(MockJsonResp);

      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.email,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: MockInterview.mockId });
        
      console.log("Inserted ID:", resp);

      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast("AI is busy right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="premium-card flex min-h-[265px] flex-col justify-between p-7 text-[#111111]"
      >
        <div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#bbf7d0] bg-[#dcfce7] text-[#166534]">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <h2 className="mt-8 text-xl font-bold tracking-tight text-[#111111]">Start Mock Interview</h2>
          <p className="mt-3 max-w-md text-base font-medium leading-7 text-[#666666]">
            Generate a tailored AI interview for your role and experience.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenDialog(true)}
          className="premium-button-primary mt-8 h-12 w-full"
        >
          Start
        </button>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-[20px] border-[#E5E5E5] bg-white text-[#111111] shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#111111]">
              Tell us more about your job interviwing
            </DialogTitle>
            <DialogDescription className="text-[#666666]">
              <form onSubmit={onSubmit}>
                <div className="my-4">
                  <h2 className="mb-4 text-[#111111]">
                    Add Details about your job position, job descritpion and
                    years of experience
                  </h2>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">Job Role/job Position</label>
                    <Input
                      className="premium-input mt-1"
                      placeholder="Ex. Full stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">
                      Job Description/ Tech stack (In Short)
                    </label>
                    <Textarea
                      className="premium-input"
                      placeholder="Ex. React, Angular, Nodejs, Mysql, Nosql, Python"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                      rows="4"
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">Years of Experience</label>
                    <Input
                      className="premium-input mt-1"
                      placeholder="Ex. 5"
                      max="50"
                      type="number"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4 justify-end mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                    className="premium-button-secondary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}
                    className="premium-button-primary px-8 py-4 text-base"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating From AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
