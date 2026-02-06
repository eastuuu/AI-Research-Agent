import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('quota'))) {
      console.warn(`Rate limit hit. Retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return callWithRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
}

// 1. Generate Sub-questions
export const generateSubQuestions = async (topic: string): Promise<string[]> => {
  const ai = getClient();
  
  const prompt = `You are a specialized academic research planner. 
  Your task is to break down the user's research topic into exactly 4 distinct, focused, and academic research sub-questions.
  These questions should cover different angles of the topic to allow for a comprehensive report.
  
  Topic: "${topic}"
  
  Return ONLY a JSON array of 4 string questions.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated for sub-questions");

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse sub-questions JSON", e);
      // Fallback: simple split if JSON fails
      return text.split("\n").filter(line => line.trim().length > 0).slice(0, 4);
    }
  });
};

// 2. Answer a single question
export const researchQuestion = async (question: string): Promise<string> => {
  const ai = getClient();
  
  const prompt = `You are an academic researcher.
  Provide a factual, neutral, and detailed answer to the following research question.
  
  Question: "${question}"
  
  Guidelines:
  - Avoid marketing fluff.
  - Cite general concepts where applicable.
  - Keep the tone formal and objective.
  - Format your response using clean Markdown (e.g., bold key terms, use bullet points for lists) to ensure readability.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No answer generated.";
  });
};

// 3. Compile Final Report
export const compileFinalReport = async (topic: string, qaPairs: {question: string, answer: string}[]): Promise<string> => {
  const ai = getClient();
  
  const researchContext = qaPairs.map((item, index) => 
    `Source ${index + 1} - Question: ${item.question}\nFindings: ${item.answer}`
  ).join("\n\n");

  const prompt = `You are a senior editor for an academic journal.
  Your task is to synthesize the provided research findings into a cohesive, structured research report on the topic: "${topic}".

  Research Materials:
  ${researchContext}

  Instructions:
  1. **Format**: The output MUST be in clean Markdown.
  2. **Structure**: Strictly use the following sections as Level 2 Headers (##):
     - ## Overview
     - ## Key Findings
     - ## Use Cases
     - ## Risks & Limitations
     - ## Future Outlook
     - ## Conclusion
     - ## References
  3. **Length Constraint**: STRICTLY limit each of the narrative sections to be between 120 and 150 words.
  4. **References**: For the "## References" section, you MUST use the Google Search tool to find 3 REAL, authoritative, and relevant web sources. List them as a bulleted list in the format: "- [Title](URL)".
  5. **Content**: Synthesize the findings into a unified narrative. Do not simply list the sources.
  6. **Tone**: Academic, neutral, and professional. Avoid "I", "We", or marketing language.
  7. **Formatting**: Use bold text for emphasis and bullet points for readability where appropriate.
  
  Return the complete report in Markdown.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
          tools: [{googleSearch: {}}],
      }
    });

    return response.text || "Failed to generate report.";
  });
};
