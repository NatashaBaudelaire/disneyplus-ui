# Deployment Guide - Vercel

This guide explains how to deploy the Disney Plus UI project to Vercel.

## Prerequisites

- GitHub account with the project repository
- Vercel account (free tier available)
- TMDB API key (already configured in project)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in or create an account
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Connect your GitHub account
   - Select the `disneyplusui` repository

2. **Configure Project Settings**
   - **Project Name**: `disney-plus-ui` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty (root directory)

3. **Environment Variables**
   - Add environment variable:
     - Name: `TMDB_API_KEY`
     - Value: Your TMDB API key from `.env` file
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - Your site will be live at `https://disney-plus-ui.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd C:\Users\natas\Downloads\disney-plus-ui
   vercel
   ```

4. **Follow Prompts**
   - Set project name
   - Link to existing project (if you have one)
   - Add environment variable when prompted
   - Confirm deployment

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Configuration Files

### vercel.json
- Configures routing and security headers
- Sets up cache policies
- Enables custom headers for security

### package.json
- Contains project metadata
- Defines keywords for discoverability
- Includes repository information

## Environment Variables

### Required Environment Variable

| Variable | Description | Where to Get |
|-----------|-------------|--------------|
| `TMDB_API_KEY` | Your TMDB API key | [TMDB Settings](https://www.themoviedb.org/settings/api) |

### Adding Environment Variables in Vercel

1. Go to Project Settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add `TMDB_API_KEY` with your API key
4. Save and redeploy

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test login functionality
- [ ] Check movie/TV show images load in 4K quality
- [ ] Verify trailers play correctly
- [ ] Test responsive design on mobile
- [ ] Check console for errors
- [ ] Verify API key is working (movies load correctly)

## Custom Domain (Optional)

### Setting Up Custom Domain

1. Go to Project Settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `disney.yourdomain.com`)
4. Configure DNS records as instructed by Vercel
5. Wait for SSL certificate provisioning

## Automatic Deployments

Vercel automatically deploys when you:
- Push to the main branch
- Push to any connected branch
- Open a pull request

## Troubleshooting

### Build Failures

If deployment fails:
1. Check Vercel deployment logs
2. Verify `vercel.json` syntax is correct
3. Ensure all files are committed to Git
4. Check environment variables are set

### API Key Issues

If movies don't load:
1. Verify `TMDB_API_KEY` is set in Vercel environment variables
2. Check the API key is valid and active
3. Review Vercel logs for API errors

### Images Not Loading

If images appear broken:
1. Check TMDB API quota
2. Verify internet connectivity
3. Check browser console for errors
4. Ensure `image.tmdb.org` is not blocked

## Performance Optimization

Vercel automatically:
- Optimizes images
- Enables CDN distribution
- Implements caching
- Provides HTTPS/SSL
- Handles edge routing

## Monitoring

Vercel provides:
- Real-time logs
- Analytics dashboard
- Performance metrics
- Error tracking
- Uptime monitoring

## Rollback

If deployment causes issues:
1. Go to Deployments in Vercel Dashboard
2. Select a previous successful deployment
3. Click "Rollback"
4. Confirm rollback

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

For project-specific issues:
- Open an issue on GitHub
- Check the README for troubleshooting tips
