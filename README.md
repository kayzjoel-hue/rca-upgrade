# 🌍 Royal Connect Africa

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Vercel account (free)
- Google Gemini API Key (free)

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"** → **"Create API key in new project"**
3. Copy the key (looks like: `AIz...`)
4. Save it somewhere safe

### Step 2: Run Locally First

```bash
# 1. Install dependencies
npm install

# 2. Create a local env file
copy .env.example .env

# 3. Open .env and replace the placeholder with your new real key
# GEMINI_API_KEY=your_new_real_key_here

# 4. Start the local server
npm run dev
```

Write the new key in `C:\Users\X1 CARBON\Desktop\RCA\rca-upgrade\.env` on the line:

```env
GEMINI_API_KEY=your_new_real_key_here
```

Then open `http://localhost:3001` and test the AI Concierge before deploying.

### Step 3: Deploy to Vercel

#### Option A: Via GitHub + Vercel (Recommended)
```bash
# 1. Push code to GitHub
git add .
git commit -m "feat: Gemini AI Concierge + complete setup"
git push origin main

# 2. Go to vercel.com
# 3. Click "Add New Project"
# 4. Import GitHub repo: kayzjoel-hue/rca-upgrade
# 5. Click "Deploy"
```

#### Option B: Via Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# Follow prompts, accept defaults
```

### Step 4: Add API Key to Vercel

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (paste your API key from Step 1)
   - **Environments:** Production, Preview, Development
3. Click **"Save"**
4. **Redeploy** (Deployments → click latest → **Redeploy**)

### Step 5: Test

1. Go to your deployed site (e.g., `https://rca-upgrade.vercel.app`)
2. Scroll to **"AI Concierge"** section
3. Select "Safari Planner" or "Trade Inquiry"
4. Enter a prompt
5. Click "Generate Draft"
6. ✅ If it works, you're done!

### Troubleshooting

**Q: AI returns "API key not configured"**
- A: Check Vercel env vars (Settings → Environment Variables)
- Redeploy after adding the key

**Q: "Method not allowed" error**
- A: Make sure you're using POST request
- Check browser console (F12) for details

**Q: API is slow**
- A: First request is slow (cold start). Subsequent are fast.
- Upgrade to paid Vercel if needed (but free tier is fine for hobby)

### Costs

**Google Gemini (Free Tier):**
- 60 requests per minute (RPM)
- 1,500 requests per day
- Free forever for testing

**Upgrade options:**
- Pay-as-you-go: ~$0.35 per 1M input tokens, $1.05 per 1M output tokens
- Example: 100 requests/day = ~$5/month

**Vercel (Free Tier):**
- 100 GB-hours serverless functions (plenty)
- 1,000 Function Invocations per day (free)
- Unlimited static assets

### File Structure

rca-upgrade/
├── index.html
├── api/
│   └── ai.js
├── public/
│   └── manifest.json
├── scripts/
│   └── main.js
├── styles/
│   └── main.css
├── server.js              (local Express server using the live AI handler)
├── .env.example
└── vercel.json

### Features

✅ **AI Concierge** - Powered by Gemini 1.5 Flash  
✅ **Safari Planning** - Bespoke itineraries  
✅ **Trade Inquiry** - B2B letter drafting  
✅ **Mobile Responsive** - Works on all devices  
✅ **Fast** - Static HTML + serverless API  
✅ **Shared Logic** - Local server and Vercel use the same AI handler  
✅ **Free Tier** - No recurring costs  

### Next Steps

1. **Add Images** - Replace placeholder assets in `/assets/`
2. **Custom Domain** - Go to Vercel → Domains → Add custom domain
3. **Analytics** - Add Google Analytics script (optional)
4. **Email Form** - Upgrade to SendGrid (optional)

### Support

- Vercel Docs: https://vercel.com/docs
- Gemini Docs: https://ai.google.dev/docs
- Issues: Create a GitHub issue

---

**Built with ❤️ by Kaizire Joel**
