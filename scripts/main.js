// Initialize Lucide Icons (run after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// AI Logic
let currentMode = 'safari';

function setMode(mode) {
  currentMode = mode;
  const btnSafari = document.getElementById('btn-safari');
  const btnTrade  = document.getElementById('btn-trade');
  const label     = document.getElementById('input-label');
  const textarea  = document.getElementById('ai-user-input');

  if (mode === 'safari') {
    btnSafari.classList.add('bg-royal-maroon', 'text-white');
    btnSafari.classList.remove('bg-royal-light', 'text-royal-ink/50');
    btnTrade.classList.remove('bg-royal-maroon', 'text-white');
    btnTrade.classList.add('bg-royal-light', 'text-royal-ink/50');
    label.innerText = "Describe your dream trip";
    textarea.placeholder = "e.g. 7 days, luxury lodges, Gorilla trekking and the source of the Nile...";
  } else {
    btnTrade.classList.add('bg-royal-maroon', 'text-white');
    btnTrade.classList.remove('bg-royal-light', 'text-royal-ink/50');
    btnSafari.classList.remove('bg-royal-maroon', 'text-white');
    btnSafari.classList.add('bg-royal-light', 'text-royal-ink/50');
    label.innerText = "Describe your product needs";
    textarea.placeholder = "e.g. I need to source 5 tons of Arabica coffee and 200kg of Shea Butter for export to Dubai...";
  }
}

async function generateResponse() {
  const input = document.getElementById('ai-user-input').value.trim();
  if (!input) return alert("Please enter a description first.");

  const loader     = document.getElementById('ai-loader');
  const resultArea = document.getElementById('ai-result');
  const resetBtn   = document.getElementById('ai-reset');
  const inputArea  = document.getElementById('ai-input-area');

  loader.classList.remove('hidden');
  loader.classList.add('flex');

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, mode: currentMode }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server responded with ${res.status}`);
    }

    // Parse Markdown from AI and display
    resultArea.innerHTML = marked.parse(data.text);
    resultArea.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
    inputArea.classList.add('hidden');

  } catch (error) {
    resultArea.innerHTML = `<p class="text-red-600 font-medium">Error: ${error.message}</p>`;
    resultArea.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
    loader.classList.remove('flex');
  }
}

function resetAI() {
  document.getElementById('ai-result').classList.add('hidden');
  document.getElementById('ai-reset').classList.add('hidden');
  document.getElementById('ai-input-area').classList.remove('hidden');
  document.getElementById('ai-user-input').value = '';
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Toggle menu icon to X and back
    const icon = mobileBtn.querySelector('i');
    if (icon.getAttribute('data-lucide') === 'menu') {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons(); // Re-render changed icon
  });
}

// Formspree Contact Form Handling (improved UX)
const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');

if (form && statusDiv) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusDiv.textContent = 'Sending your request...';
    statusDiv.className = 'mt-4 text-center text-sm text-white/80';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        statusDiv.textContent = 'Thank you! We received your request and will reply soon.';
        statusDiv.classList.add('text-green-400');
        form.reset();
      } else {
        throw new Error('Failed to send – please try WhatsApp instead.');
      }
    } catch (err) {
      statusDiv.textContent = `Error: ${err.message}`;
      statusDiv.classList.add('text-red-400');
    }
  });
}