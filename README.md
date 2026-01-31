# Overthinking → Action Micro-Coach PWA

A multilingual, AI-powered Progressive Web App that helps users turn overthinking into immediate action in under 3 minutes.

## Features

- ✅ AI-powered overthinking analysis (Claude API)
- ✅ 6 languages: English, Swedish, Czech, Slovak, Russian, Ukrainian
- ✅ PWA with offline support
- ✅ Mobile-first, responsive design
- ✅ Dark mode toggle
- ✅ Timer functionality
- ✅ Copy-to-clipboard & share
- ✅ GDPR-ready (minimal data collection)
- 🔄 Stripe integration ready (not implemented)

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- PWA capabilities (service worker + manifest)

**Backend:**
- Node.js + Express
- Anthropic Claude API

**Deployment:**
- Frontend: Vercel/Netlify
- Backend: Vercel Serverless Functions

## Project Structure

```
overthinking-coach/
├── frontend/
│   ├── public/
│   │   ├── icons/          # PWA icons
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js           # Service worker
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── translations/   # Language files
│   │   ├── utils/          # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── api/
│   │   └── coach.js        # Serverless function
│   ├── prompts/            # AI prompts per language
│   ├── .env.example
│   └── package.json
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Claude API key from Anthropic

### 1. Clone and Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
ANTHROPIC_API_KEY=your_claude_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Testing the AI

The app uses Claude API with language-specific prompts. Test sessions:

**English:**
- Input: "I want to start a business but I keep researching instead of taking action"
- Expected: Action step, thought to ignore, reframing sentence

**Swedish:**
- Input: "Jag vill börja träna men jag vet inte vilken gym jag ska välja"

**Czech:**
- Input: "Chci změnit kariéru ale mám strach z neúspěchu"

## Production Deployment

### Deploy to Vercel (Recommended)

**1. Frontend + Backend (Monorepo):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel

# Set environment variables in Vercel dashboard:
# - ANTHROPIC_API_KEY
```

**vercel.json** (already included):
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "functions": {
    "backend/api/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**2. Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add `ANTHROPIC_API_KEY` (production value)

### Alternative: Separate Deployments

**Frontend (Netlify/Vercel):**
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

**Backend (Railway/Render):**
```bash
cd backend
# Deploy as Node.js app
# Set ANTHROPIC_API_KEY in dashboard
```

Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

## Adding New Languages

### 1. Add Translation File

Create `frontend/src/translations/your-language.js`:

```javascript
export const your_language = {
  code: 'xx',
  name: 'Your Language',
  ui: {
    title: 'Translated Title',
    placeholder: 'Translated placeholder...',
    // ... copy structure from en.js
  }
}
```

### 2. Add AI Prompt Template

Create `backend/prompts/your-language.js`:

```javascript
export const yourLanguagePrompt = (userInput) => `
You are a micro-coach helping someone overcome overthinking.

User's overthinking: ${userInput}

Respond in [Your Language] with:
1. ONE concrete next action (max 20 words)
2. ONE thought to ignore (max 15 words)
3. ONE grounding/reframe sentence (max 25 words)

Response format (JSON):
{
  "type": "fear|perfectionism|decision_overload|avoidance|rumination",
  "action": "concrete next step",
  "ignore": "specific thought to dismiss",
  "reframe": "grounding sentence"
}
`;
```

### 3. Register Language

**Frontend:** Add to `frontend/src/translations/index.js`
**Backend:** Add to `backend/prompts/index.js`

## Stripe Integration (Future)

### Where to Add Stripe

**1. Create subscription plans** (`backend/api/stripe-config.js`):
```javascript
// PLACEHOLDER - Add when ready
const plans = {
  basic: 'price_xxxxx', // Stripe price ID
  pro: 'price_xxxxx'
}
```

**2. Add checkout endpoint** (`backend/api/create-checkout.js`):
```javascript
// PLACEHOLDER - Vercel serverless function
// Create Stripe checkout session
// Return session URL
```

**3. Add webhook handler** (`backend/api/stripe-webhook.js`):
```javascript
// PLACEHOLDER
// Verify webhook signature
// Update user subscription status
// Store in database (add Supabase/Firebase)
```

**4. Frontend integration** (`frontend/src/components/PaymentModal.jsx`):
```javascript
// PLACEHOLDER component included
// Triggers Stripe checkout
// Handles success/cancel redirects
```

**Required Stripe Setup:**
1. Create Stripe account
2. Get publishable key → `VITE_STRIPE_PUBLIC_KEY`
3. Get secret key → `STRIPE_SECRET_KEY` (backend)
4. Create products and prices in Stripe dashboard
5. Set webhook endpoint in Stripe dashboard
6. Add webhook secret → `STRIPE_WEBHOOK_SECRET`

## User Authentication (Future)

Currently uses localStorage for session history (anonymous).

**To Add Auth:**
1. Use Supabase Auth or Firebase Auth
2. Update `frontend/src/services/auth.js` (placeholder included)
3. Store sessions in database instead of localStorage
4. Add user profiles for subscription tracking

## GDPR Compliance

Current implementation:
- No cookies (except service worker cache)
- No user tracking
- No personal data collection
- Sessions stored locally only

**When adding auth:**
- Add privacy policy page
- Add cookie consent banner
- Add data deletion endpoint
- Update terms of service

## PWA Features

- **Install prompt**: Automatic on mobile browsers
- **Offline mode**: Last session cached
- **Home screen icon**: Custom icon set
- **Splash screen**: Configured in manifest.json

**To customize PWA:**
1. Replace icons in `frontend/public/icons/`
2. Update `frontend/public/manifest.json`
3. Modify `frontend/public/sw.js` for caching strategy

## Performance Optimization

- Route-based code splitting
- Image optimization (when adding images)
- Service worker caching
- Lazy loading components
- Minified production build

## Troubleshooting

**API not responding:**
- Check ANTHROPIC_API_KEY is set correctly
- Verify API key has credits
- Check CORS settings (backend allows all origins in dev)

**PWA not installing:**
- Must be served over HTTPS (localhost exempt)
- Check manifest.json is valid
- Verify service worker registered

**Translations not working:**
- Check language code matches in translations/index.js
- Verify all UI keys exist in translation file

**Build errors:**
- Clear node_modules and reinstall
- Check Node version (18+ required)
- Verify all dependencies in package.json

## Credits

Built with:
- React + Vite
- Anthropic Claude API
- Tailwind CSS
- Framer Motion

## License

MIT License - See LICENSE file
