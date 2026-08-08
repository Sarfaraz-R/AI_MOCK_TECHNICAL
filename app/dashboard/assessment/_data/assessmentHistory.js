export const ASSESSMENT_HISTORY_KEY = "scribo-assessment-history";
export const ASSESSMENT_HISTORY_UPDATED_EVENT = "scribo-assessment-history-updated";

export const readAssessmentHistory = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ASSESSMENT_HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read assessment history", error);
    return [];
  }
};

export const saveAssessmentHistoryEntry = (entry) => {
  if (typeof window === "undefined") return;

  const current = readAssessmentHistory();
  const next = [entry, ...current].slice(0, 24);
  window.localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ASSESSMENT_HISTORY_UPDATED_EVENT));
};
