# Deployment Guide

## Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (connect with GitHub)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Greenely prototypes"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/greenely-prototyping.git

# Push to main branch
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Step 3: Configure Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Environment Variables

Currently, no environment variables are required. The app uses the public electricity price API.

If you need to add environment variables in the future:

1. Go to Project Settings > Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy

### Mobile Testing URLs

After deployment, you'll get:
- Production URL: `https://your-project.vercel.app`
- Preview URLs for each branch/PR

Share these URLs with testers for mobile testing.

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or PRs

### Performance Optimization

The app is already configured with:
- Static page generation for all routes
- Image optimization (AVIF, WebP)
- Compression enabled
- Mobile-first responsive design
- Minimal JavaScript bundle size

### Monitoring

After deployment:
1. Check the "Analytics" tab for usage stats
2. Monitor "Speed Insights" for performance
3. Review "Logs" for any errors

### Sharing with Users

For mobile testing, share:
```
https://your-project.vercel.app
https://your-project.vercel.app/prototype-a
https://your-project.vercel.app/prototype-b
https://your-project.vercel.app/prototype-c
```

Users can also save these URLs to their home screen for app-like experience:
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Add to Home Screen

### Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Run `npm run build` locally to debug
- Ensure all dependencies are in package.json

**API not working:**
- The electricity API is public, no keys needed
- Check if API is accessible: `https://www.elprisetjustnu.se/api/v1/prices/2025/10-13_SE3.json`
- API might have CORS restrictions (not an issue for SSR)

**Mobile display issues:**
- Test on actual devices, not just browser dev tools
- Check viewport meta tag in layout.tsx
- Verify max-width constraint (448px) is working

### Rolling Back

If you need to rollback:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

