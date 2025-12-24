
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType, AppLanguage } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartInsights = async (transactions: Transaction[], lang: AppLanguage) => {
  const summary = transactions.reduce((acc, t) => {
    const key = t.type === TransactionType.INCOME ? 'income' : 'expense';
    acc[key] += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const prompt = `
    Analyze these financial transactions for a user:
    Income: ${summary.income}
    Expenses: ${summary.expense}
    Transactions count: ${transactions.length}

    Role: Financial Advisor.
    Language Requirement: ${lang === 'en' ? 'English ONLY. Be professional and data-driven.' : 'Urdu and Roman Urdu ONLY. Be friendly and use local cultural context.'}
    Provide 3 actionable financial tips. Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use .text property directly as per latest Gemini SDK guidelines
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return lang === 'en' ? "Insights unavailable." : "Maaf kijiye, mashwaray abhi dastyab nahi.";
  }
};

export const generateDailyTips = async (lang: AppLanguage) => {
  const prompt = `Generate 5 daily money tips. 
  Language: ${lang === 'en' ? 'Professional English' : 'Urdu script and Roman Urdu'}.
  Output in JSON format with fields: title, content, language.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              language: { type: Type.STRING },
            },
            required: ['title', 'content', 'language'],
            propertyOrdering: ['title', 'content', 'language'],
          }
        }
      }
    });
    // Ensure response.text is accessed as a property and trimmed before parsing.
    const text = response.text || "[]";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error generating tips:", error);
    return [];
  }
};
