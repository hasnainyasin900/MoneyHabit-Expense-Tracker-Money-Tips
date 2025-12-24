
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType, AppLanguage } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Pro for complex financial reasoning and detailed analysis.
 */
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

    Role: Expert Financial Advisor & Behavioral Economist.
    Language Requirement: ${lang === 'en' ? 'English ONLY. Be professional, direct, and data-driven.' : 'Urdu and Roman Urdu ONLY. Be friendly, encouraging, and use local cultural context.'}
    
    Tasks:
    1. Identify a potential saving opportunity.
    2. Comment on the Income-to-Expense ratio.
    3. Suggest one small "MoneyHabit" to improve their situation.
    
    Provide exactly 3 actionable bullet points. Keep it punchy and high-impact.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return lang === 'en' ? "Insights unavailable at the moment." : "Maaf kijiye, mashwaray abhi dastyab nahi.";
  }
};

/**
 * Uses Gemini Flash Lite for fast, low-latency daily tips.
 */
export const generateDailyTips = async (lang: AppLanguage) => {
  const prompt = `Generate 5 daily money tips for students, freelancers, and small shop owners. 
  Language: ${lang === 'en' ? 'Professional English' : 'Urdu script and Roman Urdu'}.
  Focus on: frugal living, saving tactics, and smart spending.
  Output in JSON format with fields: title, content, language.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
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
    const text = response.text || "[]";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error generating tips:", error);
    return [];
  }
};
