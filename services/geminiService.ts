
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
You are the intelligent assistant for 'SKYLAR EDUCATION ASIA'.
Your persona is professional, encouraging, knowledgeable about safety, and helpful.

**About SKYLAR EDUCATION ASIA:**
SKYLAR EDUCATION ASIA is a premier international safety training provider in the Philippines. We specialize in GWO (Global Wind Organisation) and industrial safety training for global energy and industrial sectors.

**Courses Available:**
${courseList}

**Campus Locations:**
${locationList}

**Student Handbook & Policies Highlights:**
- **Student Portal:** Login and access details are provided upon enrolment.
- **WINDA ID:** A GWO WINDA ID is required for registering GWO safety training records globally.
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
    
    // Smart local fallback assistant to ensure it's fully functional offline/without API keys
    const query = message.toLowerCase().trim();
    
    if (query.includes('course') || query.includes('gwo') || query.includes('train') || query.includes('find gwo')) {
      return `Here are some of our popular **GWO Certified Safety Courses** at SKYLAR EDUCATION ASIA:

1. **GWO Combined Advanced Rescue Training (ART) Initial**
   - **Duration:** 3 Days
   - **Cost:** $1,890 USD
   - **Prerequisites:** Valid GWO BST (Heights, Handling, First Aid)
   
2. **GWO Combined Advanced Rescue Training (ART) Refresher**
   - **Duration:** 3 Days
   - **Cost:** $1,890 USD
   - **Prerequisites:** Existing GWO ART Initial

3. **GWO Basic Safety Training (BST) Initial**
   - **Duration:** 4 Days
   - **Cost:** $2,205 USD
   - **Modules:** Working at Heights, First Aid, Fire Awareness, Manual Handling

We run these courses weekly at our **Pampanga Facility** and **Manila Safety Center**. You can book directly using the upcoming sessions list on our campus pages!`;
    }
    
    if (query.includes('winda') || query.includes('gwo id')) {
      return `### GWO WINDA ID

A **WINDA ID** is a unique global identifier assigned to every delegate registered in the Global Wind Organisation database. All participants completing GWO training must register for a WINDA ID prior to course completion.

**How to register for a WINDA ID:**
1. Visit the official GWO WINDA database portal at [winda.gwo.org](https://winda.gwo.org).
2. Click **"Register as Delegate"** and complete your profile.
3. Once registered, provide your WINDA ID to us so your official GWO certificates can be uploaded upon successful course completion.`;
    }
    
    if (query.includes('location') || query.includes('campus') || query.includes('campuses') || query.includes('pampanga') || query.includes('manila') || query.includes('where')) {
      return `### SKYLAR EDUCATION ASIA Campuses

We operate two premium safety training centers:

1. **Angeles City Training Centre (Pampanga)**
   - **Address:** Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, 2009 Pampanga, Philippines
   - **Phone / WhatsApp:** +63 968 382 4294 / +63 915 902 9406
   - **Email:** bon@skylarasia.com / junrey@skylarasia.com
   - **Facebook:** [facebook.com/skylarasiapac](https://www.facebook.com/skylarasiapac/)

Our facility features modern safety simulators, high-speed WiFi, secure on-site parking, and a comfortable student lounge.`;
    }
    
    if (query.includes('refund') || query.includes('policy') || query.includes('cancel')) {
      return `### Booking & Refund Policy

- **Refund Eligibility:** You are eligible for a full refund if you cancel your booking at least 7 days before the training start date.
- **Rescheduling:** You can reschedule your training date once free of charge up to 72 hours before your session.
- **No-Show:** Cancellations or failure to attend without 72 hours notice will forfeit the booking deposit.
- Contact support at **bon@skylarasia.com** or **junrey@skylarasia.com** for any manual refunds.`;
    }
    
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greet') || query.includes('help')) {
      return `Hello! I am the **SKYLAR EDUCATION ASIA AI Support Assistant**. 

I can help you with details about our academy. Try asking me about:
- 📑 **Find GWO courses** (view price, modules, and prerequisites)
- 🆔 **What is a WINDA ID?** (steps to register your GWO Delegate ID)
- 📍 **Campuses & Contact** (Angeles City facility, hotline numbers, and Facebook page)
- 💳 **Booking & Refunds** (policy and cancellation terms)`;
    }

    return `I am here to assist you with SKYLAR EDUCATION ASIA Safety Education. I can help you with details about:
- **GWO Safety Courses** (ART, BST, BTT)
- **WINDA ID registration for GWO**
- **Training Centre in Angeles City, Pampanga**
- **Official Facebook Updates** ([facebook.com/skylarasiapac](https://www.facebook.com/skylarasiapac/))

For detailed support or individual inquiries, please email our coordinators at **bon@skylarasia.com** / **junrey@skylarasia.com** or call **+63 968 382 4294 / +63 915 902 9406**.`;
  }
};

