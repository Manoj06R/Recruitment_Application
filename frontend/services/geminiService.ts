import { GoogleGenAI, Type } from "@google/genai";
export const generateJobDescription = async (jobTitle: string, company: string, skills: string[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a professional and engaging job description for the position of "${jobTitle}" at "${company}". 
    The ideal candidate should have skills in: ${skills.join(', ')}. 
    Please include sections for: About the Role, Responsibilities, and Requirements. Use Markdown formatting.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try writing it manually.";
  }
};