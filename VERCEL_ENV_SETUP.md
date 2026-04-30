# Vercel Environment Variables Setup

The production deployment failed because environment variables are not set in Vercel.

## ⚠️ Action Required

You must add these environment variables to your Vercel project:

### Steps:
1. Go to https://vercel.com/dashboard
2. Select the **dental-india** project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qudrulrknngrqndnjcnb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZHJ1bHJrbm5ncnFuZG5qY25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjQ0MzgsImV4cCI6MjA5MzA0MDQzOH0.Nbuowx06OscHr1Jl_3E_RBLt9nJQY8qfye9kBtViiwI` |

5. Click **Save** for each variable
6. Vercel will automatically redeploy with the new environment variables

### Deployment Options:
- **Automatic**: The deployment will trigger automatically after adding env vars
- **Manual**: Go to **Deployments** and click the **Redeploy** button on the latest deployment

## How to Find Your Variables

If you need to find these values:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your project URL from Supabase dashboard
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: From Supabase dashboard → Settings → API → Project API keys (anon/public key)

## Security Note

These are public environment variables (prefixed with `NEXT_PUBLIC_`), so they're safe to add to Vercel.
Never commit `.env.local` to git - it contains sensitive information.

---

Once the environment variables are set, the application will:
- ✅ Connect to Supabase database
- ✅ Load all clinic data
- ✅ Enable admin panel functionality
- ✅ Persist bookings and clinic changes
