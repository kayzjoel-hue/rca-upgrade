/**
 * Health check endpoint
 * Used to monitor if API is running
 */

export default function handler(req, res) {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const masked = hasKey ? `${process.env.GEMINI_API_KEY.slice(0,4)}…${process.env.GEMINI_API_KEY.slice(-4)}` : null;
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: hasKey ? 'configured' : 'missing',
    // only for quick debug, remove when done:
    debug: hasKey ? `key-present (starts ${masked})` : undefined
  });
}