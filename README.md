# LUMÉ — iPhone Photography Mastery

Premium direct-response sales funnel for the LUMÉ iPhone photography course.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Stripe

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Stripe keys in .env.local

# Run development server
npm run dev
```

Open http://localhost:3000 to view the site.

## Environment Variables

| Variable | Description | Where |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Client + Server |
| `STRIPE_SECRET_KEY` | Stripe secret key | Server only |
| `NEXT_PUBLIC_SITE_URL` | Site URL for redirects | Client + Server |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — 7 sections + sticky nav + footer |
| `/checkout` | Checkout with Stripe PaymentElement |
| `/success` | Post-purchase welcome + upsell |
| `/privacy` | Privacy policy (placeholder) |
| `/terms` | Terms of service (placeholder) |
| `/api/create-payment-intent` | Stripe PaymentIntent creation |

## Placeholder Map

All placeholders use the `[[BRACKET]]` convention and are visually marked with dashed borders and crosshair cursors.

### Images

| Placeholder | File | Dimensions | Description |
|---|---|---|---|
| `[[HERO_IMAGE]]` | `src/components/sections/Hero.tsx` | 900 x 1200px | Hero portrait — the most striking iPhone photo available |
| `[[HERO_IMAGE_ALT]]` | `src/components/sections/Hero.tsx` | — | Alt text for hero image |
| `[[BEFORE_1]]` / `[[AFTER_1]]` | `src/components/sections/Transformation.tsx` | 600 x 800px | Before/after pair 1 |
| `[[BEFORE_2]]` / `[[AFTER_2]]` | `src/components/sections/Transformation.tsx` | 600 x 800px | Before/after pair 2 |
| `[[BEFORE_3]]` / `[[AFTER_3]]` | `src/components/sections/Transformation.tsx` | 600 x 800px | Before/after pair 3 |
| `[[INSTRUCTOR_PHOTO]]` | `src/components/sections/Instructor.tsx` | 600 x 800px | Instructor portrait, natural light |
| `[[INSTRUCTOR_PHOTO_ALT]]` | `src/components/sections/Instructor.tsx` | — | Alt text for instructor photo |
| `[[LOGO]]` | `src/components/sections/Footer.tsx` | 32 x 32px | Logo mark |

### Text

| Placeholder | File | Description |
|---|---|---|
| `[Elias]` | `Instructor.tsx`, `SuccessContent.tsx` | Instructor's name |
| `[[INSTRUCTOR_BIO]]` | `Instructor.tsx` | 2-3 sentence instructor biography |
| `[[STUDENT_COUNT]]` | `Instructor.tsx` | Number of students enrolled |
| `[[FIVE_STAR_COUNT]]` | `Instructor.tsx` | Number of five-star reviews |
| `[[INSTAGRAM_HANDLE]]` | `Instructor.tsx`, `SuccessContent.tsx` | Instagram handle (without @) |
| `[[TESTIMONIAL_1]]` through `[[TESTIMONIAL_5]]` | `src/data/testimonials.ts` | Replace seed testimonials with real ones |
| `[[PRIVACY_POLICY_CONTENT]]` | `src/app/privacy/page.tsx` | Full privacy policy text |
| `[[TERMS_OF_SERVICE_CONTENT]]` | `src/app/terms/page.tsx` | Full terms of service text |
| `[[UPSELL_PAYMENT_LINK]]` | `SuccessContent.tsx` | Stripe Payment Link for 1:1 coaching upsell |
| `[[YEAR]]` | `Footer.tsx` | Auto-generated from `new Date().getFullYear()` |

## Project Structure

```
src/
  app/               # App Router pages and API routes
  components/
    ui/              # Primitive components (Button, SectionLabel, Placeholder, Divider, Badge)
    sections/        # Landing page sections
    checkout/        # Stripe checkout components
  data/              # Static content (modules, FAQs, testimonials, includes)
  lib/               # Utilities (cn, motion variants)
  types/             # TypeScript interfaces
```

## Deployment

Optimized for Vercel. Set environment variables in the Vercel dashboard.

```bash
npm run build
```
