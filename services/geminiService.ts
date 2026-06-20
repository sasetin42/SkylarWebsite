
import { GoogleGenAI, Type } from "@google/genai";
import { getCourses } from '../services/storageService';
import { LOCATIONS } from '../constants';

// Helper to get fresh AI client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Dynamic context construction for RAG-like behavior
const getWebsiteContext = () => {
  const courses = getCourses();
  const courseList = courses.map(c => 
    `- ${c.title} (${c.duration}): $${c.price}. ${c.category}. Status: ${c.level}. Desc: ${c.shortDescription}`
  ).join('\n');

  const locationList = LOCATIONS.map(l => 
    `- ${l.name}: ${l.address} (${l.phone}). State: ${l.state}.`
  ).join('\n');

  return `
You are the intelligent assistant for 'Skylar Education Asia Inc.'.
Your persona is professional, encouraging, knowledgeable about safety, and helpful.

**About Skylar Education:**
Skylar Education Asia Inc. is a premier vocational education provider in the Philippines, expanded from Skylar Education Pty Ltd (Australia). We specialize in GWO (Global Wind Organisation) and industrial safety training.

**Courses Available:**
${courseList}

**Campus Locations:**
${locationList}

**Student Handbook & Policies Highlights:**
- **Canvas LMS:** Login details are emailed 48 hours before course start.
- **USI:** Unique Student Identifier is required for Australian accredited training.
- **Support:** Academic Support and Career Services are available.
- **Refunds:** Full refund if withdrawn 14 days prior. 50% if 5 days prior. No refund within 24h.
- **Payment Plans:** Available for courses over $1,500.

**Instructions:**
1. Answer questions strictly based on the provided context.
2. If unsure, ask the user to contact support at info@skylareducation.asia or call +63 45 123 4567.
3. Be concise and format responses with Markdown (bullet points, bold text).
4. If the user asks for "news" or "trends", you can mention you don't have real-time access unless they use the search tool.
`;
};

/**
 * Main Chatbot Function
 */
export const chatWithGemini = async (
  history: { role: string; text: string }[],
  message: string,
  useReasoning: boolean = false,
  imageBase64?: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    // Default to Flash Lite for speed and cost effectiveness
    let modelId = 'gemini-2.5-flash-lite';
    
    // Switch to Pro if Reasoning is requested OR if Image Analysis is needed
    if (useReasoning || imageBase64) {
        modelId = 'gemini-3-pro-preview';
    }
    
    // Configure thinking budget if reasoning is requested (only for 2.5 series or specific preview models)
    const config: any = {
        systemInstruction: getWebsiteContext(),
        temperature: 0.7,
    };

    const chatHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: modelId,
      config: config,
      history: chatHistory
    });

    // Prepare message content
    const msgContent: any[] = [{ text: message }];
    
    if (imageBase64) {
        // Clean base64 string if it contains metadata prefix
        const cleanData = imageBase64.split(',')[1] || imageBase64;
        msgContent.push({
            inlineData: {
                mimeType: 'image/jpeg', 
                data: cleanData
            }
        });
    }

    const response = await chat.sendMessage({ message: msgContent });
    return response.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later or contact our support team.";
  }
};

/**
 * Generate Images using Gemini 3 Pro Image Preview
 */
export const generateCourseImage = async (
    prompt: string, 
    aspectRatio: string = "16:9", 
    size: string = "1K"
): Promise<string | null> => {
    try {
        // Must reuse current key
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio as any,
                    imageSize: size as any 
                }
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Gen Error", e);
        return null;
    }
}

/**
 * Search Grounding for Industry News using Gemini 2.5 Flash
 */
export const searchIndustryNews = async (topic: string): Promise<{text: string, links: any[]}> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the latest news and trends regarding ${topic} in the education, safety, or renewable energy sectors in Asia/Philippines. Summarize 3 key points.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No news found.";
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, links };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { text: "Unable to fetch news at this time.", links: [] };
  }
};

/**
 * Maps Grounding for Location finding using Gemini 2.5 Flash
 */
export const findNearbyPlaces = async (query: string): Promise<{text: string, maps: any[]}> => {
  const cleanQuery = query.toLowerCase();
  
  // Define fallback mock data for local grounding
  const mockCafes = [
    { maps: { title: "Teaspoon Cafe", rating: "4.5", address: "Unit D, Friendship Highway, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Teaspoon+Cafe+Angeles" } },
    { maps: { title: "Coffee Project - Angeles", rating: "4.4", address: "Villar Land, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Coffee+Project+Angeles" } },
    { maps: { title: "Sky Garden Cafe", rating: "4.6", address: "Clark Freeport, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Sky+Garden+Cafe+Clark" } },
    { maps: { title: "Café Dia", rating: "4.5", address: "Don Juico Ave, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Cafe+Dia+Angeles" } }
  ];
  
  const mockTransport = [
    { maps: { title: "Angeles Jeepney Terminal", rating: "4.0", address: "Henson St, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Angeles+Jeepney+Terminal" } },
    { maps: { title: "Dau Bus Terminal", rating: "4.1", address: "Dau, Mabalacat City, Pampanga (Near Angeles)", uri: "https://maps.google.com/?q=Dau+Bus+Terminal" } },
    { maps: { title: "Clark International Airport (CRK)", rating: "4.6", address: "Clark Freeport Zone, Pampanga", uri: "https://maps.google.com/?q=Clark+International+Airport" } }
  ];
  
  const mockLibraries = [
    { maps: { title: "Angeles City Library and Information Center", rating: "4.3", address: "Sto. Entierro St, Angeles City, Pampanga", uri: "https://maps.google.com/?q=Angeles+City+Library" } },
    { maps: { title: "Angeles University Foundation Library", rating: "4.7", address: "McArthur Highway, Angeles City, Pampanga", uri: "https://maps.google.com/?q=AUF+Library" } },
    { maps: { title: "SM City Clark Study Lounge", rating: "4.2", address: "M.A. Roxas Highway, Clark Freeport, Angeles City, Pampanga", uri: "https://maps.google.com/?q=SM+City+Clark" } }
  ];

  let selectedMock = mockLibraries;
  if (cleanQuery.includes('cafe') || cleanQuery.includes('coffee') || cleanQuery.includes('food') || cleanQuery.includes('eat') || cleanQuery.includes('restaurant')) {
    selectedMock = mockCafes;
  } else if (cleanQuery.includes('transport') || cleanQuery.includes('bus') || cleanQuery.includes('transit') || cleanQuery.includes('jeepney') || cleanQuery.includes('terminal') || cleanQuery.includes('airport')) {
    selectedMock = mockTransport;
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find places related to: ${query} near Angeles City, Pampanga. Provide a list.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "No places found.";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Normalize Gemini groundingChunks structure into uniform maps items
    const maps = rawChunks.map((chunk: any) => ({
      maps: {
        title: chunk.web?.title || "Location",
        uri: chunk.web?.uri || "",
        address: chunk.web?.uri ? "Grounding Point" : "",
        rating: "4.5"
      }
    }));

    return { text, maps: maps.length > 0 ? maps : selectedMock };
  } catch (error) {
    console.error("Gemini Maps Error, using mock fallback:", error);
    return { text: "Loaded fallback amenities list.", maps: selectedMock };
  }
};
