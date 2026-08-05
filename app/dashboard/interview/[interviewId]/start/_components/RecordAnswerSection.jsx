"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Mic, WebcamIcon } from "lucide-react";
import { toast } from "sonner";
import { generateGeminiContent, sendGeminiMessage } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { useAuth } from "@/components/AuthProvider";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast("Error starting recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const base64Audio = await blobToBase64(audioBlob);

      const result = await generateGeminiContent([
        "Transcribe the following audio:",
        { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
      ]);

      const transcription = result.response.text();
      setUserAnswer((prevAnswer) => prevAnswer + " " + transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast("Error transcribing audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (audioBlob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

  const updateUserAnswer = async () => {
    try {
      setLoading(true);
      const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.Question +
        ", User Answer:" +
        userAnswer +
        " , Depends on question and user answer for given interview question" +
        " please give us rating for answer and feedback as area of improvement if any " +
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

      const result = await sendGeminiMessage(feedbackPrompt);

      let MockJsonResp = result.response.text();
      console.log(MockJsonResp);

      // Removing possible extra text around JSON
      MockJsonResp = MockJsonResp.replace("```json", "").replace("```", "");

      // Attempt to parse JSON
      let jsonFeedbackResp;
      try {
        jsonFeedbackResp = JSON.parse(MockJsonResp);
      } catch (e) {
        throw new Error("Invalid JSON response: " + MockJsonResp);
      }

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail: user?.email,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      if (resp) {
        toast("User Answer recorded successfully");
      }
      setUserAnswer("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast("An error occurred while recording the user answer");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden h-full">
      <div className="premium-card mt-4 flex aspect-video w-full max-w-md flex-col items-center justify-center p-5">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            style={{ height: "100%", width: "100%", zIndex: 10, objectFit: 'cover', borderRadius: '0.5rem' }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-[#666666]">
            <WebcamIcon size={64} className="mb-4" />
            <span className="text-lg">Enable Video Web Cam and Microphone to Start</span>
          </div>
        )}
      </div>
      <div className="md:flex mt-4 md:mt-8 md:gap-5 w-full max-w-md">
        <div className="my-4 md:my-0 w-full">
          <Button onClick={() => setWebCamEnabled((prev) => !prev)}
             className="premium-button-secondary w-full px-8 py-4 text-base"
          >
            {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          className={`w-full rounded-xl px-8 py-4 text-base font-semibold transition-all duration-200 ${isRecording ? 'border-[#111111] bg-[#222222] text-white hover:bg-[#111111]' : 'border-[#111111] bg-[#111111] text-white hover:bg-[#222222]'}`}
        >
          {isRecording ? (
            <h2 className="flex gap-2 items-center">
              <Mic size={20} /> Stop Recording...
            </h2>
          ) : (
            <h2 className="flex gap-2 items-center">
              <Mic size={20} /> Record Answer
            </h2>
          )}
        </Button>
      </div>
      {/* Check transcription code */}
      {/* {userAnswer && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold">Transcribed Answer:</h3>
          <p>{userAnswer}</p>
        </div>
      )} */}
    </div>
  );
};

export default RecordAnswerSection;


















// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useContext, useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { WebCamContext } from "@/app/dashboard/layout";

// const RecordAnswerSection = ({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) => {
//   const [userAnswer, setUserAnswer] = useState("");
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });
//   const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

//   useEffect(() => {
//     results.map((result) =>
//       setUserAnswer((prevAns) => prevAns + result?.transcript)
//     );
//   }, [results]);

//   useEffect(() => {
//     if (!isRecording && userAnswer.length > 10) {
//       updateUserAnswer();
//     }
//     // if (userAnswer?.length < 10) {
//     //   setLoading(false);
//     //   toast("Error while saving your answer, Please record again");
//     //   return;
//     // }
//   }, [userAnswer]);

//   const StartStopRecording = async () => {
//     if (isRecording) {
//       stopSpeechToText();
//     } else {
//       startSpeechToText();
//     }
//   };

//   const updateUserAnswer = async () => {
//     try {
//       console.log(userAnswer);
//       setLoading(true);
//       const feedbackPrompt =
//         "Question:" +
//         mockInterviewQuestion[activeQuestionIndex]?.Question +
//         ", User Answer:" +
//         userAnswer +
//         " , Depends on question and user answer for given interview question" +
//         " please give us rating for answer and feedback as area of improvement if any " +
//         "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

//       const result = await chatSession.sendMessage(feedbackPrompt);

//       let MockJsonResp = result.response.text();
//       console.log(MockJsonResp);

//       // Removing possible extra text around JSON
//       MockJsonResp = MockJsonResp.replace("```json", "").replace("```", "");

//       // Attempt to parse JSON
//       let jsonFeedbackResp;
//       try {
//         jsonFeedbackResp = JSON.parse(MockJsonResp);
//       } catch (e) {
//         throw new Error("Invalid JSON response: " + MockJsonResp);
//       }

//       const resp = await db.insert(UserAnswer).values({
//         mockIdRef: interviewData?.mockId,
//         question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//         correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//         userAns: userAnswer,
//         feedback: jsonFeedbackResp?.feedback,
//         rating: jsonFeedbackResp?.rating,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format("YYYY-MM-DD"),
//       });

//       if (resp) {
//         toast("User Answer recorded successfully");
//       }
//       setUserAnswer("");
//       setResults([]);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast("An error occurred while recording the user answer");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center overflow-hidden">
//       <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-[30rem] ">
//         {webCamEnabled ? (
//           <Webcam
//             mirrored={true}
//             style={{ height: 250, width: "100%", zIndex: 10 }}
//           />
//         ) : (
//           <Image src={"/camera.jpg"} width={200} height={200} />
//         )}
//       </div>
//       <div className="md:flex  mt-4 md:mt-8 md:gap-5">
//         <div className="my-4 md:my-0">
//           <Button
//             // className={`${webCamEnabled ? "w-full" : "w-full"}`}
//             onClick={() => setWebCamEnabled((prev) => !prev)}
//           >
//             {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
//           </Button>
//         </div>
//         <Button
//           varient="outline"
//           // className="my-10"
//           onClick={StartStopRecording}
//           disabled={loading}
//         >
//           {isRecording ? (
//             <h2 className="text-red-400 flex gap-2 ">
//               <Mic /> Stop Recording...
//             </h2>
//           ) : (
//             " Record Answer"
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RecordAnswerSection;