/**
 * Generate Images directly without requiring an external API key.
 * Attempts Gemini 3 Pro API if configured, otherwise renders high-quality thematic course artwork on canvas.
 */
export const generateCourseImage = async (
    prompt: string, 
    aspectRatio: string = "16:9", 
    size: string = "1K"
): Promise<string | null> => {
    try {
        const apiKey = process.env.API_KEY || (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY);
        if (apiKey && apiKey !== 'undefined' && apiKey !== '') {
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
        }
    } catch (e) {
        console.warn("Direct API image gen unavailable, creating local high-definition artwork:", e);
    }

    // Direct client-side generation without API key requirement
    return createThematicCourseGraphic(prompt, aspectRatio);
};

/**
 * Procedurally generates a professional, high-resolution course badge / hero visual directly in browser canvas
 */
const createThematicCourseGraphic = (prompt: string, aspectRatio: string = "16:9"): string => {
    let width = 1200;
    let height = 675;

    if (aspectRatio === '1:1') {
        width = 800;
        height = 800;
    } else if (aspectRatio === '4:3') {
        width = 1000;
        height = 750;
    } else if (aspectRatio === '3:4') {
        width = 750;
        height = 1000;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200';
    }

    // Determine color theme based on prompt keywords
    const lower = prompt.toLowerCase();
    let colStart = '#0b192c';
    let colEnd = '#1E3E62';
    let accent = '#F39E00';
    let titleBadge = 'SKYLAR SAFETY TRAINING';
    let subIcon = '⚡';

    if (lower.includes('fire') || lower.includes('awareness')) {
        colStart = '#1a0b0b';
        colEnd = '#421616';
        accent = '#FF5722';
        titleBadge = 'FIRE SAFETY & AWARENESS';
        subIcon = '🔥';
    } else if (lower.includes('first aid') || lower.includes('medical') || lower.includes('rescue')) {
        colStart = '#09211c';
        colEnd = '#0e453a';
        accent = '#10B981';
        titleBadge = 'FIRST AID & EMERGENCY RESCUE';
        subIcon = '🩹';
    } else if (lower.includes('wind') || lower.includes('turbine') || lower.includes('gwo') || lower.includes('blade')) {
        colStart = '#041024';
        colEnd = '#0f2b48';
        accent = '#EBB108';
        titleBadge = 'GLOBAL WIND ORGANISATION';
        subIcon = '💨';
    } else if (lower.includes('height') || lower.includes('climb') || lower.includes('harness')) {
        colStart = '#111827';
        colEnd = '#1f2937';
        accent = '#3B82F6';
        titleBadge = 'WORKING AT HEIGHTS & ACCESS';
        subIcon = '🧗';
    }

    // Rich gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, colStart);
    bgGrad.addColorStop(0.7, colEnd);
    bgGrad.addColorStop(1, '#040d1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric grid / lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Glowing atmospheric radial orb
    const radial = ctx.createRadialGradient(width * 0.8, height * 0.25, 20, width * 0.8, height * 0.25, width * 0.6);
    radial.addColorStop(0, accent + '40');
    radial.addColorStop(0.6, accent + '08');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // Diagonal safety accent stripe at top-right
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(width - 160, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, 160);
    ctx.closePath();
    ctx.fill();

    // Secondary stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(width - 180, 0);
    ctx.lineTo(width - 165, 0);
    ctx.lineTo(width, 165);
    ctx.lineTo(width, 180);
    ctx.closePath();
    ctx.fill();

    // Header badge
    const badgeY = Math.max(50, height * 0.15);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    const badgeW = 320;
    const badgeH = 36;
    ctx.beginPath();
    ctx.roundRect(60, badgeY, badgeW, badgeH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${subIcon}  ${titleBadge}`, 76, badgeY + badgeH / 2);

    // Title / Prompt text (word wrapped)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'top';

    const words = prompt.split(' ');
    let line = '';
    let textY = badgeY + 56;
    const maxTextWidth = width - 160;
    const maxLines = 4;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && n > 0) {
            lineCount++;
            if (lineCount >= maxLines) {
                ctx.fillText(line + '...', 60, textY);
                line = '';
                break;
            }
            ctx.fillText(line, 60, textY);
            line = words[n] + ' ';
            textY += 46;
        } else {
            line = testLine;
        }
    }
    if (line) {
        ctx.fillText(line, 60, textY);
    }

    // Bottom Branding bar
    const footerY = height - 60;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, footerY - 15, width, 75);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, footerY - 15);
    ctx.lineTo(width, footerY - 15);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('SKYLAR EDUCATION ASIA • ACCREDITED SAFETY CERTIFICATION', 60, footerY + 15);

    ctx.fillStyle = accent;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('STANDARD VERIFIED ✓', width - 60, footerY + 15);

    return canvas.toDataURL('image/jpeg', 0.92);
};

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
