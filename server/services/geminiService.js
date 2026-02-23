import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is missing. Check your .env file.");
  }

  return new GoogleGenAI({
    apiKey: process.env.API_KEY,
  });
};

export const generateSummary = async (content) => {
  try {
    
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Summarize:\n\n${content}`,
    });

    console.log("FULL GEMINI RESPONSE:", response);

    return response.text || JSON.stringify(response);

  } catch (error) {
    console.error("Gemini FULL ERROR:", error);
    return "AI Summary is temporarily unavailable.";
  }
};
export const getStudyPlan = async (subject, level) => {
  try {
    
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Create a concise 4-week study plan for "${subject}" at ${level} level.`,
    });

    return response.text || "Study plan not available.";
  } catch (error) {
    console.error("Study Plan Error:", error);
    return "Unable to generate study plan.";
  }
};