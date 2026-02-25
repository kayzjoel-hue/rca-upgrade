document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const form = document.getElementById('ai-form');
  const queryInput = document.getElementById('query');
  const resultDiv = document.getElementById('result');
  const resultText = document.getElementById('result-text');
  const resultTitle = document.getElementById('result-title');
  const generateBtn = document.getElementById('generate-btn');
  const loader = document.getElementById('loader');
  const copyBtn = document.getElementById('copy-btn');

  let currentMode = 'safari';

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.dataset.mode;
    });
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = queryInput.value.trim();
    if (!query) {
      alert("Please describe what you're looking for ✨");
      return;
    }

    // UI loading state
    generateBtn.disabled = true;
    loader.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    // Mock AI response (super smart placeholders — replace with real Gemini later)
    await new Promise(r => setTimeout(r, 1200)); // simulate thinking

    let response = '';
    if (currentMode === 'safari') {
      response = `🌿 Safari Draft for you:\n\n• Dates: Flexible in the next 90 days\n• Highlight: Private gorilla tracking in Bwindi + Murchison boat safari\n• Group size: ${query.includes('group') ? 'Tailored to your party' : '2–6 guests recommended'}\n• Luxury touch: Stay at our partner lodge with private chef & sundowner on the Nile\n\nWould you like me to refine dates, add pricing, or include trade add-on?`;
    } else {
      response = `📦 Trade Draft:\n\n• Commodity focus: ${query.toLowerCase().includes('coffee') ? 'Specialty Arabica/Robusta' : 'Your requested goods'}\n• Direct source → UAE logistics in 18–25 days\n• 100% verified, blockchain-tracked batches\n• MOQ flexible for first shipment\n\nNext step: Shall I draft the formal proposal + pricing sheet?`;
    }

    resultTitle.textContent = currentMode === 'safari' ? 'Your Safari Draft' : 'Your Trade Proposal';
    resultText.textContent = response;
    resultDiv.classList.remove('hidden');

    // Reset UI
    generateBtn.disabled = false;
    loader.classList.add('hidden');
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultText.textContent);
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
  });
});