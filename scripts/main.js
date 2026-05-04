// main.js — UI helpers + AI interface (guarded)
// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌍 Royal Connect Africa - Initializing...');
  // Initialize Lucide Icons if available
  try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch(e){}

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
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('hidden');
    mobileMenu.setAttribute('aria-hidden', String(expanded));
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ==================== SMOOTH SCROLL ====================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

// ==================== AI CONCIERGE ====================
function setupAIInterface() {
  const tabs = document.querySelectorAll('.tab-btn') || [];
  const form = document.getElementById('ai-form');
  const queryInput = document.getElementById('query') || document.getElementById('prompt'); // fallback
  const resultDiv = document.getElementById('result');
  const resultText = document.getElementById('result-text') || (resultDiv ? (() => {
    let el = resultDiv.querySelector('.result-text');
    if (!el) {
      el = document.createElement('div');
      el.className = 'result-text';
      el.id = 'result-text';
      resultDiv.appendChild(el);
    }
    return el;
  })() : null);
  const resultTitle = document.getElementById('result-title') || null;
  const generateBtn = document.getElementById('generate-btn');
  const loader = document.getElementById('loader');
  const copyBtn = document.getElementById('copy-btn');

  let currentMode = 'safari';

  if (!form) return;

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active', 'border-[#4a1415]', 'text-[#4a1415]', 'font-semibold');
        t.classList.add('text-gray-500');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active', 'border-[#4a1415]', 'text-[#4a1415]', 'font-semibold');
      tab.classList.remove('text-gray-500');
      tab.setAttribute('aria-selected', 'true');
      currentMode = tab.dataset.mode || currentMode;

      if (queryInput) {
        queryInput.placeholder = currentMode === 'safari'
          ? 'e.g., 7 days, luxury lodges, Gorilla trekking and the source of the Nile...'
          : 'e.g., I need 5 tons of Arabica coffee and 200kg of Shea Butter for export to Dubai...';
        queryInput.focus();
      }
    });
  });

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  if (queryInput) {
    queryInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = (queryInput && queryInput.value) ? queryInput.value.trim() : '';
    if (!query) {
      alert("Please describe what you're looking for ✨");
      return;
    }

    // UI loading state
    if (generateBtn) { generateBtn.disabled = true; generateBtn.style.opacity = '0.5'; }
    if (loader) loader.classList.remove('hidden');
    if (resultDiv) resultDiv.classList.add('hidden');

    try {
      console.log(`📤 Sending ${currentMode} request to /api/ai...`);
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, mode: currentMode }),
      });

      const data = await response.json().catch(()=>({ text: 'No JSON body.' }));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

      if (resultTitle) resultTitle.textContent = currentMode === 'safari' ? 'Your Safari Draft' : 'Your Trade Proposal';

      if (resultText) {
        if (typeof marked !== 'undefined' && data.text) resultText.innerHTML = marked.parse(data.text);
        else resultText.textContent = data.text || JSON.stringify(data);
      }

      if (resultDiv) resultDiv.classList.remove('hidden');
    } catch (error) {
      console.error('❌ Error:', error);
      if (resultText) resultText.innerHTML = `
        <div style="color:#d32f2f;padding:16px;background:#ffebee;border-radius:8px;">
          <strong>Error:</strong> ${error.message}
          <p style="font-size:12px;margin-top:8px;">
            Check that your local API is reachable or that GEMINI_API_KEY is configured on production.
          </p>
        </div>`;
      if (resultDiv) resultDiv.classList.remove('hidden');
    } finally {
      if (generateBtn) { generateBtn.disabled = false; generateBtn.style.opacity = '1'; }
      if (loader) loader.classList.add('hidden');
    }
  });

  // Copy button
  if (copyBtn && resultText) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(resultText.textContent || resultText.innerText || '');
      copyBtn.textContent = '✅ Copied!';
      setTimeout(()=>copyBtn.textContent='📋 Copy', 2000);
    });
  }
}

console.log('🚀 Royal Connect Africa - Ready to serve!');