
import { GoogleGenAI } from "@google/genai";

/**
 * Intelligent Content Engine
 * Handles dynamic generation of job descriptions and recruitment materials
 */
export const fetchSmartDescription = async (role: string, org: string, skills: string[]) => {
  try {
    const api = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicit system prompt to ensure high quality and professional tone
    const instruction = `You are a professional HR specialist. Generate a comprehensive job description for:
    Role: ${role}
    Company: ${org}
    Required Tech: ${skills.join(', ')}
    Format as clean Markdown with sections for 'The Role', 'Primary Responsibilities', and 'Candidate Requirements'.`;

    const result = await api.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: instruction,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return result.text || "Draft could not be generated at this time.";
  } catch (err) {
    console.warn("Content Engine Notice:", err);
    return "Draft generation failed. Please proceed with manual input.";
  }
};
