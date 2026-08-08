import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Brain, CheckCircle2, ListChecks, MessageSquare, Sparkles } from "lucide-react";

const steps = [
  {
    value: "item-1",
    icon: ListChecks,
    title: "Step 1: Prepare for the Interview",
    description:
      "Choose the interview type, add the role details, and give Scribo enough context to shape a focused practice session.",
    progress: "55%",
    accent: {
      border: "border-[#294f70]",
      bg: "bg-[#102234]",
      text: "text-[#8fc7ff]",
      soft: "bg-[#eaf4ff]",
      softText: "text-[#31567a]",
      bar: "bg-[#5ea8ff]",
    },
  },
  {
    value: "item-2",
    icon: Brain,
    title: "Step 2: Start the AI Interview",
    description:
      "Answer realistic questions in a calm workspace while the AI evaluates clarity, relevance, confidence, and structure.",
    progress: "72%",
    accent: {
      border: "border-[#5a4a19]",
      bg: "bg-[#2d240c]",
      text: "text-[#f6d36d]",
      soft: "bg-[#fff6df]",
      softText: "text-[#6f5710]",
      bar: "bg-[#f0bd43]",
    },
  },
  {
    value: "item-3",
    icon: MessageSquare,
    title: "Step 3: Receive Feedback",
    description:
      "Review detailed feedback, spot weak areas, and use the next session to make your answers sharper and more confident.",
    progress: "88%",
    accent: {
      border: "border-[#2e4232]",
      bg: "bg-[#132318]",
      text: "text-[#8ce3a5]",
      soft: "bg-[#eaf9ef]",
      softText: "text-[#2f6a42]",
      bar: "bg-[#53cc79]",
    },
  },
];

const HowItWorks = () => {
  return (
    <>
      <Head>
        <title>How It Works - Scribo</title>
        <meta
          name="description"
          content="Learn how Scribo works."
        />
      </Head>
      <main className="min-h-screen bg-transparent px-5 pb-16 pt-28 text-[#15130f] dark:bg-[#000000] dark:text-[#ffffff] sm:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#e9e1d2] bg-[#fffefa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6a5f] shadow-[0_10px_30px_rgba(21,19,15,0.04)] dark:border-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]">
              <Sparkles className="h-3.5 w-3.5" />
              How practice flows
            </p>
            <h1 className="text-4xl font-extrabold tracking-normal text-[#15130f] dark:text-[#ffffff] sm:text-5xl">
              From setup to feedback in three focused steps.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-[#6f6a5f] dark:text-[#ffffff] sm:text-lg">
              Scribo keeps the interview workflow simple: set the context, practice with AI, then use precise feedback to improve the next attempt.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.value}
                  className="rounded-[22px] border border-[#e9e1d2] bg-[#fffefa] p-6 shadow-[0_18px_60px_rgba(21,19,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d8ccb7] hover:shadow-[0_24px_70px_rgba(21,19,15,0.07)] dark:border-[#ffffff] dark:bg-[#000000] dark:shadow-none"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${step.accent.border} ${step.accent.bg} ${step.accent.text} dark:border-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]`}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${step.accent.soft} ${step.accent.softText} dark:bg-[#111111] dark:text-[#ffffff]`}>
                      0{index + 1}
                    </span>
                  </div>
                  <h2 className="mb-2 text-lg font-bold text-[#15130f] dark:text-[#ffffff]">
                    {step.title.replace(`Step ${index + 1}: `, "")}
                  </h2>
                  <p className="min-h-[96px] text-sm font-medium leading-6 text-[#6f6a5f] dark:text-[#ffffff]">
                    {step.description}
                  </p>
                  <div className="mt-6 h-1.5 w-full rounded-full bg-[#f6f2e8] dark:bg-[#1a1a1a]">
                    <div className={`h-1.5 rounded-full ${step.accent.bar} dark:bg-[#ffffff]`} style={{ width: step.progress }} />
                  </div>
                </article>
              );
            })}
          </div>

          <Accordion type="single" collapsible className="mt-12 w-full rounded-[22px] border border-[#e9e1d2] bg-[#fffefa] p-4 shadow-[0_18px_60px_rgba(21,19,15,0.04)] dark:border-[#ffffff] dark:bg-[#000000] dark:shadow-none sm:p-6">
            {steps.map((step) => (
              <AccordionItem key={step.value} value={step.value} className="border-[#e9e1d2] last:border-b-0 dark:border-[#ffffff]">
                <AccordionTrigger className="gap-4 text-left text-base font-bold text-[#15130f] hover:no-underline dark:text-[#ffffff] sm:text-lg">
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${step.accent.text}`} strokeWidth={1.8} />
                    {step.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className={`rounded-2xl ${step.accent.soft} p-4 text-sm font-medium leading-6 text-[#6f6a5f] dark:bg-[#111111] dark:text-[#ffffff]`}>
                  <p>{step.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </>
  );
};

export default HowItWorks;
