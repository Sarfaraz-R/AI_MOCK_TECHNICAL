'use client'

import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  AudioLines,
  BarChart3,
  Brain,
  Code2,
  FileText,
  History,
  ListChecks,
  MessageSquare,
  Sparkles,
  UploadCloud,
  UserRound,
  Wand2,
  Star,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the Contect component
const Contect = dynamic(() => import('./_components/Contect'), { ssr: false });

const featureItems = [
  {
    title: "AI-Powered Interviews",
    description: "Experience realistic coding, technical, HR, and behavioral interviews powered by AI that adapts to your responses in real time.",
    icon: Brain,
    visual: "interview",
  },
  {
    title: "Instant Feedback",
    description: "Receive detailed AI-generated feedback immediately after every interview, including accuracy, communication, confidence, and suggestions.",
    icon: MessageSquare,
    visual: "feedback",
  },
  {
    title: "AI Question Generator",
    description: "Generate unlimited interview questions based on company, role, difficulty, technology, or experience level.",
    icon: Wand2,
    visual: "questions",
  },
  {
    title: "Interview History",
    description: "Access previous interviews, recordings, transcripts, feedback reports, and performance history from one dashboard.",
    icon: History,
    visual: "history",
  },
  {
    title: "Performance Analytics",
    description: "Track interview scores, strengths, weaknesses, confidence trends, and overall progress through interactive analytics.",
    icon: BarChart3,
    visual: "analytics",
    upcoming: true,
  },
  {
    title: "Interview Transcript & AI Analysis",
    description: "Generate transcripts with highlighted mistakes, AI explanations, key insights, filler word detection, and personalized recommendations.",
    icon: FileText,
    visual: "transcript",
    wide: true,
    upcoming: true,
  },
  {
    title: "Resume & ATS Analysis",
    description: "Upload your resume to receive ATS scores, keyword suggestions, recruiter insights, and resume improvement recommendations.",
    icon: UploadCloud,
    visual: "resume",
    upcoming: true,
  },
  {
    title: "Coding Assessment",
    description: "Solve coding problems with an integrated code editor, real-time execution, hidden test cases, AI code review, and complexity analysis.",
    icon: Code2,
    visual: "code",
    upcoming: true,
  },
  {
    title: "Voice-Based AI Interviews",
    description: "Have natural conversations with an AI interviewer using realistic voice interactions for an authentic interview experience.",
    icon: AudioLines,
    visual: "voice",
    wide: true,
    upcoming: true,
  },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Frontend Engineer, Razorpay",
    initials: "AM",
    quote: "Scribo made my practice feel structured. The AI follow-up questions were close to what I faced in real interviews.",
  },
  {
    name: "Nisha Rao",
    role: "SDE Intern, Amazon",
    initials: "NR",
    quote: "The instant feedback helped me fix rambling answers and explain tradeoffs with much more confidence.",
  },
  {
    name: "Kabir Khan",
    role: "Backend Developer, Zoho",
    initials: "KK",
    quote: "I used the question generator every night. It gave me a clear rhythm and exposed weak spots quickly.",
  },
  {
    name: "Meera Iyer",
    role: "Product Analyst, Flipkart",
    initials: "MI",
    quote: "The mock interviews reduced my anxiety. It felt like a calm rehearsal before the actual panel round.",
  },
  {
    name: "Rohan Shah",
    role: "Full Stack Engineer, Freshworks",
    initials: "RS",
    quote: "The feedback reports were direct and useful. I knew exactly which answers needed sharper examples.",
  },
  {
    name: "Anika Bose",
    role: "CS Student, VIT",
    initials: "AB",
    quote: "Scribo helped me turn scattered preparation into a repeatable workflow I could trust before placements.",
  },
  {
    name: "Dev Patel",
    role: "Software Engineer, TCS",
    initials: "DP",
    quote: "The interview history made progress visible. I could compare sessions and see my confidence improving.",
  },
  {
    name: "Sara Thomas",
    role: "QA Engineer, Microsoft",
    initials: "ST",
    quote: "The questions felt tailored, not generic. It pushed me to explain fundamentals in a cleaner way.",
  },
];

const TestimonialCard = ({ testimonial, ariaHidden = false }) => (
  <article className="testimonial-card" aria-label={`Testimonial from ${testimonial.name}`} aria-hidden={ariaHidden}>
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EAEAEA] bg-[#F8F8F8] text-sm font-bold text-[#111111]">
        {testimonial.initials}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold tracking-normal text-[#111111]">{testimonial.name}</h3>
        <p className="truncate text-xs font-medium text-[#666666]">{testimonial.role}</p>
      </div>
    </div>
    <div className="mb-4 flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-[#111111] text-[#111111]" strokeWidth={1.5} />
      ))}
    </div>
    <p className="text-sm leading-6 text-[#666666]">"{testimonial.quote}"</p>
  </article>
);

