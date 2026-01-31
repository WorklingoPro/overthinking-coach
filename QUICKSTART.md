# Quick Start Guide

Get the Overthinking → Action Coach PWA running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Claude API key from Anthropic (get at https://console.anthropic.com/)
- Terminal/command line access

## Step 1: Install Dependencies

```bash
# Clone or download the project
cd overthinking-coach

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Configure Environment Variables

**Backend** - Create `backend/.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PORT=3001
NODE_ENV=development
```

**Frontend** - Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001
```

## Step 3: Start Development Servers

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

## Step 4: Test the App

1. Open http://localhost:5173 in your browser
2. Select a language from the dropdown
3. Enter a test prompt (see TEST_EXAMPLES.md)
4. Click "Get Clarity"
5. View your AI-powered coaching response!

## Common Issues

**"API key not found"**
- Make sure `.env` file exists in `backend/` folder
- Check the API key is correct
- Restart the backend server

**"Cannot connect to API"**
- Make sure backend is running on port 3001
- Check `VITE_API_URL` in frontend/.env
- Check for CORS errors in browser console

**"Module not found"**
- Run `npm install` in both backend and frontend directories
- Delete node_modules and reinstall if issues persist

**PWA not installing**
- PWA only installs on HTTPS (except localhost)
- Check manifest.json is accessible
- Generate icons (see frontend/public/icons/GENERATE_ICONS.md)

## Next Steps

1. **Test all languages** - Try inputs in all 6 supported languages
2. **Test timer** - Use the 5-minute focus timer
3. **Test offline** - Turn off WiFi and check cached data
4. **Customize design** - Edit colors in tailwind.config.js
5. **Deploy** - See README.md for deployment instructions

## Development Tips

- **Hot reload** - Both frontend and backend support auto-reload
- **API logs** - Check Terminal 1 for backend logs
- **React DevTools** - Install browser extension for debugging
- **Test API directly**:
  ```bash
  curl -X POST http://localhost:3001/api/coach \
    -H "Content-Type: application/json" \
    -d '{"userInput":"test","language":"en"}'
  ```

## Production Checklist

Before deploying to production:

- [ ] Generate proper PWA icons
- [ ] Set production API URL in Vercel
- [ ] Add real privacy policy and terms
- [ ] Test on multiple devices
- [ ] Test all 6 languages
- [ ] Set up error tracking (Sentry recommended)
- [ ] Add analytics if needed (Google Analytics, Plausible)
- [ ] Configure custom domain
- [ ] Test PWA installation on mobile
- [ ] Set up monitoring for API usage

## Resources

- [Claude API Docs](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel Deployment](https://vercel.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## Support

For issues or questions:
1. Check TEST_EXAMPLES.md for testing guidance
2. Review README.md for detailed documentation
3. Check browser console for errors
4. Verify all environment variables are set

Happy coaching! 🚀
