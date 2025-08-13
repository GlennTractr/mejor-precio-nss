## High‑impact suggestions for this project

These suggestions are tailored to your current Next.js 15 + Supabase + Typesense setup. They’re grouped by theme and include small code examples where useful.

### 1) Environment variables and configuration

- **Validate env with Zod at build/startup**: Avoid String(process.env.X) which can turn undefined into "undefined". Fail fast and provide types.

```ts
// src/lib/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_BASE_KEY: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('es'),
  NEXT_PUBLIC_ACCEPTED_LOCALES: z.string().default('es,en,fr'),
  NEXT_PUBLIC_SITE_TITLE: z.string().default('PapásListos'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(''),
});

let cached: z.infer<typeof EnvSchema> | null = null;
export const env = () => {
  if (!cached) cached = EnvSchema.parse(process.env);
  return cached;
};
export const getAcceptedLocales = () =>
  env()
    .NEXT_PUBLIC_ACCEPTED_LOCALES.split(',')
    .map(s => s.trim());
```

- **Avoid injecting all env via next.config.ts when not needed**: You already use `NEXT_PUBLIC_` which is exposed to the client. For server-only secrets, keep them server-side and do not expose via `nextConfig.env`.
- **Guard image domains**: If `NEXT_PUBLIC_SUPABASE_URL` is empty, `.replace` works but consider an explicit check and a fallback to avoid accidental empty domain.

### 2) Middleware and auth

- **Matcher hardening**: Exclude more asset paths and health checks to reduce overhead, e.g. `/public/`, `/api/health`, and `/(.*)\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$`.
- **Auth paths**: You redirect logged-in users away from `/auth`. Consider allowing `/auth/logout` even when logged-in or move logout out of `/auth`.
- **Role‑based access**: If you introduce roles (your migrations suggest roles/RLS), centralize checks in helpers and use middleware for coarse filtering and server actions for fine-grained checks.

### 3) React Query setup and SSR hydration

- **Stable QueryClient**: Create it once per browser session to preserve cache between route transitions.

