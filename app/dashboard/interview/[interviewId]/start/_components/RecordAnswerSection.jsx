"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { AlertTriangle, Mic, RotateCcw, WebcamIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generateGeminiContentWithConfig } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { useAuth } from "@/components/AuthProvider";

const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onAnswerSaved,
  onBusyStateChange,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const { user } = useAuth();
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const activeProcessingQuestionRef = useRef(activeQuestionIndex);

  useEffect(() => {
    setUserAnswer("");
    setElapsedSeconds(0);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl("");
    setIsRecording(false);
    onBusyStateChange(false);
  }, [activeQuestionIndex]);

  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = window.setInterval(() => {
        setElapsedSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    activeProcessingQuestionRef.current = activeQuestionIndex;
  }, [activeQuestionIndex]);

  const studioStatus = useMemo(() => {
    if (!webCamEnabled) return "Camera off";
    if (loading) return "Saving answer...";
    if (isRecording) return "Recording...";
    if (recordedAudioUrl) return "Review your answer";
    return "Ready to record";
  }, [webCamEnabled, loading, isRecording, recordedAudioUrl]);

  const enableCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setWebCamEnabled(true);
      toast("Camera and microphone are ready.");
    } catch (error) {
      console.error("Error enabling camera and mic:", error);
      toast("Please allow camera and microphone permissions to continue.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      setElapsedSeconds(0);
      onBusyStateChange(true);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        await processAudioAnswer(audioBlob, activeProcessingQuestionRef.current);
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      onBusyStateChange(false);
      toast("Error starting recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRerecord = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl("");
    setUserAnswer("");
    setElapsedSeconds(0);
    onBusyStateChange(false);
  };

  const processAudioAnswer = async (audioBlob, questionIndex) => {
    try {
      setLoading(true);
      const base64Audio = await blobToBase64(audioBlob);
      const result = await generateGeminiContentWithConfig([
        {
          text:
            `You are evaluating a mock interview response. ` +
            `First transcribe the audio exactly and store it in "transcript". ` +
            `Then rate the answer from 1 to 10 in "rating". ` +
            `Then write concise actionable feedback in 2 to 4 short sentences in "feedback". ` +
            `Return strict JSON only with keys: transcript, rating, feedback. ` +
            `Question: ${mockInterviewQuestion[questionIndex]?.Question || ""} ` +
            `Reference answer: ${mockInterviewQuestion[questionIndex]?.Answer || ""}`,
        },
        { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
      ], {
        maxOutputTokens: 700,
        responseMimeType: "application/json",
      });

      const rawResponse = result.response.text();
      const parsedResponse = parseJsonResponse(rawResponse);
      const transcript = (parsedResponse?.transcript || "").trim();

      if (transcript.length < 5) {
        throw new Error("Transcript too short or empty.");
      }

      setUserAnswer(transcript);
      await saveUserAnswer({
        questionIndex,
        transcript,
        feedback: parsedResponse?.feedback || "Feedback could not be generated.",
        rating: String(parsedResponse?.rating || "5"),
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      setLoading(false);
      onBusyStateChange(false);
      toast("Audio processing was slow or failed. Please try again.");
    }
  };

  const blobToBase64 = (audioBlob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

  const parseJsonResponse = (value) => {
    const cleaned = value.replace("```json", "").replace("```", "").trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error("Invalid JSON response: " + cleaned);
    }
  };

  const saveUserAnswer = async ({ questionIndex, transcript, feedback, rating }) => {
    try {
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[questionIndex]?.Question,
        correctAns: mockInterviewQuestion[questionIndex]?.Answer,
        userAns: transcript,
        feedback,
        rating,
        userEmail: user?.email,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      if (resp) {
        onAnswerSaved(questionIndex);
        toast("User answer recorded successfully.");
      }
      setLoading(false);
      onBusyStateChange(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      onBusyStateChange(false);
      toast("An error occurred while recording the user answer.");
    }
  };

  return (
    <div className="flex h-full flex-col px-4 py-5 text-[#f5f5f5] md:px-6 md:py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">
            Response Studio
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#f5f5f5] md:text-xl">
            Record your answer
          </h3>
        </div>
        <div
          className={`rounded-full px-3 py-2 text-xs font-semibold ${
            webCamEnabled ? "bg-[#1f3a28] text-[#d8f3df]" : "bg-[#3a1f1f] text-[#f5caca]"
          }`}
        >
          {webCamEnabled ? "Camera On" : "Camera Off"}
        </div>
      </div>

      {!webCamEnabled ? (
        <div className="mb-4 flex items-start gap-3 rounded-[18px] border border-[#4a2b2b] bg-[#221616] px-4 py-4 text-sm leading-6 text-[#f0c7c7]">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Webcam is currently off. Enable your webcam before recording so the interview can continue in a proper live-interview setup.
          </p>
        </div>
      ) : null}

      <div className="mx-auto mt-1 flex aspect-video w-full max-w-[280px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#2f2f2f] bg-[#202020] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)] md:max-w-[300px]">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            style={{
              height: "100%",
              width: "100%",
              zIndex: 10,
              objectFit: "cover",
              borderRadius: "1rem",
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[18px] border border-[#3a3a3a] bg-[#171717] text-[#c4c4c4]">
            <WebcamIcon size={52} className="mb-4" />
            <span className="max-w-[220px] text-center text-sm leading-6">
              Enable Video Web Cam and Microphone to Start
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-[18px] border border-[#2f2f2f] bg-[#1b1b1b] px-3 py-2.5">
        <p className="text-xs font-semibold text-[#f5f5f5]">{studioStatus}</p>
        {(isRecording || recordedAudioUrl || loading) && (
          <p className="mt-1 text-[11px] text-[#c4c4c4]">
            {isRecording ? formatTime(elapsedSeconds) : loading ? "Processing response..." : "Audio ready"}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2.5">
        <Button
          onClick={enableCameraAndMic}
          className="premium-button-secondary w-full px-4 py-2 text-[10px] md:text-[10px]"
        >
          {webCamEnabled ? "Camera & Mic Enabled" : "Enable Camera & Mic"}
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading || !webCamEnabled}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isRecording
                ? "bg-[#dc2626] text-white shadow-[0_0_0_12px_rgba(220,38,38,0.16)]"
                : "bg-[#000000] text-white"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isRecording ? (
              <span className="h-3 w-3 animate-pulse rounded-sm bg-white" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          <Button
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading || !webCamEnabled}
            className="premium-button-primary px-3.5 py-1.5 text-[10px] md:text-[10px]"
          >
            {isRecording ? "Stop" : "Record Answer"}
          </Button>

          <Button
            onClick={handleRerecord}
            disabled={isRecording || (!recordedAudioUrl && !userAnswer)}
            className="premium-button-primary px-3.5 py-1.5 text-[10px] md:text-[10px]"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Re-record
          </Button>
        </div>
      </div>

      {recordedAudioUrl ? (
        <div className="mt-5 rounded-[18px] border border-[#2f2f2f] bg-[#1b1b1b] p-4">
          <audio controls src={recordedAudioUrl} className="w-full" />
        </div>
      ) : null}
    </div>
  );
};

export default RecordAnswerSection;
