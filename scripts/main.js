/**
 * Royal Connect Africa - Frontend JavaScript
 * AI Concierge Logic + DOM Management
 */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌍 Royal Connect Africa - Initializing...');
  
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Setup event listeners
  setupMobileMenu();
  setupSmoothScroll();
  setupAIInterface();
  
  console.log('✅ Initialization complete');
});

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ==================== SMOOTH SCROLL ====================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==================== AI CONCIERGE ====================
let currentMode = 'safari';

function setupAIInterface() {
  const generateBtn = document.querySelector('[onclick="generateResponse()"]');
  if (!generateBtn) return;

  // Keyboard shortcut: Enter + Cmd/Ctrl to submit
  document.getElementById('ai-user-input')?.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      generateResponse();
    }
  });
}

function setMode(mode) {
  if (!['safari', 'trade'].includes(mode)) return;

  currentMode = mode;

  const btnSafari = document.getElementById('btn-safari');
  const btnTrade = document.getElementById('btn-trade');
  const label = document.getElementById('input-label');
  const textarea = document.getElementById('ai-user-input');

  const configs = {
    safari: {
      label: '✈️ Describe your dream trip',
      placeholder: 'e.g., 7 days, luxury lodges, Gorilla trekking and the source of the Nile...',
      activeBtn: btnSafari,
      inactiveBtn: btnTrade,
    },
    trade: {
      label: '📦 Describe your product needs',
      placeholder: 'e.g., I need 5 tons of Arabica coffee and 200kg of Shea Butter for export to Dubai...',
      activeBtn: btnTrade,
      inactiveBtn: btnSafari,
    },
  };

  const config = configs[mode];

  // Update buttons
  config.activeBtn.classList.add('bg-royal-maroon', 'text-white', 'shadow-lg');
  config.activeBtn.classList.remove('bg-royal-light', 'text-royal-ink/50', 'hover:shadow-sm');
  config.inactiveBtn.classList.remove('bg-royal-maroon', 'text-white', 'shadow-lg');
  config.inactiveBtn.classList.add('bg-royal-light', 'text-royal-ink/50', 'hover:shadow-sm');

  // Update text
  label.innerText = config.label;
  textarea.placeholder = config.placeholder;
  textarea.focus();
}

async function generateResponse() {
  const input = document.getElementById('ai-user-input')?.value?.trim();
  
  if (!input) {
    alert('Please enter a description');
    return;
  }

  const loader = document.getElementById('ai-loader');
  const resultArea = document.getElementById('ai-result');
  const resetBtn = document.getElementById('ai-reset');
  const inputArea = document.getElementById('ai-input-area');
  const generateBtn = document.querySelector('[onclick="generateResponse()"]');

  // Show loader
  loader?.classList.remove('hidden');
  loader?.classList.add('flex');
  generateBtn.disabled = true;
  generateBtn.style.opacity = '0.5';

  try {
    console.log(`📤 Sending ${currentMode} request to /api/ai...`);

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: input,
        mode: currentMode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log('✅ Response received:', data);

    // Render markdown output
    if (typeof marked !== 'undefined') {
      resultArea.innerHTML = marked.parse(data.text);
    } else {
      resultArea.innerHTML = `<pre>${data.text}</pre>`;
    }

    resultArea?.classList.remove('hidden');
    resetBtn?.classList.remove('hidden');
    inputArea?.classList.add('hidden');

  } catch (error) {
    console.error('❌ Error:', error);
    resultArea.innerHTML = `
      <div style="color: #d32f2f; padding: 16px; background: #ffebee; border-radius: 8px;">
        <strong>Error:</strong> ${error.message}
        <p style="font-size: 12px; margin-top: 8px;">
          Check that GEMINI_API_KEY is configured in Vercel.
        </p>
      </div>
    `;
    resultArea?.classList.remove('hidden');
    resetBtn?.classList.remove('hidden');
  } finally {
    loader?.classList.add('hidden');
    loader?.classList.remove('flex');
    generateBtn.disabled = false;
    generateBtn.style.opacity = '1';
  }
}

function resetAI() {
  const resultArea = document.getElementById('ai-result');
  const resetBtn = document.getElementById('ai-reset');
  const inputArea = document.getElementById('ai-input-area');

  resultArea?.classList.add('hidden');
  resetBtn?.classList.add('hidden');
  inputArea?.classList.remove('hidden');
  document.getElementById('ai-user-input').value = '';
  document.getElementById('ai-user-input').focus();
}

// ==================== ANALYTICS (Optional) ====================
// Add Google Analytics if you want
function setupAnalytics() {
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'GA_MEASUREMENT_ID'); // Replace with your ID
}

// ==================== LOGGING ====================
console.log('🚀 Royal Connect Africa - Ready to serve!');
console.log('📍 Current mode:', currentMode);