# Google Analytics Setup Guide

Google Analytics has been integrated into your Dentobook application.

## Local Development Setup

1. **Get your Google Analytics Measurement ID:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property or use an existing one
   - Navigate to: Admin → Data Streams → Web
   - Copy your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Restart your dev server** to load the new environment variable

## Vercel Production Setup

Run this command to add the environment variable to all Vercel environments:

```bash
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
```

When prompted:
- Enter your Measurement ID (e.g., `G-XXXXXXXXXX`)
- Select: **Production, Preview, and Development**

Or add it via the Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your Measurement ID
4. Select all environments (Production, Preview, Development)
5. Save and redeploy

## What's Tracking

The implementation automatically tracks:
- Page views
- User sessions
- Basic engagement metrics

## Files Modified

- `components/GoogleAnalytics.tsx` - Google Analytics component
- `app/layout.tsx` - Integrated GA into root layout
- `.env.local` - Added environment variable placeholder

## Verification

After deployment, verify tracking is working:
1. Visit your deployed site
2. Go to Google Analytics → Reports → Realtime
3. You should see your visit appear within seconds
