# Deployment Guide

Complete guide to deploy the Overthinking → Action Coach PWA to production.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Advantages:**
- Automatic HTTPS
- Zero-config deployments
- Serverless functions built-in
- Free tier available
- Automatic CI/CD

**Steps:**

1. **Prepare Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   # Create repo on github.com first
   git remote add origin https://github.com/yourusername/overthinking-coach.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy
   vercel

   # Follow prompts:
   # - Link to existing project? No
   # - Project name: overthinking-coach
   # - Directory: ./ (root)
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     ANTHROPIC_API_KEY=sk-ant-api03-your-production-key
     VITE_API_URL=https://your-app-name.vercel.app
     ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

6. **Custom Domain (Optional)**
   - Vercel Dashboard → Domains
   - Add your domain
   - Update DNS records as instructed

### Option 2: Netlify + Railway

**Frontend on Netlify:**

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add `VITE_API_URL` pointing to Railway backend

**Backend on Railway:**

1. **Create Railway Project**
   - Go to railway.app
   - New Project → Deploy from GitHub
   - Select your repository

2. **Configure**
   - Add `ANTHROPIC_API_KEY` in Variables tab
   - Set start command: `cd backend && npm start`

3. **Get Railway URL**
   - Copy the generated URL
   - Update `VITE_API_URL` in Netlify

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

**Requirements:**
- Ubuntu 22.04 server
- Domain name pointed to server
- SSH access

**Setup:**

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

3. **Clone and Build**
   ```bash
   git clone https://github.com/yourusername/overthinking-coach.git
   cd overthinking-coach

   # Backend
   cd backend
   npm install
   echo "ANTHROPIC_API_KEY=your_key" > .env
   pm2 start api/coach.js --name overthinking-api

   # Frontend
   cd ../frontend
   npm install
   echo "VITE_API_URL=https://yourdomain.com" > .env
   npm run build
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/overthinking-coach
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       # Frontend
       location / {
           root /path/to/overthinking-coach/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/overthinking-coach /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Post-Deployment Checklist

### Essential
- [ ] HTTPS working correctly
- [ ] API endpoint responding (test /api/health)
- [ ] All 6 languages tested
- [ ] PWA installs correctly on mobile
- [ ] Icons displaying properly
- [ ] Service worker registered
- [ ] Environment variables set correctly

### Optional
- [ ] Custom domain configured
- [ ] Analytics added (Google Analytics, Plausible)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] CDN configured for assets
- [ ] Backup strategy in place

## Performance Optimization

1. **Image Optimization**
   - Use WebP format for icons
   - Compress all images
   - Use appropriate sizes

2. **Code Splitting**
   - Already configured in vite.config.js
   - Verify bundle sizes: `npm run build -- --report`

3. **Caching Strategy**
   - Service worker caches static assets
   - API responses cached for 24h
   - Adjust in vite.config.js if needed

4. **CDN (Optional)**
   - Cloudflare free tier works well
   - Configure for static assets only
   - Keep API direct to origin

## Monitoring & Maintenance

### 1. Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/react

# Add to frontend/src/main.jsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 2. Analytics with Plausible (Privacy-friendly)

```html
<!-- Add to index.html -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 3. Uptime Monitoring

Free options:
- UptimeRobot (uptimerobot.com)
- Ping-o-matic
- Freshping

Monitor:
- Homepage (/)
- API health (/api/health)
- Set up alerts for downtime

### 4. Log Management

**Vercel:**
- Built-in logs in dashboard
- 1000 requests/day on free tier

**Railway:**
- Real-time logs in dashboard
- Download historical logs

**VPS:**
```bash
# View PM2 logs
pm2 logs overthinking-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Best Practices

1. **API Key Protection**
   - Never commit .env files
   - Rotate keys periodically
   - Use different keys for dev/prod

2. **Rate Limiting** (Future implementation)
   ```javascript
   // Backend: Add express-rate-limit
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

3. **CORS Configuration**
   - Update ALLOWED_ORIGINS in production
   - Don't use wildcard (*) in production

4. **Headers Security**
   ```javascript
   // Add helmet.js to backend
   import helmet from 'helmet';
   app.use(helmet());
   ```

## Scaling Considerations

### Current Limits (Free Tiers)
- Vercel: 100GB bandwidth/month
- Anthropic API: Rate limits apply
- No database (localStorage only)

### When to Upgrade

**Add Database When:**
- Need user authentication
- Want to track usage across devices
- Need analytics on user behavior
- Implement subscription tracking

**Scale Backend When:**
- API response times > 3 seconds
- Rate limiting hits frequently
- Need more than 100K requests/month

**Recommended Upgrade Path:**
1. Add Supabase (free tier: 500MB database)
2. Implement user auth
3. Add Stripe subscriptions
4. Scale Vercel to Pro if needed ($20/month)

## Troubleshooting Deployment

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API not accessible:**
- Check CORS settings
- Verify environment variables
- Check serverless function logs
- Test API endpoint directly with curl

**PWA not installing:**
- Verify HTTPS is working
- Check manifest.json loads correctly
- Ensure icons exist and are correct sizes
- Test on different browsers

**Slow performance:**
- Check bundle size: `npm run build -- --report`
- Enable compression in Nginx/Vercel
- Optimize images
- Check API response times

## Costs Estimate

**MVP (Free Tier):**
- Vercel: $0/month (up to 100GB bandwidth)
- Anthropic API: Pay per use (~$0.01-0.10 per session)
- Domain: $10-15/year (optional)

**With Auth & Database:**
- Supabase: $0/month (free tier)
- Stripe: 2.9% + $0.30 per transaction
- Everything else: Same as MVP

**Scaled (1000 users/month):**
- Vercel Pro: $20/month
- Anthropic API: ~$50-100/month
- Supabase: $25/month (Pro tier)
- Total: ~$95-145/month

## Support

After deployment, users may contact you. Set up:
- Support email: support@yourdomain.com
- Basic FAQ page
- Link to GitHub issues for bug reports

Good luck with your launch! 🚀