```tsx
// src/components/react-query-provider.tsx
'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

- **Devtools (dev‑only)**: Mount `ReactQueryDevtools` behind `process.env.NODE_ENV !== 'production'`.

### 4) i18n and SEO

- **Locale negotiation**: If not already, prefer `Accept-Language` as a fallback when no cookie is set.
- **SEO metadata**: Add `alternates`, canonical URLs, and Open Graph images per route; ensure localized `og:locale`/`hreflang`.

```ts
// Example in a page or shared metadata helper
export const generateMetadata = async (): Promise<Metadata> => ({
  alternates: { canonical: '/', languages: { 'es-MX': '/es', en: '/en', fr: '/fr' } },
  openGraph: { images: [{ url: '/og/home.png', width: 1200, height: 630 }] },
});
```

- **Surface sitemap/robots**: You have `src/app/robots.ts` and `src/app/sitemap.ts` untracked. Commit and validate them. Ensure URLs honor `NEXT_PUBLIC_SITE_URL`.

### 5) Cypress: remove duplicate configs and enhance DX

- **Single config**: You have `cypress.config.ts` at root and `src/cypress.config.ts`. Remove the one in `src/` to avoid confusion.
- **Test data/env**: Keep `.env.test` minimal; inject only required vars. Consider seeding ephemeral data via Supabase SQL before tests.
- **Add useful commands**: You already have `cypress/support/commands.ts`. Add helpers for auth (e.g., programmatic login via Supabase API) to speed up E2E.

### 6) API and caching

- **Route handlers caching**: For search endpoints (`src/app/api/typesense/**/route.ts`), set explicit caching semantics: `export const dynamic = 'force-dynamic'` or use `revalidate` where beneficial. Add `Cache-Control` headers for computed lists to reduce cold starts.
- **Edge runtime**: Consider `export const runtime = 'edge'` for latency‑sensitive, stateless endpoints (Typesense queries) if no Node APIs are used.
- **Error surfaces**: Wrap Typesense calls with clear error mapping for the UI (timeout vs no results vs validation error).

### 7) Performance and UX

- **Font strategy**: Add `display: 'swap'` (or `fallback` fonts) to `next/font/local` to improve CLS.
- **Images**: Ensure all external images are covered by `images.remotePatterns` or `images.domains`. Preload hero images and critical CSS.
- **Pagination**: Current custom pagination works; consider keyboard accessibility and ARIA (`aria-current="page"`).
- **A11y**: Audit color contrast for the `primary/secondary` palette, add visible focus states, and ensure components convey state to screen readers.

### 8) Linting, formatting, and pre‑commit

- **Stricter ESLint**: Enable React Query plugin rules you already depend on (`@tanstack/eslint-plugin-query`) and import sorting.
- **Pre‑commit hooks**: Add Husky + lint-staged to run `typecheck`, `lint`, and `format` on changed files.

```json
// package.json (scripts + devDeps)
"scripts": {
  "prepare": "husky",
  "check": "npm run typecheck && npm run lint",
  "format": "prettier --write ."
}
```

### 9) CI/CD

- **GitHub Actions**: Add workflows for PR validation: install, typecheck, lint, unit tests, build, Storybook build. Optionally add a Cypress job using `start-server-and-test`.
- **Chromatic**: You already have `@chromatic-com/storybook`. Add a `chromatic` script and a CI step to publish previews on PRs.

### 10) Security and headers

- **Security headers**: Add a `headers()` export in `next.config.ts` to set CSP, `X-Frame-Options`, `Referrer-Policy`, etc. Start with a report‑only CSP and tighten gradually.
- **Auth tokens**: Confirm no service role key leaks to the client. You currently use `BASE_KEY = ANON_KEY` which is good; keep service role only on the server if ever needed.

### 11) Observability

- **Error tracking**: Add Sentry (or similar) for both server and client. Tag Typesense requests for better triage.
- **Web vitals**: Implement `reportWebVitals` to ship vitals to an analytics endpoint.

### 12) Data and typing

- **Typesense response types**: Create typed wrappers for search results to ensure UI components don’t rely on `any` fields.
- **Narrowed props**: Components like `ProductListFiltered` can accept a single `filters` object to reduce prop drilling and make future additions easier.

### 13) Documentation

- **README tweaks**: Add a short architecture diagram, env var table, and a "common tasks" section (seed data, run e2e, generate DB types).
- **Contributing guide**: Document commit conventions, branch strategy, and PR checklist.

### 14) PWA (optional)

- **Add PWA**: Manifest, service worker for offline caching of static assets and basic pages. Helpful for mobile users comparing prices in stores.

### 15) Cleanup

- **Remove dead files**: Delete `src/cypress.config.ts` and any unused boilerplate imports.
- **Track untracked important files**: `src/app/robots.ts`, `src/app/sitemap.ts` should be committed and covered by tests or checks.

---

If you want, I can implement a subset of these now: fix env validation, stabilize React Query client, remove duplicate Cypress config, and add basic security headers + CI skeleton.

### 16) Category page and Typesense: targeted suggestions

- **Do not expose an admin key in the browser**: `src/lib/typesense-client.ts` uses `NEXT_PUBLIC_TYPESENSE_ADMIN_API_KEY`. Replace with a search‑only key on the client. For the server/API routes, use the official Typesense Node client with a server key stored in non‑public env (no `NEXT_PUBLIC_`). Prefer issuing short‑lived scoped search keys from the server when the client needs dynamic filters.

```ts
// server-only Typesense client (e.g., src/lib/typesense-server.ts)
import Typesense from 'typesense';
import { env } from '@/lib/env';

export const typesenseServer = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST!,
      port: parseInt(process.env.TYPESENSE_PORT || '443'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_SERVER_API_KEY!, // NOT exposed to the client
  connectionTimeoutSeconds: 2,
});
```

- **Consolidate multiple facet requests using Multi-Search**: Your search and filters routes perform several sequential searches (including N queries for each `specs.type`). Use Typesense Multi‑Search to batch them into one round‑trip, significantly reducing latency.

```ts
// Example in API route: batch search + disjunctive facets
const base = {
  collection: 'product',
  q: query,
  query_by: 'title,brand,model',
};

