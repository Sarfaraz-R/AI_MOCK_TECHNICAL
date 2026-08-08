"use client";

import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PricingPlan from "../_components/PricingPlan";
import { useAuth } from "@/components/AuthProvider";

const MONTHLY_FEATURES = [
  "Full AI mock interview access",
  "Instant answer feedback",
  "Interview history and reports",
  "Flexible monthly billing",
];

const YEARLY_EXTRA_FEATURES = [
  "Long-term progress tracking",
  "Priority access to new features",
];

const FAQ_ITEMS = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. You can move between plans later based on how intensively you want to practice.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "If you run into a billing issue, reach out to support and we will review the case fairly and quickly.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Checkout is handled securely through Stripe, which supports major cards and common local payment options where available.",
  },
];

const getCheckoutLink = (baseLink, email) => {
  if (!email) return baseLink;
  return `${baseLink}?prefilled_email=${encodeURIComponent(email)}`;
};

const Upgrade = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  const monthlyPlan = useMemo(
    () => PricingPlan.find((item) => item.duration === "Monthly"),
    []
  );
  const yearlyPlan = useMemo(
    () => PricingPlan.find((item) => item.duration === "Yearly"),
    []
  );

  const yearlySavings = useMemo(() => {
    if (!monthlyPlan || !yearlyPlan) return 0;
    const monthlyYearCost = Number(monthlyPlan.price) * 12;
    const yearlyCost = Number(yearlyPlan.price);
    return Math.round(((monthlyYearCost - yearlyCost) / monthlyYearCost) * 100);
  }, [monthlyPlan, yearlyPlan]);

  return (
    <main className="premium-shell relative overflow-hidden px-5 pb-20 pt-28 text-[#f7f3ea] sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-transparent" />
      <section className="premium-container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b2ab9c]">
            <Sparkles className="h-3.5 w-3.5 text-[#ff8a1f]" />
            Upgrade
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#f7f3ea] sm:text-5xl">
            Choose the plan that keeps you moving.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#d0c9ba] sm:text-lg">
            Unlock focused AI interview preparation, detailed feedback, and a cleaner
            rhythm for getting ready before the real call.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-stretch">
          <article className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-[#121212] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_30px_80px_rgba(0,0,0,0.32)] md:p-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a9a294]">
                Monthly Plan
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-[#f7f3ea]">
                  ${monthlyPlan?.price}
                </span>
                <span className="pb-2 text-sm font-semibold text-[#a9a294]">/month</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#d0c9ba]">
                Start practicing with a flexible monthly plan.
              </p>
            </div>

            <div className="mt-8 flex-1 rounded-[24px] border border-white/8 bg-[#171717] p-5">
              <ul className="space-y-4">
                {MONTHLY_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#13261a] text-[#8ce3a5]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-7 text-[#d8d2c5]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-button-secondary mt-8 inline-flex w-full items-center justify-center px-4 py-2 text-[10px] opacity-80">
              Coming Soon
              <Clock3 className="ml-1.5 h-3.5 w-3.5" />
            </div>
          </article>

          <article className="group relative flex h-full scale-[1.01] flex-col rounded-[30px] border border-[#3b4e73] bg-[#101114] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5572a8] hover:shadow-[0_34px_100px_rgba(36,72,130,0.22)] md:p-8">
            <div className="absolute right-5 top-0 -translate-y-1/2 rounded-full border border-[#4363a0] bg-[#13203a] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b8d0ff]">
              Best Value
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9fb8e8]">
                Yearly Plan
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-black tracking-tight text-[#f7f3ea]">
                  ${yearlyPlan?.price}
                </span>
                <span className="pb-2 text-sm font-semibold text-[#a9a294]">/year</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d0c9ba]">
                Built for focused long-term practice with better value and steadier progress.
              </p>
              <p className="mt-4 text-sm font-medium text-[#8fb1ff]">
                <span className="line-through opacity-70">
                  ${(Number(monthlyPlan?.price || 0) * 12).toFixed(2)}
                </span>{" "}
                billed yearly — save {yearlySavings}%
              </p>
            </div>

            <div className="mt-8 flex-1 rounded-[24px] border border-[#21314d] bg-[#13161c] p-5">
              <p className="mb-4 text-sm font-semibold text-[#f7f3ea]">
                Everything in Monthly, plus:
              </p>
              <ul className="space-y-4">
                {[...MONTHLY_FEATURES, ...YEARLY_EXTRA_FEATURES].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#162a1e] text-[#8ce3a5]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-7 text-[#d8d2c5]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-button-primary mt-8 inline-flex w-full items-center justify-center px-4 py-2 text-[10px] opacity-90">
              Coming Soon
              <Clock3 className="ml-1.5 h-3.5 w-3.5" />
            </div>
          </article>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-3 rounded-[24px] border border-white/10 bg-[#121212] px-5 py-4 text-sm text-[#d8d2c5] md:grid-cols-3">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-4 w-4 text-[#8ce3a5]" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[#8ce3a5]" />
            <span>Secure checkout via Stripe</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-[#8ce3a5]" />
            <span>No hidden fees</span>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[28px] border border-white/10 bg-[#121212] p-5 md:p-6">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a9a294]">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#f7f3ea]">
              A few quick answers before you choose
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-[22px] border border-white/10 bg-[#171717]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-[#f7f3ea]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#a9a294] transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/8 px-5 py-4 text-sm leading-7 text-[#d0c9ba]">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Upgrade;
