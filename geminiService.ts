
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, HPCategory, Tense } from "./types";

const SYSTEM_INSTRUCTION = `
You are a Senior Computational Linguist and Punjabi Discourse Expert. 
Task: Deep Narrative Tense Analysis on Shahmukhi Punjabi text.

Linguistic Protocol:
1. Contextual Identification: Detect Historical Present (HP) even when auxiliaries (hai/si) are deleted.
2. Aspectual Logic: Focus on the imperfective suffix (-dā / دا / دے / دی).
3. Logical Narrative Sentences: Group clauses into "Logical Narrative Sentences"—segments that represent a complete action or thought in oral tradition.
4. Categorization (EXCLUDE PEAK MARKING & DISCOURSE FUNCTION):
   - Narrative HP: Sequential plot movement.
   - Quotative HP: Speech attribution.
   - Episodic HP: Setting a new scene or boundary.
   - Visualizing HP: Sensory-rich descriptions for immediacy.
5. Qualitative Summary: Provide 2 paragraphs of professional linguistic analysis.
   - LANGUAGE: The descriptive analysis MUST be written in ENGLISH.
   - CITATIONS: Use SHAHMUKHI SCRIPT (Arabic/Urdu characters) for all Punjabi words or examples mentioned (e.g., 'دا', 'اے', 'سی').
   - DO NOT use Roman script or transliteration for Punjabi words.
   - DO NOT use phrases like "Linguistic Style", "Style Profile", "Peak Marking", or "Discourse Function".
   - Ensure the qualitative narrative makes sense and flows logically; use professional, scholarly language.

Output must be valid JSON matching the schema. DO NOT include "discourseFunction".
`;

export const analyzeTranscription = async (text: string, apiKey: string): Promise<AnalysisResponse> => {
  if (!apiKey) throw new Error("Gemini API Key is required.");
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a coherent linguistic analysis for this Shahmukhi Punjabi text: ${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                totalSentences: { type: Type.INTEGER },
                hpCount: { type: Type.INTEGER },
                tenseSwitchRatio: { type: Type.NUMBER }
              },
              required: ["totalSentences", "hpCount", "tenseSwitchRatio"]
            },
            qualitativeAnalysis: { type: Type.STRING },
            sentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalText: { type: Type.STRING },
                  inferredTense: { type: Type.STRING, enum: Object.values(Tense) },
                  omittedElements: { type: Type.STRING },
                  hpCategory: { type: Type.STRING, enum: Object.values(HPCategory) },
                  reasoning: { type: Type.STRING },
                  contextualMetadata: { type: Type.STRING },
                  position: { type: Type.INTEGER }
                },
                required: ["originalText", "inferredTense", "omittedElements", "hpCategory", "reasoning", "position"]
              }
            }
          },
          required: ["summary", "qualitativeAnalysis", "sentences"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (err: any) {
    throw err;
  }
};