const { results } = await typesenseServer.multiSearch.perform({
  searches: [
    // 1) Main search with user filters
    {
      ...base,
      filter_by,
      page,
      per_page,
      sort_by,
      facet_by: 'brand,model,specs.type,specs.label',
      max_facet_values: 100,
    },
    // 2) Unfiltered (or category-only) facets for brand/model
    {
      ...base,
      q: '*',
      filter_by: categorySlug ? `category_slug:=${categorySlug}` : '',
      per_page: 0,
      facet_by: 'brand,model',
    },
    // 3..n) For each specs.type, get its labels (disjunctive faceting)
    ...specTypes.map(type => ({
      ...base,
      q: '*',
      per_page: 0,
      facet_by: 'specs.label',
      filter_by: `${categoryFilter} && specs.type:=${type}`,
    })),
  ],
});
```

- **Build `filter_by` safely**: Avoid string `includes('category_slug')`/manual `split('&&')`. Compose filters from structured inputs, skipping empty parts. Ensure values with spaces are quoted.

```ts
function buildFilter(filters: Array<string | undefined>) {
  return filters.filter(Boolean).join(' && ');
}

const categoryFilter = categorySlug ? `category_slug:=${JSON.stringify(categorySlug)}` : undefined;
const specFilters = selectedSpecs.map(
  s => `specs.type:=${JSON.stringify(s.type)} && specs.label:=${JSON.stringify(s.label)}`
);
const finalFilter = buildFilter([categoryFilter, ...specFilters, extraFilterBy]);
```

- **Prefer facet stats for numeric ranges**: For price, request `facet_by=best_price_per_unit` with `per_page=0` and read `facet_stats`. You already do this in places; make it consistent across routes and the category page initial load.

- **Schema hygiene for fast faceting**: Ensure `product` schema sets `facet: true` on `brand`, `model`, `specs.type`, `specs.label`, and `best_price_per_unit` and `sortable: true` where needed (`best_price_per_unit`). Add `index: true` (where relevant) and verify `token_separators`/`symbols_to_index` to improve Spanish strings and brand names.

- **Use the server client in server components**: In `categoria/[category_slug]/page.tsx`, avoid importing `@supabase/supabase-js` directly with public keys. Use your `createServerClient` helper consistently. Likewise, use the server Typesense client for SSR/route handlers and keep the instantsearch adapter for client UI only.

- **Edge runtime and caching**: For Typesense routes, set `runtime = 'edge'` if Node APIs aren’t used to reduce latency, and add short TTL caching headers for facets that don’t change per user. For search results, keep them dynamic but add `stale-while-revalidate`.

```ts
// In route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
// set headers on Response: Cache-Control: public, max-age=0, s-maxage=30, stale-while-revalidate=300
```

- **Query validation**: Add Zod validation for `page`, `per_page`, `sort_by`, and filter payloads to prevent malformed Typesense queries and to bound resource usage (e.g., max `per_page`).

```ts
const QuerySchema = z.object({
  q: z.string().default('*'),
  page: z.coerce.number().int().min(1).max(100).default(1),
  per_page: z.coerce.number().int().min(1).max(60).default(20),
  sort_by: z
    .enum(['best_price_per_unit:asc', 'best_price_per_unit:desc'])
    .default('best_price_per_unit:asc'),
});
```

- **Synonyms/typo tuning**: Add brand/model synonyms and adjust `num_typos`, `prefix` and `drop_tokens_threshold` to improve recall for Spanish variants and common typos. Consider a `synonyms` collection in Typesense and load at deploy time.

- **Spec label explosion control**: If some spec types have many labels, cap with `max_facet_values` and provide a “more” UI. For counts, rely on disjunctive faceting with batched multi-search instead of per-type sequential calls to keep latency predictable.

- **Security with scoped keys (client search)**: When exposing search on the client, generate a scoped search key server-side with an `expires_at` and an enforced `filter_by=category_slug:=<slug>` to prevent users from removing server-enforced filters.
