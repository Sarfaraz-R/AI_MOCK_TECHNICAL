
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const geminiModel = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3.5-flash";
const fallbackGeminiModel =
  process.env.NEXT_PUBLIC_GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";
const geminiModels = [...new Set([geminiModel, fallbackGeminiModel].filter(Boolean))];
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: geminiModel,
});

const generationConfig = {
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export const chatSession = model.startChat({
  generationConfig,
  safetySettings
});

export async function sendGeminiMessage(prompt) {
  let lastError;

  for (const modelName of geminiModels) {
    try {
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const chat = currentModel.startChat({
        generationConfig,
        safetySettings,
      });

      return await chat.sendMessage(prompt);
    } catch (error) {
      lastError = error;

      const message = error?.message || "";
      const shouldTryFallback =
        message.includes("[503") ||
        message.includes("[429") ||
        message.toLowerCase().includes("high demand") ||
        message.toLowerCase().includes("overloaded");

      if (!shouldTryFallback) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function generateGeminiContent(parts) {
  let lastError;

  for (const modelName of geminiModels) {
    try {
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      return await currentModel.generateContent(parts);
    } catch (error) {
      lastError = error;

      const message = error?.message || "";
      const shouldTryFallback =
        message.includes("[503") ||
        message.includes("[429") ||
        message.toLowerCase().includes("high demand") ||
        message.toLowerCase().includes("overloaded");

      if (!shouldTryFallback) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function generateGeminiContentWithConfig(parts, customGenerationConfig = {}) {
  let lastError;
  const mergedGenerationConfig = {
    ...generationConfig,
    ...customGenerationConfig,
  };

  for (const modelName of geminiModels) {
    try {
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      return await currentModel.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: mergedGenerationConfig,
        safetySettings,
      });
    } catch (error) {
      lastError = error;

      const message = error?.message || "";
      const shouldTryFallback =
        message.includes("[503") ||
        message.includes("[429") ||
        message.toLowerCase().includes("high demand") ||
        message.toLowerCase().includes("overloaded");

      if (!shouldTryFallback) {
        throw error;
      }
    }
  }

  throw lastError;
}
