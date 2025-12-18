import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCVHTML = async (formData, cvType) => {
  try {
    // USE FLASH MODEL FOR 5X FASTER SPEEDS
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert CV designer. Create a professional CV in HTML format with INLINE CSS only.
      User Data: ${JSON.stringify(formData)}
      Style Preference: ${cvType}

      RULES:
      1. Return ONLY the raw HTML code starting with <!DOCTYPE html>.
      2. No markdown code blocks (No \`\`\`html).
      3. Use only inline CSS styles.
      4. Optimized for A4 printing.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup: remove markdown if AI includes it
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error("GEMINI_API_FAILURE:", error);
    throw error;
  }
};