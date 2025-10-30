# Quick Start Guide

## Local Development

### Start the development server:
```bash
npm run dev
```

Visit: `http://localhost:3000`

### View the prototypes:
- Landing page: `http://localhost:3000`
- Prototype A: `http://localhost:3000/prototype-a`
- Prototype B: `http://localhost:3000/prototype-b`
- Prototype C: `http://localhost:3000/prototype-c`

### Mobile testing on your phone:
1. Find your local IP: `ifconfig | grep inet` (look for 192.168.x.x)
2. Visit: `http://YOUR_IP:3000` on your phone
3. Make sure phone and computer are on same WiFi

## Deploy to Vercel (5 minutes)

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Using GitHub + Vercel Dashboard
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Click "Deploy"

Done! 🎉

## What You Get

### Three Prototypes:
1. **Prototype A**: Bar chart (colorful vertical bars)
2. **Prototype B**: Line chart (smooth curve with gradient)
3. **Prototype C**: Heatmap (block-based time grouping)

### Each prototype has:
- Home screen with price visualization
- Detail view with expanded information
- Real 15-minute electricity prices
- iOS-style navigation
- Mobile-optimized layout

### Shared components:
- Header (location + weather)
- Bottom navigation
- Power usage card
- Cost card
- EV charging card
- Battery level card

## Testing

### On desktop (Chrome DevTools):
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Refresh page

### On real devices:
1. Deploy to Vercel
2. Share the URL with testers
3. They can add to home screen for app-like experience

## Project Structure

```
/app
  /page.tsx              → Landing page
  /prototype-a           → Prototype A
  /prototype-b           → Prototype B
  /prototype-c           → Prototype C

/components
  /shared                → Reusable components
  /prototypes            → Prototype-specific components

/lib
  /electricity-api.ts    → API integration
```

## Customization

### Change region (default is SE3 - Stockholm):
Edit any component using the API:
```typescript
fetchTodaysPrices('SE1') // Northern Sweden
fetchTodaysPrices('SE2') // Central Sweden
fetchTodaysPrices('SE4') // Southern Sweden
```

### Change colors:
Edit `app/globals.css` - look for Figma Design Tokens section

### Add new components:
```bash
# ShadCN components
npx shadcn@latest add [component-name]
```

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Build fails?**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**API not loading?**
- Check internet connection
- API URL: `https://www.elprisetjustnu.se/api/v1/prices/2025/10-13_SE3.json`
- Verify date format is correct (YYYY/MM-DD)

## Resources

- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)
- ShadCN UI: [ui.shadcn.com](https://ui.shadcn.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)

## Support

For questions or issues, refer to:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment details
- `PROJECT_SUMMARY.md` - Implementation overview

---

**Happy Testing! 🚀**

