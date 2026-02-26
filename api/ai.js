// api/ai.js — Vercel Serverless function (node/edge style)
export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, mode } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // Basic input guard
    if (prompt.length > 4000) {
      return res.status(400).json({ error: 'Prompt too long (max 4000 chars)' });
    }

    // If the real GEMINI_API_KEY is not set, return a helpful mock response
    // so your frontend can function while you set the key in Vercel.
    const KEY = process.env.GEMINI_API_KEY;
    if (!KEY) {
      const mock = mode === 'trade'
        ? `**Mock Trade Proposal**\n\nReceived: ${prompt}\n\n(You can replace this mock by setting GEMINI_API_KEY in Vercel settings.)`
        : `**Mock Safari Plan**\n\nReceived: ${prompt}\n\n(You can replace this mock by setting GEMINI_API_KEY in Vercel settings.)`;

      return res.status(200).json({ text: mock });
    }

    // ====== PLACEHOLDER: Replace this block with a real call to Gemini API ======
    // Example pseudo-code (replace with actual Gemini HTTP call as per Google docs):
    //
    // const r = await fetch('https://api.google.com/v1/models/.../generate', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt, /* model params */ })
    // });
    // const payload = await r.json();
    // const text = payload?.output?.[0]?.content ?? 'No text returned';
    //
    // For now we return a success placeholder to avoid throwing errors in production.
    // =============================================================================

    // Safe fallback: return a simple acknowledgement (the real implementation goes above)
    const placeholder = mode === 'trade'
      ? `**Trade proposal (placeholder)**\n\nWe received your request and will process it. (GEMINI_API_KEY present but real call not implemented yet.)`
      : `**Safari plan (placeholder)**\n\nWe received your request and will process it. (GEMINI_API_KEY present but real call not implemented yet.)`;

    return res.status(200).json({ text: placeholder });
  } catch (err) {
    console.error('AI handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