const TestimonialRow = ({ items, reverse = false, className = "" }) => {
  const loopedItems = [...items, ...items];

  return (
    <div className={`testimonial-row ${className}`}>
      <div className={`testimonial-track ${reverse ? "testimonial-track-reverse" : ""}`}>
        {loopedItems.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
            ariaHidden={index >= items.length}
          />
        ))}
      </div>
    </div>
  );
};

const FeatureVisual = ({ type, Icon }) => {
  const baseIcon = <Icon className="h-5 w-5 text-[#111111]" strokeWidth={1.7} />;

  if (type === "transcript") {
    return (
      <div className="relative h-32 overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white p-4">
        <div className="space-y-2 text-[11px] leading-4 text-[#666666]">
          <div className="h-2.5 w-1/3 rounded-full bg-[#F5F5F5]" />
          <p><span className="rounded bg-[#F5F5F5] px-1 text-[#111111]">Interviewer</span> Explain your approach to system design.</p>
          <p><span className="rounded bg-[#F5F5F5] px-1 text-[#111111]">Candidate</span> I would start with requirements, then discuss scaling.</p>
          <p className="border-l-2 border-[#111111] pl-3 text-[#111111]">AI note: Strong structure. Add tradeoffs and failure handling.</p>
          <div className="grid grid-cols-3 gap-2">
            <span className="h-1.5 rounded-full bg-[#111111]" />
            <span className="h-1.5 rounded-full bg-[#EAEAEA]" />
            <span className="h-1.5 rounded-full bg-[#EAEAEA]" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "analytics" || type === "progress") {
    return (
      <div className="flex h-28 items-end gap-2.5 rounded-2xl border border-[#EAEAEA] bg-white p-4">
        {[54, 76, 46, 88, 68].map((height, index) => (
          <div key={height + index} className="flex flex-1 items-end rounded-full bg-[#F5F5F5]">
            <span className="w-full rounded-full bg-[#111111]" style={{ height: `${height}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === "code") {
    return (
      <div className="h-28 rounded-2xl border border-[#EAEAEA] bg-white p-4 font-mono text-[11px] leading-5 text-[#666666]">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#111111]" />
          <span className="h-2 w-2 rounded-full bg-[#EAEAEA]" />
          <span className="h-2 w-2 rounded-full bg-[#EAEAEA]" />
        </div>
        <p><span className="text-[#111111]">function</span> solve(input) {"{"}</p>
        <p className="pl-4">return ai.review(input)</p>
        <p>{"}"}</p>
      </div>
    );
  }

  if (type === "voice") {
    return (
      <div className="flex h-28 items-center justify-center gap-2 rounded-2xl border border-[#EAEAEA] bg-white p-4">
        {[24, 44, 68, 94, 64, 42, 28].map((height, index) => (
          <span key={height + index} className="w-2 rounded-full bg-[#111111]" style={{ height }} />
        ))}
      </div>
    );
  }

  if (type === "companies") {
    return (
      <div className="grid h-28 grid-cols-4 gap-2 rounded-2xl border border-[#EAEAEA] bg-white p-4">
        {["G", "A", "M", "Meta", "ATL", "AD", "JPM", "+"].map((company) => (
          <span key={company} className="flex items-center justify-center rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] text-xs font-semibold text-[#111111]">
            {company}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white p-4">
      <div className="absolute inset-0 bg-[linear-gradient(#F5F5F5_1px,transparent_1px),linear-gradient(90deg,#F5F5F5_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#EAEAEA] bg-white shadow-[0_14px_28px_rgba(17,17,17,0.07)]">
        {baseIcon}
      </div>
      <div className="absolute left-4 top-4 rounded-xl border border-[#EAEAEA] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#666666]">AI</div>
      <div className="absolute bottom-4 right-4 rounded-xl border border-[#EAEAEA] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#666666]">Live</div>
    </div>
  );
};

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: Math.min(index * 0.04, 0.28), duration: 0.35 }}
      className={`group rounded-[22px] border border-[#EAEAEA] bg-white p-4 shadow-[0_14px_40px_rgba(17,17,17,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8D8D8] hover:shadow-[0_20px_56px_rgba(17,17,17,0.07)] sm:p-5 ${feature.wide ? "sm:col-span-2 lg:col-span-2" : ""}`}
    >
      <FeatureVisual type={feature.visual} Icon={Icon} />
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] text-[#111111]">
            <Icon className="h-4 w-4" strokeWidth={1.7} />
          </div>
          {feature.upcoming && (
            <span className="rounded-full border border-[#EAEAEA] bg-[#FAFAFA] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#666666]">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-bold tracking-normal text-[#111111]">{feature.title}</h3>
        <p className="text-sm leading-5 text-[#666666]">{feature.description}</p>
      </div>
    </motion.article>
  );
};

const page = () => {
  return (
    <div className="premium-shell">
      <Head>
        <title>Scribo</title>
        <meta name="description" content="Ace your next interview with Scribo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <header className="fixed top-0 z-50 w-full px-4 py-4">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="brand-logo text-4xl text-[#111111] sm:text-5xl"
            >
              Scribo
            </motion.h1>
            <nav className="hidden items-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1 text-sm font-medium md:flex">
              <div className="flex items-center">
                <a href="#features" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">Features</a>
                <a href="#testimonials" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">Testimonials</a>
                <a href="#contact" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">Contact</a>
              </div>
            </nav>
            <Link href="/dashboard" className="premium-button-primary py-2.5">
              Dashboard
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36">
          <div className="premium-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-5xl text-center"
            >
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#666666]">AI interview practice</p>
              <h2 className="mb-6 text-5xl font-extrabold tracking-tight text-[#111111] sm:text-6xl md:text-7xl">
                Master every interview with quiet confidence.
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-[#666666] sm:text-xl">
                Practice realistic interviews, receive precise feedback, and build a repeatable preparation workflow in a clean AI workspace.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="premium-button-primary group px-5 py-3 text-sm"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#features"
                  className="premium-button-secondary px-5 py-3 text-sm"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#666666]">How practice flows</p>
                <div className="hidden h-px flex-1 bg-[#E5E5E5] sm:block" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: <UserRound className="h-5 w-5" />,
                    title: "Role profile",
                    description: "Add the role, stack, and experience level so each session matches your target job.",
                    progress: "55%",
                  },
                  {
                    icon: <ListChecks className="h-5 w-5" />,
                    title: "AI questions",
                    description: "Practice focused questions that adapt to the details you provide.",
                    progress: "72%",
                  },
                  {
                    icon: <Sparkles className="h-5 w-5" />,
                    title: "Feedback loop",
                    description: "Review answers, polish weak spots, and build confidence before the real call.",
                    progress: "88%",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    className="premium-card premium-card-hover p-6"
                  >
                    <div className="mb-7 flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] text-[#111111]">
                        {item.icon}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#888888]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#111111]">{item.title}</h3>
                    <p className="min-h-[72px] text-sm leading-6 text-[#666666]">{item.description}</p>
                    <div className="mt-6 h-1.5 w-full rounded-full bg-[#F5F5F5]">
                      <div className="h-1.5 rounded-full bg-[#111111]" style={{ width: item.progress }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-white py-16 sm:py-20"
          style={{
            backgroundImage:
              "linear-gradient(#F5F5F5 1px, transparent 1px), linear-gradient(90deg, #F5F5F5 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          <div className="premium-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-10 max-w-4xl text-center"
            >
              <p className="mx-auto mb-5 inline-flex rounded-full border border-[#EAEAEA] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#666666] shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
                AI-Powered Features
              </p>
              <h2 className="mx-auto mb-5 max-w-3xl text-4xl font-extrabold tracking-normal text-[#111111] sm:text-5xl">
                Everything You Need to Crack Your Next Interview
              </h2>
              <p className="mx-auto max-w-3xl text-base font-medium leading-7 text-[#666666] sm:text-lg">
                Practice with intelligent AI interviewers, receive instant personalized feedback, analyze your performance, and prepare confidently for top tech companies—all in one platform.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featureItems.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="overflow-hidden py-16 sm:py-20">
          <div className="premium-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-12 max-w-3xl text-center"
            >
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">Success Stories</h2>
              <p className="text-lg font-medium text-[#666666]">
                See how learners use Scribo to practice consistently, improve faster, and walk into interviews with calmer confidence.
              </p>
            </motion.div>
          </div>
          <div className="testimonial-wall" aria-hidden="true">
            <TestimonialRow items={testimonials} />
            <TestimonialRow items={[...testimonials].reverse()} reverse className="testimonial-row-secondary" />
          </div>
          <div className="sr-only">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name}>
                {testimonial.quote} - {testimonial.name}, {testimonial.role}
              </blockquote>
            ))}
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-20">
          <div className="premium-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-8 max-w-3xl text-center"
            >
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">Get in Touch</h2>
              <p className="text-lg font-medium text-[#666666]">
                Have questions? We'd love to hear from you
              </p>
            </motion.div>
            <Contect />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E5E5E5] py-8 text-center">
        <p className="text-sm text-[#666666]">© 2025 Scribo. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default page
