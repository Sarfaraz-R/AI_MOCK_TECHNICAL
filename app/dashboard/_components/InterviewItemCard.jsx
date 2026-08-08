import React from 'react'
import { Button } from "@/components/ui/button";
import { History, MessageSquareText, Play } from "lucide-react";
import { useRouter } from 'next/navigation';

const InterviewItemCard = ({interview}) => {

    const router = useRouter()
    const onStart = ()=>{
        router.push("/dashboard/interview/"+interview?.mockId)
    }
    const onFeedback = ()=>{
        router.push("/dashboard/interview/"+interview?.mockId+"/feedback")
    }
  return (
    <div className="interview-hover-shell group">
      <div className="interview-hover-panel interview-hover-panel-top premium-card p-4">
        <Button
          onClick={onFeedback}
          size="sm"
          className="premium-button-secondary h-full w-full justify-between rounded-full px-5"
        >
          <span>Feedback</span>
          <MessageSquareText className="h-4 w-4" />
        </Button>
      </div>

      <div className="interview-hover-main premium-card premium-card-hover p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className='mb-2 text-xl font-bold tracking-tight text-[#111111] transition-colors duration-300 group-hover:text-[#123524]' >{interview?.jobPosition}</h2>
            <h2 className='mb-3 text-sm font-medium text-[#666666] transition-colors duration-300 group-hover:text-[#355845]' >{interview?.jobExperience} Years of Experience</h2>
          </div>
          <div className="interview-hover-badge">
            <History className="h-4 w-4" />
          </div>
        </div>

        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#888888] transition-colors duration-300 group-hover:text-[#4c6f5d]" >Created At: {interview.createdAt}</h2>

        <div className="interview-hover-meta">
          <span>Previous mock interview</span>
          <span>Ready to revisit</span>
        </div>
      </div>

      <div className="interview-hover-panel interview-hover-panel-bottom premium-card p-4">
        <Button
          onClick={onStart}
          size="sm"
          className="premium-button-primary h-full w-full justify-between rounded-full px-5"
        >
          <span>Start</span>
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
