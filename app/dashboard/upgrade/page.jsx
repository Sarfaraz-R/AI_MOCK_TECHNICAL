"use client";
import React from "react";
import PricingPlan from "../_components/PricingPlan";
import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const planHighlights = {
  Monthly: [
    "Full AI mock interview access",
    "Instant answer feedback",
    "Interview history and reports",
    "Flexible monthly billing",
  ],
  Yearly: [
    "Everything in monthly",
    "Best value for consistent practice",
    "Long-term progress tracking",
    "Priority access to new features",
  ],
};

const Upgrade = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-transparent px-5 pb-16 pt-28 text-[#15130f] dark:bg-[#000000] dark:text-[#ffffff] sm:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-[1180px]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#e9e1d2] bg-[#fffefa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6a5f] shadow-[0_10px_30px_rgba(21,19,15,0.04)] dark:border-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]">
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade
          </p>
          <h1 className="text-4xl font-extrabold tracking-normal text-[#15130f] dark:text-[#ffffff] sm:text-5xl">
            Choose the practice plan that keeps you moving.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-[#6f6a5f] dark:text-[#ffffff] sm:text-lg">
            Unlock focused AI interview preparation, detailed feedback, and a cleaner rhythm for getting ready before the real call.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PricingPlan.map((item, index) => (
            <article
              key={index}
              className="group rounded-[22px] border border-[#e9e1d2] bg-[#fffefa] p-6 shadow-[0_18px_60px_rgba(21,19,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d8ccb7] hover:shadow-[0_24px_70px_rgba(21,19,15,0.07)] dark:border-[#ffffff] dark:bg-[#000000] dark:shadow-none sm:p-8"
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#e9e1d2] bg-[#f6f2e8] text-[#15130f] dark:border-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]">
                    <Zap className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#15130f] dark:text-[#ffffff]">
                    {item.duration}
                    <span className="sr-only"> plan</span>
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#6f6a5f] dark:text-[#ffffff]">
                    {item.duration === "Yearly"
                      ? "Built for steady, long-term interview preparation."
                      : "Start practicing with a flexible monthly plan."}
                  </p>
                </div>
                {item.duration === "Yearly" && (
                  <span className="rounded-full border border-[#15130f] bg-[#15130f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#fffefa] dark:border-[#ffffff] dark:bg-[#ffffff] dark:text-[#000000]">
                    Best value
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-[#e9e1d2] bg-[#f6f2e8] p-5 dark:border-[#ffffff] dark:bg-[#000000]">
                <strong className="text-4xl font-extrabold text-[#15130f] dark:text-[#ffffff]">
                  ${item.price}
                </strong>
                <span className="ml-2 text-sm font-semibold text-[#6f6a5f] dark:text-[#ffffff]">
                  / {item.duration}
                </span>
              </div>

              <ul className="mt-8 space-y-4 text-sm font-medium text-[#6f6a5f] dark:text-[#ffffff]">
                {(item.features || planHighlights[item.duration] || []).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#15130f] bg-[#15130f] text-[#fffefa] dark:border-[#ffffff] dark:bg-[#ffffff] dark:text-[#000000]">
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={
                  item.link +
                  "?prefilled_email=" +
                  user?.email
                }
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#15130f] px-5 py-3 text-sm font-semibold text-[#fffefa] transition-all duration-200 hover:bg-[#2a251d] focus:outline-none focus:ring-2 focus:ring-[#15130f] focus:ring-offset-2 dark:bg-[#ffffff] dark:text-[#000000] dark:hover:bg-[#ffffff]/90 dark:focus:ring-[#ffffff] dark:focus:ring-offset-[#000000]"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Upgrade;
