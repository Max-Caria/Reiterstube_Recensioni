import { GoogleGenAI } from "@google/genai";
import { ReplyGenerationRequest, ReplyTone, ParsedReviewData, ReviewSource } from "../types";

const apiKey = process.env.API_KEY;
// Initialize the client. In a production app, handle the case where API_KEY is missing gracefully.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

const getToneInstruction = (tone: ReplyTone): string => {
  switch (tone) {
    case 'formal':
      return "Use a strictly professional, respectful, and institutional tone. Avoid slang.";
    case 'informal':
      return "Use a casual, relaxed, and conversational tone. Be polite but friendly, like talking to an acquaintance.";
    case 'friendly':
      return "Use a very warm, welcoming, and enthusiastic tone. Use appropriate emojis (🍺, 🥨, 😊). Make the customer feel like family.";
    case 'concise':
      return "Be extremely brief, direct, and concise. Max 2 sentences. Thank and say goodbye without fluff.";
    default:
      return "Maintain a professional but hospitable tone.";
  }
};

export const generateReviewReply = async (request: ReplyGenerationRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const { reviewText, authorName, rating, tone, language } = request;

  const toneInstruction = getToneInstruction(tone);
  
  let targetLanguage = "Italian";
  if (language === 'en') targetLanguage = "English";
  if (language === 'de') targetLanguage = "German (Deutsch)";

  const prompt = `
    Review Details:
    - Author: ${authorName}
    - Rating: ${rating}/5 stars
    - Review Content: "${reviewText}"

    Task: Write a response on behalf of "ReiterStube" restaurant management.
    
    Tone Instructions: ${toneInstruction}

    General Guidelines:
    If the review is positive, thank them and invite them back. 
    If the review is negative, apologize sincerely for the specific issues mentioned, explain we take feedback seriously, and ask them to give us another chance.
    
    IMPORTANT: Write the response in ${targetLanguage}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Impossibile generare una risposta al momento.";
  } catch (error) {
    console.error("Error generating reply:", error);
    throw new Error("Si è verificato un errore durante la generazione della risposta con l'IA.");
  }
};

export const parseRawReview = async (rawText: string): Promise<ParsedReviewData> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Analyze the following raw text which contains a copied review from a platform (like Google Maps, TripAdvisor, TheFork).
    Extract the following fields into a JSON object:
    - author: The name of the reviewer. If unknown, use "Cliente".
    - rating: The rating as a number (1-5). If not found, default to 5.
    - text: The actual review content (remove dates, UI elements, "Read more", etc.).
    - source: Best guess of the source based on text markers ('Google', 'TripAdvisor', 'TheFork'). Default to 'Manual'.
    - date: The date string if present (e.g., "2 days ago", "12/05/2024").

    Raw Text:
    """
    ${rawText}
    """

    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    
    // Validate and cast
    return {
      author: data.author || "Cliente",
      rating: Number(data.rating) || 5,
      text: data.text || "",
      source: (['Google', 'TripAdvisor', 'TheFork', 'Manual'].includes(data.source) ? data.source : 'Manual') as ReviewSource,
      date: data.date || "Oggi"
    };

  } catch (error) {
    console.error("Error parsing raw review:", error);
    throw new Error("Impossibile analizzare il testo. Prova a inserire i dati manualmente.");
  }
};