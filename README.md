# DentIndia

A dental clinic directory for India. Built with Next.js 14 App Router + Tailwind CSS.

## Stack
- **Framework**: Next.js 14 (App Router, Static Generation)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Fonts**: Playfair Display (display) + DM Sans (body) via next/font/google
- **Deployment**: Vercel

## Pages
- `/` — Home: all onboarded clinics in a card grid with city filter
- `/clinic/[id]` — Clinic profile: doctor bio, services with INR pricing, contact/booking CTAs

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — GitHub
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo → Vercel auto-detects Next.js
4. Click **Deploy** — done in ~60 seconds

## Adding a New Clinic

Edit `lib/data.ts` and add a new object to the `CLINICS` array. The page is statically generated at build time via `generateStaticParams`, so it will auto-generate a new `/clinic/[id]` page on next deploy.

## Project Structure

```
app/
  page.tsx              # Home page — clinic listing
  layout.tsx            # Root layout with Navbar + footer
  globals.css           # Tailwind + custom animations
  not-found.tsx         # 404 page
  clinic/
    [id]/
      page.tsx          # Individual clinic profile page

components/
  Navbar.tsx            # Responsive sticky navbar
  ClinicCard.tsx        # Card used on home grid
  ServiceCard.tsx       # Service tile used on clinic page

lib/
  data.ts               # All clinic data + types
```
