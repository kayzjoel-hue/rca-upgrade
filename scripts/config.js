/**
 * Frontend Configuration
 * Non-sensitive settings
 */

export const CONFIG = {
  apiBase: '/api',
  endpoints: {
    ai: '/api/ai',
    health: '/api/health',
  },
  timeouts: {
    aiRequest: 30000, // 30 seconds
  },
  ui: {
    animationDuration: 300,
  },
};