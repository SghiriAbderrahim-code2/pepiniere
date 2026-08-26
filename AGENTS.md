<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:pépinière-audit-log -->
# Project Audit Log — Pépinière (plant shop) Next.js app

## Stack & facts (verified)
- Next.js 16.2.6 (App Router, React 19.2.0), TypeScript, Tailwind 4.1.14.
- Supabase (`@supabase/supabase-js` 2.79.0, `@supabase/ssr` 0.7.0). No Prisma.
- Auth = Supabase magic-link (email OTP), NOT NextAuth. Session via `@supabase/ssr` cookie (`sb-<ref>-auth-token`). Service role key lives only in `.env.local` and is used server-side only.
- DB RLS: `profiles.role` ('admin'|'customer'); `is_admin()` SECURITY DEFINER; products visible to public when `visible=true`; writes restricted to admins; `slug` is `unique not null`. `product_images` table added (1:N, optional gallery).
- Middleware `matcher` excludes `/admin/login` and static assets so login + public pages render without an auth session.

## Guardrails learned
- `next.config.ts` needs `eslint.ignoreDuringBuilds: true` (env has no eslint config) to allow `npm run build`.
- `(dashboard)` route group + a `loading.tsx` inside it causes Next to render the loading shell on `notFound()`, producing a SOFT 404 (HTTP 200). Removed that `loading.tsx` so `notFound()` returns a real 404.
- App Router helpers used (verified against `node_modules/next/dist/docs`): `redirect`, `notFound`, `revalidatePath`, `useActionState`, `useFormStatus`, `cookies()`, `headers()`.
- Public catalog uses a plain anon Supabase client (no cookie) so it reflects RLS (hidden products excluded).

## Phase history
- Phase 1: Project scaffold, Tailwind config, base layout, design tokens (green/earth palette), fonts.
- Phase 2: Supabase schema (`products`, `profiles`, `product_images`), RLS policies, auth helpers (`lib/supabase/*`), middleware, magic-link login (`/admin/login`), logout.
- Phase 3: Public storefront — home (`/`), catalog (`/plants`), product detail (`/plants/[slug]`), contact (`/contact`), header/footer. (Arabic content placeholders.)
- Phase 4: Admin dashboard shell (`/admin` → redirect to `/admin/products`), `(dashboard)` layout + AdminNav, protected via middleware 307. Audit-log requirement + loading.tsx pitfall discovered.
- Phase 5: Auth hardening + verification — service-role isolation, anon/public client split, magic-link verification script (passed), public-route regression (all 200).
- Phase 6: Admin product CRUD — DB types regenerated; `ProductForm` (shared create/edit, Zod validation, visibility toggle, image URL, Arabic labels); `createProduct`/`updateProduct`/`deleteProduct`/`toggleVisibility` server actions with optimistic revalidate + client toasts; list page with search + visibility filter (`/admin/products`, `/admin/products/hidden`); `new`/`edit` pages. VERIFIED end-to-end: all routes 200, bad edit id -> 404, guest -> 307, full create/update/hide/show/delete cycle, slug-uniqueness enforced by DB, non-admin INSERT blocked by RLS. Lint + build clean.
- Phase 7: Cloudinary image management. `lib/cloudinary.ts` hardened (server-only; folder `plant-catalog/products[/<slug>]`, allowlist JPEG/PNG/WebP, 5MB cap, robust `deleteImage` returning ok/raw, `publicIdFromUrl` + `displayUrl` for f_auto,q_auto delivery). Protected route `app/api/admin/upload/route.ts` (requireAdmin via redirect→401, multipart validation, safe response). Client `ImageUpload` (single main image: picker, drag/drop, preview, progress, remove, Arabic/RTL) + `ProductImagesManager` (gallery: multi-upload, preview, delete, set-main). Server actions `addProductImage`/`deleteProductImage`/`setProductMainImage` (admin-only, DB-row-anchored delete so no arbitrary public_id deletion, RLS). `ProductForm` main image replaced with `ImageUpload`; gallery added to edit page. `updateProduct` cleans replaced main asset (unless still referenced by gallery); `deleteProduct` removes Cloudinary assets then product (cascade) and reports partial Cloudinary failures. Public data layer serves optimized URLs; `ProductGallery`/`ProductImage` unchanged. VERIFIED: upload JPEG/PNG/WebP -> 200 + secure_url/public_id (asset reachable); >5MB + unsupported -> 400; guest & non-admin -> rejected (401/307); gallery insert + public render; gallery delete (asset + DB); main replace cleanup; product delete cascade + cloud cleanup; public regression (all routes 200, no-image products render). Lint + build clean.
- Phase 8: Final polish, security audit & production readiness. Fixed contact page env-var mismatch (`NEXT_PUBLIC_STORE_PHONE/EMAIL/LOCATION`). Added `app/error.tsx` (root public error boundary using `ErrorUI`), `app/sitemap.ts` (visible products only), `app/robots.ts` (disallow /admin + /api/admin), security headers in `next.config.ts` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, X-Robots-Tag for /admin). Strengthened server-action input validation: `isValidUuid` + Cloudinary-host/owned-public_id checks on `deleteProduct`, `setProductVisibility`, `addProductImage`, `deleteProductImage`, `setProductMainImage`. `.env.example` now lists `SUPABASE_SERVICE_ROLE_KEY` + optional `NEXT_PUBLIC_SITE_URL`. VERIFIED: all public routes 200; `/plants/nonexistent` + bad admin edit id -> 404 (no soft-404 regression); guest/admin redirects correct; robots/sitemap correct; full CRUD + hide/show + upload + gallery add/delete + main replace cleanup + product delete cascade + Cloudinary cleanup; no test Cloudinary assets or DB rows remain. `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean.

## Open / next steps
- Optional: Playwright e2e for admin CRUD + image upload happy path.
- Optional: Cloudinary orphan scanner (code structurally ready via `publicIdFromUrl`).
- Optional: real CSP header (currently deferred to avoid breaking Cloudinary/Supabase without thorough testing).
<!-- END:pépinière-audit-log -->
