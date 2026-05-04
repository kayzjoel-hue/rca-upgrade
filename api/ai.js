export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, mode } = req.body || {};

    // ✅ Validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({ error: "Prompt too long (max 4000 chars)" });
    }

    const normalizedMode = mode === "trade" ? "trade" : "safari";
    const trimmedPrompt = prompt.trim();

    // ✅ System prompt (your concierge logic)
    const systemPrompt =
      normalizedMode === "trade"
        ? [
            "You are the Royal Connect Africa trade concierge.",
            "Write a polished first-draft trade response for a Dubai-facing operator.",
            "Keep it practical, warm, and commercially clear.",
            "Include: overview, suggested next steps, info still needed, and a short closing.",
            "Do not invent certifications, pricing, or legal guarantees.",
          ].join(" ")
        : [
            "You are the Royal Connect Africa safari concierge.",
            "Write a polished first-draft safari recommendation for a premium East Africa audience.",
            "Keep it elegant, practical, and rooted in trust.",
            "Include: suggested journey shape, likely highlights, info still needed, and a short closing.",
            "Do not invent permits, prices, or availability.",
          ].join(" ");

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // ✅ Fallback if no API key (keeps frontend working)
    if (!GEMINI_API_KEY) {
      const mock =
        normalizedMode === "trade"
          ? `**Mock Trade Proposal**\n\nReceived: ${prompt}`
          : `**Mock Safari Plan**\n\nReceived: ${prompt}`;

      return res.status(200).json({ text: mock });
    }

    // ✅ Real Gemini API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nUser request:\n${trimmedPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message || "Gemini request failed.";
      return res.status(response.status).json({ error: message });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim() || "";

    if (!text) {
      return res.status(502).json({
        error: "AI returned empty response.",
      });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error("AI handler error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}