# YOU KNOW ME — Next.js Production Build

A production-ready conversion of the original vanilla HTML/CSS/JS site into
Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS.

## Stack

- **Next.js 15** (App Router, React Server Components where possible)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** — replaces the original `style.css`, same design tokens
- **Framer Motion** — scroll reveals, modal/drawer transitions, micro-interactions
- **Lenis** — smooth scroll
- **Lucide React** — icons (replacing emoji/inline SVG in the original)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run typecheck
```

> **Note on fonts:** the build fetches Bebas Neue and Inter from Google Fonts
> at build time via `next/font/google`. This requires network access during
> `npm run build`/`npm run dev`. If you're building in an offline or
> network-restricted environment, download the font files and switch to
> `next/font/local` in `app/layout.tsx`.

## Admin panel

Visit `/admin` and sign in with the demo password `ykm-admin-2026`
(set in `context/AdminContext.tsx` — change it before deploying).

- **Products tab** — every product with a live thumbnail, price, and stock
  count. Click **Add New Product** to create a brand-new listing from
  scratch (photo, name, price, category, description, specs, and starting
  stock) — this is how you add products in the future as your catalog
  grows. Click the pencil icon on any existing product to edit it, or the
  trash icon to remove it (asks for confirmation first).
- **Orders tab** — every order placed on the site: order ID, date/time,
  buyer name, buyer contact (email/phone from login), delivery address,
  the line items with quantities, and the total paid.
- Stock decrements automatically the moment an order is placed, and the
  shop/product pages immediately reflect out-of-stock / low-stock states.

> **Important — this is a client-only demo implementation.** Admin edits,
> stock, and orders are stored in the browser's `localStorage`, not a real
> database. That means: edits only apply on the device/browser where you
> made them, they won't sync across your customers' devices, and clearing
> browser data wipes them. It's genuinely useful for testing the full flow
> and for a single-operator/low-volume setup, but for a real multi-device
> production store you'll want to move `ProductsContext` and `AdminContext`
> behind a real backend (a database + API routes, e.g. Postgres +
> Next.js Route Handlers, or a service like Supabase). Happy to help wire
> that up when you're ready.

## Product history / purchase history

Signed-in shoppers see their own order history and recently viewed
products via the account icon in the navbar (email/phone login, no
password — see `context/AuthContext.tsx`). The admin Orders tab shows
every buyer's orders across the whole store.



```
app/                  Routes, layout, global styles, metadata, sitemap/robots
  layout.tsx           Root layout — fonts, SEO metadata, global chrome
  page.tsx             Homepage — composes all sections
  providers.tsx         Client context providers
  globals.css           Tailwind + base styles
  sitemap.ts / robots.ts
  icon.tsx              Generated favicon

components/
  Navbar, Hero, Marquee, Bio, Reviews, AboutVideos, Footer, ...
  shop/                Shop, ShopCard, ProductModal, CartDrawer

context/               CartContext, ToastContext, ProductModalContext, StatsContext
hooks/                 useLenis
lib/                   products.ts, content.ts (all site content/data)
types/                 Shared TypeScript interfaces
public/images/         Product photos + footer background
```

## What was preserved from the original site

- Exact color palette, typography (Bebas Neue / Inter), spacing, and layout
- Custom cursor, scroll progress bar, page loader, marquee, bio reveal
- Shop with category tabs, product cards, quick-view modal (specs, reviews,
  photo-upload review form, qty stepper, add-to-cart / buy-now)
- Cart drawer with live subtotal and checkout flow
- Toast notifications
- YouTube Shorts–style carousel with progress indicator
- Live-updating subscriber/view counters
- Animated social footer with scroll-triggered background reveal

## What was added per the conversion brief

- Dark theme is the only theme (site was already dark by design — see note below)
- Back-to-top button
- Responsive mobile navigation (hamburger menu)
- `next/image` optimization for every image (lazy-loaded, responsive `sizes`)
- Full SEO metadata, Open Graph + Twitter cards, generated favicon, sitemap.xml, robots.txt
- `prefers-reduced-motion` respected globally
- Strict TypeScript across all components and data

### On "dark mode support"

The original design is a single, intentional dark theme (near-black
background, orange accent) — there's no light variant in the source site.
Toggling to a light theme would materially redesign it, which conflicts with
"preserve the exact design." Tailwind's `darkMode: "class"` is wired up and
ready in `tailwind.config.ts` if you want to add a light theme later; ping me
and I can build the light-mode tokens.
