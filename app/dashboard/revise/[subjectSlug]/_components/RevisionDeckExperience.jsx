"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Ellipsis,
  List,
  Mic,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

const difficultyTone = {
  Easy: "border-[#244d33] bg-[#112518] text-[#8ce3a5]",
  Medium: "border-[#5b4a20] bg-[#2b2211] text-[#f4c66f]",
  Hard: "border-[#5e2a2a] bg-[#2a1515] text-[#f59b9b]",
};

const statusTone = {
  gotIt: "border-[#244d33] bg-[#112518] text-[#8ce3a5]",
  reviewAgain: "border-[#5b4a20] bg-[#2b2211] text-[#f4c66f]",
};

const buildStorageKey = (subjectSlug) => `scribo-revision-progress-${subjectSlug}`;

const readStoredProgress = (subjectSlug) => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(buildStorageKey(subjectSlug));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read revision progress", error);
    return null;
  }
};

const writeStoredProgress = (subjectSlug, payload) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(buildStorageKey(subjectSlug), JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save revision progress", error);
  }
};

const chipBase =
  "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200";

const RevisionDeckExperience = ({ subject, subjectSlug, deck }) => {
  const categoryOptions = useMemo(
    () => ["All categories", ...Array.from(new Set(deck.map((item) => item.type)))],
    [deck]
  );

  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [currentCardId, setCurrentCardId] = useState(deck[0]?.id ?? null);
  const [revealed, setRevealed] = useState(false);
  const [sessionMode, setSessionMode] = useState("all");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const stored = readStoredProgress(subjectSlug);
    if (!stored) return;

    setStatusMap(stored.statusMap ?? {});
    setCurrentCardId(stored.currentCardId ?? deck[0]?.id ?? null);
    setDifficultyFilter(stored.difficultyFilter ?? "All");
    setCategoryFilter(stored.categoryFilter ?? "All categories");
    setViewMode(stored.viewMode ?? "card");
    setSessionMode(stored.sessionMode ?? "all");
  }, [deck, subjectSlug]);

  useEffect(() => {
    writeStoredProgress(subjectSlug, {
      statusMap,
      currentCardId,
      difficultyFilter,
      categoryFilter,
      viewMode,
      sessionMode,
    });
  }, [subjectSlug, statusMap, currentCardId, difficultyFilter, categoryFilter, viewMode, sessionMode]);

  const weakCardIds = useMemo(
    () =>
      deck
        .filter((item) => statusMap[item.id] === "reviewAgain")
        .map((item) => item.id),
    [deck, statusMap]
  );

  const scopedDeck = useMemo(() => {
    if (sessionMode !== "weakOnly") return deck;
    return deck.filter((item) => weakCardIds.includes(item.id));
  }, [deck, sessionMode, weakCardIds]);

  const filteredDeck = useMemo(() => {
    return scopedDeck.filter((item) => {
      const difficultyMatches =
        difficultyFilter === "All" || item.difficulty === difficultyFilter;
      const categoryMatches =
        categoryFilter === "All categories" || item.type === categoryFilter;
      const searchMatches =
        !searchTerm.trim() ||
        `${item.prompt} ${item.answer} ${item.note}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return difficultyMatches && categoryMatches && searchMatches;
    });
  }, [scopedDeck, difficultyFilter, categoryFilter, searchTerm]);

  const reviewedCount = useMemo(
    () => deck.filter((item) => statusMap[item.id]).length,
    [deck, statusMap]
  );

  const gotItCount = useMemo(
    () => deck.filter((item) => statusMap[item.id] === "gotIt").length,
    [deck, statusMap]
  );

  const reviewAgainCount = useMemo(
    () => deck.filter((item) => statusMap[item.id] === "reviewAgain").length,
    [deck, statusMap]
  );

  const progressPercent = deck.length ? Math.round((reviewedCount / deck.length) * 100) : 0;

  const currentIndex = Math.max(
    filteredDeck.findIndex((item) => item.id === currentCardId),
    0
  );
  const currentCard = filteredDeck[currentIndex] ?? filteredDeck[0] ?? null;

  useEffect(() => {
    if (!filteredDeck.length) {
      setCurrentCardId(null);
      return;
    }

    const cardStillVisible = filteredDeck.some((item) => item.id === currentCardId);
    if (!cardStillVisible) {
      setCurrentCardId(filteredDeck[0].id);
    }
  }, [filteredDeck, currentCardId]);

  useEffect(() => {
    setRevealed(false);
  }, [currentCardId]);

  const goToCard = useCallback(
    (nextIndex) => {
      if (!filteredDeck.length) return;
      const boundedIndex = Math.max(0, Math.min(nextIndex, filteredDeck.length - 1));
      setCurrentCardId(filteredDeck[boundedIndex].id);
      setShowSummary(false);
    },
    [filteredDeck]
  );

  const moveCard = useCallback(
    (direction) => {
      goToCard(currentIndex + direction);
    },
    [currentIndex, goToCard]
  );

  const handleReveal = useCallback(() => {
    if (!currentCard) return;
    setRevealed((value) => !value);
  }, [currentCard]);

  const handleCardKeyDown = useCallback(
    (event) => {
      if (event.key === " " || event.code === "Space" || event.key === "Enter") {
        event.preventDefault();
        handleReveal();
      }
    },
    [handleReveal]
  );

  const allCardsReviewedInScope = useMemo(() => {
    if (!scopedDeck.length) return false;
    return scopedDeck.every((item) => statusMap[item.id]);
  }, [scopedDeck, statusMap]);

  const handleSelfAssessment = useCallback(
    (nextStatus) => {
      if (!currentCard) return;

      setStatusMap((previous) => ({ ...previous, [currentCard.id]: nextStatus }));

      if (currentIndex < filteredDeck.length - 1) {
        setCurrentCardId(filteredDeck[currentIndex + 1].id);
      } else {
        setShowSummary(true);
      }
    },
    [currentCard, currentIndex, filteredDeck]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (viewMode !== "card" || !currentCard) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCard(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCard(-1);
      }

      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        handleReveal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentCard, handleReveal, moveCard, viewMode]);

  const resetWeakOnly = () => {
    if (!weakCardIds.length) return;
    setSessionMode("weakOnly");
    setShowSummary(false);
    setCurrentCardId(weakCardIds[0]);
    setViewMode("card");
    setSearchTerm("");
  };

  const resetFullDeck = () => {
    setSessionMode("all");
    setShowSummary(false);
    setCurrentCardId(deck[0]?.id ?? null);
    setViewMode("card");
  };

  return (
    <div className="premium-shell">
      <div className="premium-container pt-28 pb-24">
        {(showSummary || allCardsReviewedInScope) && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#111111] p-6 text-[#f7f3ea] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b8d0ff]">
              Session Summary
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              You reviewed {reviewedCount}/{deck.length}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#d7cfbf]">
              {gotItCount} marked “Got it”, {reviewAgainCount} marked “Review Again”.
              {sessionMode === "weakOnly" ? " You are currently in weak-card mode." : ""}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[22px] border border-[#244d33] bg-[#112518] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8ce3a5]">Got it</p>
                <p className="mt-2 text-3xl font-bold text-[#f7f3ea]">{gotItCount}</p>
              </div>
              <div className="rounded-[22px] border border-[#5b4a20] bg-[#2b2211] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c66f]">Review again</p>
                <p className="mt-2 text-3xl font-bold text-[#f7f3ea]">{reviewAgainCount}</p>
              </div>
              <div className="rounded-[22px] border border-[#2f3a4f] bg-[#151d2a] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8d0ff]">Remaining unseen</p>
                <p className="mt-2 text-3xl font-bold text-[#f7f3ea]">{deck.length - reviewedCount}</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === "card" ? (
          <div className="mt-8">
            {currentCard ? (
              <div className="mx-auto max-w-[700px]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => moveCard(-1)}
                    disabled={currentIndex === 0}
                    className="premium-button-secondary flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40"
                    aria-label="Previous card"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f8f9b]">
                    Card {currentIndex + 1} of {filteredDeck.length}
                  </p>

                  <button
                    type="button"
                    onClick={() => moveCard(1)}
                    disabled={currentIndex === filteredDeck.length - 1}
                    className="premium-button-secondary flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40"
                    aria-label="Next card"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 [perspective:1600px]">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleReveal}
                    onKeyDown={handleCardKeyDown}
                    className="group relative h-[470px] w-full rounded-[34px] text-left focus:outline-none sm:h-[530px]"
                  >
                    <div
                      className="relative h-full w-full transition-transform duration-300"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[34px] border border-[#ded6c8] bg-[#fff8ee] p-8 text-[#15130f] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                              difficultyTone[currentCard.difficulty] ?? "border-white/10 bg-[#1a1a1a] text-[#d7cfbf]"
                            }`}
                          >
                            {currentCard.difficulty}
                          </span>
                          {statusMap[currentCard.id] && (
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                                statusTone[statusMap[currentCard.id]]
                              }`}
                            >
                              {statusMap[currentCard.id] === "gotIt" ? "Got it" : "Review again"}
                            </span>
                          )}
                        </div>

                        <div className="flex h-full flex-col items-center justify-center text-center">
                          <p
                            className="max-w-3xl text-[22px] font-semibold leading-[1.45] tracking-tight text-[#111111] md:text-[26px]"
                            style={{ color: "#000000" }}
                          >
                            {currentCard.prompt}
                          </p>
                          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#e1d8c8] bg-[#f5efe2] px-4 py-2 text-sm font-medium text-[#6f6558]">
                            <Mic className="h-4 w-4 text-[#1d4ed8]" />
                            Say your answer out loud, then tap to reveal
                          </div>
                        </div>
                        <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b7f6b]">
                          Card {currentIndex + 1} of {filteredDeck.length}
                        </p>
                      </div>

                      <div
                        className="absolute inset-0 rounded-[34px] border border-[#ded6c8] bg-[#fffdf8] p-8 text-[#15130f] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex h-full flex-col">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                                difficultyTone[currentCard.difficulty] ?? "border-white/10 bg-[#1a1a1a] text-[#d7cfbf]"
                              }`}
                            >
                              {currentCard.difficulty}
                            </span>
                          </div>

                          <div className="mt-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
                              Best Answer
                            </p>
                            <p
                              className="mt-3 text-[20px] font-semibold leading-9 text-[#111111] md:text-[22px] md:leading-[1.5]"
                              style={{ color: "#000000" }}
                            >
                              {currentCard.answer}
                            </p>
                          </div>

                          <div className="mt-8 rounded-[24px] border border-[#ece4d8] bg-[#f7f2e8] p-5">
                            <div className="flex items-center gap-2 text-[#1d4ed8]">
                              <CheckCircle2 className="h-4 w-4" />
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
                                Revision Note
                              </p>
                            </div>
                            <p
                              className="mt-3 text-sm font-medium leading-7 text-[#555555]"
                              style={{ color: "#000000" }}
                            >
                              {currentCard.note}
                            </p>
                          </div>

                          <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => handleSelfAssessment("gotIt")}
                              className="rounded-full border border-[#d7ccb9] bg-[#ffffff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#cbbca2]"
                              style={{ color: "#000000" }}
                            >
                              Got it
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelfAssessment("reviewAgain")}
                              className="rounded-full border border-[#d7ccb9] bg-[#f7f2e8] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#cbbca2]"
                              style={{ color: "#000000" }}
                            >
                              Review Again
                            </button>
                          </div>
                          <p
                            className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b7f6b]"
                            style={{ color: "#000000" }}
                          >
                            Card {currentIndex + 1} of {filteredDeck.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!revealed && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setRevealed(true)}
                      className="rounded-full border border-[#d7ccb9] bg-[#f3ead9] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#cbbca2]"
                      style={{ color: "#000000" }}
                    >
                      Reveal Answer
                    </button>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {filteredDeck.slice(0, 12).map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentCardId(item.id)}
                      className={`h-2.5 rounded-full transition-all ${
                        item.id === currentCard.id
                          ? "w-10 bg-[#8ce3a5]"
                          : statusMap[item.id] === "gotIt"
                            ? "w-2.5 bg-[#4ade80]"
                            : statusMap[item.id] === "reviewAgain"
                              ? "w-2.5 bg-[#f4c66f]"
                              : "w-2.5 bg-white/20"
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-[#111111] p-8 text-center text-[#f7f3ea]">
                <h2 className="text-2xl font-bold">No cards match your current filters.</h2>
                <p className="mt-3 text-[#c9c1b3]">
                  Try switching the difficulty, category, or session mode.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#111111] p-6 text-[#f7f3ea] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Condensed List View</h2>
                <p className="mt-2 text-sm text-[#c9c1b3]">
                  Search by keyword and expand only the rows you want to inspect.
                </p>
              </div>

              <label className="relative block w-full max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f9687]" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search question, answer, or note"
                  className="w-full rounded-full border border-white/10 bg-[#171717] py-3 pl-11 pr-4 text-sm text-[#f7f3ea] outline-none placeholder:text-[#7f7769]"
                />
              </label>
            </div>

            <div className="space-y-3">
              {filteredDeck.map((item, index) => (
                <details
                  key={item.id}
                  className="overflow-hidden rounded-[22px] border border-white/10 bg-[#171717]"
                >
                  <summary className="cursor-pointer list-none px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1 text-xs font-semibold text-[#f7f3ea]">
                          #{index + 1}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            difficultyTone[item.difficulty] ?? "border-white/10 bg-[#1a1a1a] text-[#d7cfbf]"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                        <span className="rounded-full border border-[#2f3a4f] bg-[#151d2a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b8d0ff]">
                          {item.type}
                        </span>
                        {statusMap[item.id] && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                              statusTone[statusMap[item.id]]
                            }`}
                          >
                            {statusMap[item.id] === "gotIt" ? "Got it" : "Review again"}
                          </span>
                        )}
                      </div>

                      <div className="max-w-3xl text-sm font-semibold text-[#f7f3ea] lg:text-right">
                        {item.prompt}
                      </div>
                    </div>
                  </summary>

                  <div className="border-t border-white/10 px-5 py-5">
                    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[20px] border border-white/10 bg-[#111111] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8ce3a5]">
                          Best Answer
                        </p>
                        <p className="mt-3 text-base font-semibold leading-7 text-[#f7f3ea]">
                          {item.answer}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-white/10 bg-[#111111] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b8d0ff]">
                          Revision Note
                        </p>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#d7cfbf]">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionDeckExperience;
