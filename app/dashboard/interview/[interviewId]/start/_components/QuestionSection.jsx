import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech.");
    }
  };
  return (
    mockInterviewQuestion && (
      <div className="premium-card flex h-full flex-col justify-between p-6 text-[#111111]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => (
              <h2
                key={index}
                className={`cursor-pointer rounded-full border p-2 text-center text-xs transition-colors duration-200 md:text-sm ${
                  activeQuestionIndex == index
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#E5E5E5] bg-white text-[#666666] hover:bg-[#F5F5F5]"
                }`}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-xl font-semibold text-[#111111] md:text-2xl">
          {mockInterviewQuestion[activeQuestionIndex]?.Question}
        </h2>
        <Volume2
          className="cursor-pointer text-[#666666] transition-colors duration-200 hover:text-[#111111]"
          size={24}
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)
          }
        />
        <div className="mt-8 rounded-[20px] border border-[#E5E5E5] bg-[#F8F8F8] p-5">
          <h2 className="mb-3 flex items-center gap-2 text-[#111111]">
            <Lightbulb size={20} className="text-[#111111]" />
            <strong className="font-semibold">Note:</strong>
          </h2>
          <h2 className="text-sm leading-6 text-[#666666]">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
