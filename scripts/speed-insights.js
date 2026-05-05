// Speed Insights initialization
// Initializes Vercel Speed Insights for performance tracking
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights();
    console.log('✅ Vercel Speed Insights initialized');
  });
} else {
  injectSpeedInsights();
  console.log('✅ Vercel Speed Insights initialized');
}
