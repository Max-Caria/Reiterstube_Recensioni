import { GoogleGenAI } from "@google/genai";
import { ReplyGenerationRequest, ReplyTone, ParsedReviewData, ReviewSource, OptimizationRequest, OptimizationResult, PhotoStyle, MenuDishRequest, GooglePostRequest, QnARequest, QnAPair } from "../types";

const apiKey = process.env.API_KEY;
// Initialize the client. In a production app, handle the case where API_KEY is missing gracefully.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

const getToneInstruction = (tone: ReplyTone): string => {
  switch (tone) {
    case 'formal':
      return "Use a strictly professional, respectful, and institutional tone. Use formal pronouns (Lei/Sie). Avoid slang.";
    case 'informal':
      return "Use a casual, relaxed, and conversational tone. Be polite but friendly, like talking to an acquaintance.";
    case 'friendly':
      return "Use a very warm, welcoming, and enthusiastic tone. Use appropriate emojis (🍺, 🥨, 😊). Make the customer feel like family. Focus on the human connection.";
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

  const { reviewText, authorName, rating, tone, language, restaurantName, brandIdentity } = request;

  const toneInstruction = getToneInstruction(tone);
  
  let targetLanguage = "Italian";
  if (language === 'en') targetLanguage = "English";
  if (language === 'de') targetLanguage = "German (Deutsch)";

  // Construct Identity Context
  let identityContext = "";
  if (brandIdentity) {
    identityContext = `
    BRAND IDENTITY & VALUES (CRITICAL):
    - Vision: "${brandIdentity.vision || ''}"
    - Core Values: "${brandIdentity.values || ''}"
    - History/Tradition: "${brandIdentity.history || ''}"
    
    INSTRUCTION: Infuse the reply with these values subtly. Do not explicitly say "Our vision is...", but embody this personality. If the user mentions something related to our values (e.g. food quality), reinforce it using our specific tradition/history.
    `;
  }

  // We add 'Identity Grounding' here to make the AI feel more like a specialized tool than generic ChatGPT
  const prompt = `
    You are the experienced Restaurant Manager of "${restaurantName}".
    Your goal is to manage the restaurant's online reputation by replying to reviews.
    
    ${identityContext}

    Review Details:
    - Author: ${authorName}
    - Rating: ${rating}/5 stars
    - Review Content: "${reviewText}"

    Task: Write a reply to this review.
    
    Tone Instructions: ${toneInstruction}

    Strategy:
    1. Acknowledge: Mention specific details from the review (e.g., if they liked the pasta, mention the pasta) to show we actually read it.
    2. Context: Remember you are speaking as "${restaurantName}". Do not sign with generic names, sign as "The Team at ${restaurantName}".
    3. Conversion:
       - If Positive: Thank them warmly and invite them back for a specific reason (e.g., "See you for the next beer!").
       - If Negative: Apologize sincerely without being defensive. Offer a generic solution (e.g., "Contact us directly").
    
    IMPORTANT: Write the response in ${targetLanguage}. Do not include quotes or preambles. Just the reply body.
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

export const generateOptimizationData = async (request: OptimizationRequest): Promise<OptimizationResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    You are a Local SEO Expert specializing in Restaurants for Google Maps.
    
    Restaurant Context:
    - Name: ${request.restaurantName}
    - Cuisine/Type: ${request.cuisineType}
    - Location: ${request.location}
    - Current Description (if any): "${request.currentDescription || ''}"

    Task: Create an optimization plan to rank higher on Google Maps.
    
    Return a JSON object with:
    1. optimizedDescription: A persuasive, SEO-friendly description (max 750 chars) in Italian. Include the location and cuisine keywords naturally. It must make people hungry.
    2. keywords: Array of 5-7 short, high-intent keywords (e.g., "Miglior pizza Bolzano", "Ristorante tipico") to use in posts or replies.
    3. photoSuggestions: Array of 3 specific photo ideas that Google Algorithms reward (e.g., "Bright photo of the facade", "Vertical video of pouring wine").
    4. menuSuggestions: Array of 2 tips on how to name dishes for better search visibility.

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
    return JSON.parse(jsonText) as OptimizationResult;

  } catch (error) {
    console.error("Error generating optimization:", error);
    throw new Error("Impossibile generare l'ottimizzazione.");
  }
};

export const enhanceRestaurantPhoto = async (base64Image: string, mimeType: string, style: PhotoStyle): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const stylePrompts: Record<PhotoStyle, string> = {
    natural: "Enhance the photo to look natural, balanced, and professional. Improve white balance and remove noise.",
    warm: "Apply a warm, cozy, golden-hour look. Make the food look comforting and inviting. Enhance reds and oranges.",
    bright: "Make the photo bright, airy, and high-key. Increase exposure and vibrancy. Ideal for lunch or breakfast menus.",
    dramatic: "Apply a dramatic, moody, high-contrast look. Darker background, highlighted subject. 'Gourmet' style.",
    hdr: "Apply a subtle HDR effect to bring out details in shadows and highlights. Make textures pop."
  };

  const userPrompt = stylePrompts[style];
  
  const fullPrompt = `
    ${userPrompt}
    CRITICAL INSTRUCTION: You are a professional photo editor. 
    Keep the original subject (food/room) EXACTLY the same. 
    Do not add or remove objects. 
    Only improve lighting, color, sharpness, and resolution. 
    Make it look like it was taken with a professional DSLR camera.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: fullPrompt }
        ]
      }
    });

    let enhancedBase64 = '';
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                enhancedBase64 = part.inlineData.data;
                break;
            }
        }
    }

    if (!enhancedBase64) {
        throw new Error("No image generated.");
    }

    return enhancedBase64;
  } catch (error) {
    console.error("Error enhancing photo:", error);
    throw new Error("Impossibile migliorare la foto. L'IA potrebbe essere occupata.");
  }
};

export const generateMenuDescription = async (request: MenuDishRequest): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    You are a Menu Copywriter.
    Dish: "${request.dishName}"
    Ingredients (optional): "${request.ingredients || ''}"
    Style: ${request.style} (Gourmet means sophisticated, Rustic means traditional/hearty, Simple means direct).

    Task: Write a mouth-watering description (max 160 characters) for this dish in Italian. 
    It will be used on Google Maps "Products". Focus on sensory details (taste, texture).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Descrizione non disponibile.";
};

export const generateGooglePost = async (request: GooglePostRequest): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    You are a Social Media Manager for "${request.restaurantName}".
    Task: Write a "Google My Business Update" post.
    Topic: ${request.topic}
    Details: "${request.details}"
    
    Guidelines:
    - Keep it short (max 250 characters).
    - Include 2-3 relevant emojis.
    - End with a Call to Action (e.g. "Prenota ora", "Vieni a trovarci").
    - Language: Italian.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Post non disponibile.";
};

export const generateQnA = async (request: QnARequest): Promise<QnAPair[]> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Generate 3 common Q&A pairs for a restaurant named "${request.restaurantName}" (Cuisine: ${request.cuisineType}).
    These should be high-value questions for Google Maps Q&A (e.g., parking, gluten-free, reservations).
    Language: Italian.
    
    Return RAW JSON format: [{ "question": "...", "answer": "..." }]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};