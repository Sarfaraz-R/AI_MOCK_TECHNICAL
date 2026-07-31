import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const QuestionItemCard = ({ question }) => {
  const router = useRouter();
  const onStart = () => {
    router.push("/dashboard/pyq/" + question?.mockId);
  };
  return (
    <div className="premium-card premium-card-hover cursor-pointer p-6">
      <h2 className='mb-2 text-xl font-bold tracking-tight text-[#111111]' >{question?.jobPosition}</h2>
      <h2 className='mb-3 text-sm font-medium text-[#666666]' >
        {question?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#888888]">Created At: {question.createdAt}</h2>

      <div className="mt-6 flex justify-between gap-4">
        <Button onClick={onStart} size="sm" className="premium-button-primary w-full">
          Start
        </Button>
      </div>
    </div>
  );
};

export default QuestionItemCard;
