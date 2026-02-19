/**
 * Health check endpoint
 * Used to monitor if API is running
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
  });
}