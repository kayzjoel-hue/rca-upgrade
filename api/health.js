/**
 * Health check endpoint
 * Used to monitor if API is running
 */

export default function handler(req, res) {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: hasKey ? 'configured' : 'missing'
  });
}
