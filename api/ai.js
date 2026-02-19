/**
 * Royal Connect Africa - AI Concierge
 * Serverless function for Gemini API integration
 * Deployed on Vercel
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash'; // Fast, cheap, reliable

if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, mode } = req.body;

  // Validate input
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field' });
  }

  if (!mode || !['safari', 'trade'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode. Use "safari" or "trade"' });
  }

  // Rate limiting: Simple check (in production, use Redis)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[AI Request] IP: ${clientIp}, Mode: ${mode}`);

  // System prompts for each mode
  const systemPrompts = {
    safari: `You are the Royal Connect Africa AI Concierge, a luxury safari itinerary expert. 
Your role is to create bespoke, high-end safari itineraries for Uganda based on the client's request.
Guidelines:
- Structure as a day-by-day itinerary with markdown headers (## Day 1, ## Day 2, etc.)
- Include specific lodge recommendations (5-star properties in Uganda)
- Mention wildlife viewing opportunities, cultural experiences, and logistics
- Include estimated costs in USD
- Add travel tips and visa information for UAE nationals
- Keep tone elegant, luxurious, and professional
- Maximum length: 1500 words

User request: ${prompt}`,

    trade: `You are the RCA Trade Desk AI, a B2B commerce specialist for Uganda-UAE trade.
Your role is to draft professional trade inquiries and supplier connection emails.
Guidelines:
- Write as a formal business email/inquiry letter
- Include [Sender Name], [Date], [Company], and placeholders for customization
- Focus on: product sourcing, quality assurance, compliance, logistics, and pricing
- Mention Ugandan products: Arabica coffee, Robusta coffee, Shea butter, cocoa, minerals
- Include incoterms (CIF Dubai preferred), minimum order quantities, payment terms
- Add compliance notes (certificates, traceability)
- Keep tone professional, formal, and trustworthy
- Maximum length: 800 words

User request: ${prompt}`,
  };

  try {
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompts[mode],
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7, // Balanced creativity
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Gemini API Error]', {
        status: response.status,
        error: errorData,
      });
      return res.status(response.status || 500).json({
        error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}`,
      });
    }

    const data = await response.json();

    // Extract text from response
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated. Please try again.';

    // Success response
    res.status(200).json({
      text,
      mode,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({
      error: `Server error: ${error.message}`,
    });
  }
}