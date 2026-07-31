"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Question } from "@/utils/schema";
import { useRouter } from "next/navigation";

const AddQuestions = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [questionJsonResponse, setQuestionJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(
      "Data",
      jobPosition,
      jobDesc,
      typeQuestion,
      company,
      jobExperience
    );

    const InputPrompt = `
    Job Positions: ${jobPosition},
    Job Description: ${jobDesc},
    Years of Experience: ${jobExperience},
    Which type of question: ${typeQuestion},
    This company previous question: ${company},
    Based on this information, please provide 5 interview questions with answers in JSON format.
    Each question and answer should be fields in the JSON. Ensure "Question" and "Answer" are fields.
}  
  `;
    console.log("InputPrompt:", InputPrompt);

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const MockQuestionJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();
      // console.log("Parsed data", JSON.parse(MockQuestionJsonResp));
      
      console.log("JSON RESPONSE", MockQuestionJsonResp);
      // console.log("Parsed RESPONSE", JSON.parse(MockQuestionJsonResp))

      if (MockQuestionJsonResp) {
        const resp = await db
          .insert(Question)
          .values({
            mockId: uuidv4(),
            MockQuestionJsonResp: MockQuestionJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            typeQuestion: typeQuestion,
            company: company,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("YYYY-MM-DD"),
          })
          .returning({ mockId: Question.mockId });

        console.log("Inserted ID:", resp);

        if (resp) {
          setOpenDialog(false);

          router.push("/dashboard/pyq/" + resp[0]?.mockId);
        }
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error.message);
      alert("There was an error processing the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div
        className="premium-card premium-card-hover flex cursor-pointer flex-col items-center justify-center p-10 text-[#111111]"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-center text-lg font-semibold">+ Add New Questions</h2>
      </div>

      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl rounded-[20px] border-[#E5E5E5] bg-white text-[#111111] shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#111111]">What model questions are you seeking</DialogTitle>
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
                      value={jobPosition}
                      placeholder="Ex. Full stack Developer"
                      required
                      onChange={handleInputChange(setJobPosition)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">
                      Job Description/ Tech stack (In Short)
                    </label>
                    <Textarea
                      className="premium-input"
                      value={jobDesc}
                      placeholder="Ex. React, Angular, Nodejs, Mysql, Nosql, Python"
                      required
                      onChange={handleInputChange(setJobDesc)}
                      rows="4"
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">
                      Type of Questions (In Short)
                    </label>
                    <Input
                      className="premium-input"
                      value={typeQuestion}
                      placeholder="Ex. CPP, Leetcode, Domain based"
                      required
                      onChange={handleInputChange(setTypeQuestion)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">
                      Company are you seeking
                    </label>
                    <Input
                      className="premium-input mt-1"
                      value={company}
                      placeholder="Ex. Microsoft, Apple, Google, Mercedes"
                      required
                      onChange={handleInputChange(setCompany)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="mb-1 block text-sm font-medium text-[#111111]">Years of Experience</label>
                    <Input
                      className="premium-input mt-1"
                      placeholder="Ex. 5"
                      value={jobExperience}
                      max="50"
                      type="number"
                      required
                      onChange={handleInputChange(setJobExperience)}
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

export default AddQuestions;
