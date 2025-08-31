BambooInnovasia Digital Business Card (Web + iOS/Android)

Product Requirements Document (PRD) • Information Architecture • User Flows • MVP Scope

1) Product Vision & Goals

Vision: A modern, multi-tenant SaaS to create, manage, and share digital business cards (vcards) via web and mobile (iOS/Android), with admin analytics, beautiful templates, and frictionless sharing (QR/NFC/URL), inspired by HiHello parity.

Primary Goals

Let users build polished vcards in minutes, then share anywhere.

Drive paid conversions via templates, custom domains, and analytics.

Provide super admin full control of users, plans, billing, and content.

North Star Metrics (NSM)

Weekly Active Cards Shared (unique vcard share events).

Paid conversion rate from free → paid within 14 days.

Number of saved contacts from cards.

2) Personas

Solo Professional (freelancer/consultant): wants a quick, beautiful card.

SMB Team Owner: needs multiple staff cards, unified brand, analytics.

Event Marketer: creates event-specific cards + QR/NFC distribution.

Super Admin (Internal): manages users, content, billing, health.

3) Feature Matrix (Web vs Mobile)

Capability

Web App

iOS/Android

Landing Page (About, Services, Pricing)

✅

—

Registration/Login (Email/OAuth)

✅

✅

Email verification

✅

—

User Dashboard (cards, inquiries)

✅

✅

Create/Edit VCard (templates, fields, fonts)

✅

✅

Business Hours / Services / Social Links

✅

✅

Media Upload (logo, avatar, gallery)

✅

✅

Custom Fonts selection

✅

✅

Share via QR

✅

✅

NFC write (where supported)

—

✅ (device support)

Custom URL slug

✅

✅

Custom Domains (per card)

✅

—

Enquiry form on card + inbox

✅

✅

Analytics (views, clicks, saves)

✅

✅ (summary)

Push notifications (enquiries)

—

✅

Subscription management

✅

✅ (view/upgrade)

Super Admin Panel

✅

—

Front CMS (testimonials, hero, FAQs)

✅

—

Mobile apps aim for HiHello-level parity for card creation/edit/share; advanced admin/CMS remain web-only.

4) Detailed Features (Mapped to your spec)

Landing / Marketing

Landing page with About Us, Services, Pricing plans, Contact/Inquiry form.

Testimonials, FAQs, hero sections manageable via Front CMS.

Super Admin Panel

Dashboard: new users, plan counts, total vcards, revenue KPIs.

Users Management: CRUD users, status toggle (active/inactive), impersonate login.

VCard Management: list all vcards, copy/preview public URL.

Default Templates: ≥10 templates (add/manage versions, states: draft/live).

Subscription Plans: create plans with template access + feature toggles.

Front CMS: manage landing content, testimonials, FAQs, contact inquiries.

Localization Data: currencies, countries, states, cities preload + CRUD.

Settings: branding (logo, favicon, app name), SMTP, payment keys, analytics IDs.

User Panel

Dashboard: card count, inquiries, quick actions.

VCard Builder:

Custom slug, avatar/logo, banner, name, title, company, bio, phone, email, address.

Business Hours per day.

Services (title, description, price optional).

Testimonials (avatar, name, rating, text).

Social Links (multi-platform).

Custom Fonts (upload/select).

Media/Gallery (images, video links).

Theme/Template switcher.

Enquiries: inbox per card, assign status (new/open/closed), export CSV.

Domains: map custom domains/subdomains per card (CNAME), SSL auto.

Analytics: views, unique visitors, CTR on links, time-range filters.

Billing: current plan, upgrade/downgrade, invoices, payment method.

Card Preview (Public)

SEO-friendly public URL + QR auto-generated.

Contact buttons (Call, WhatsApp, Email, Save Contact/vCard file, Directions).

Enquiry form with spam protection + consent checkbox.

Mobile Apps (HiHello Parity)

Sign in / Sign up, biometric unlock.

Create/edit cards with live preview.

Generate & display QR; tap-to-share (NFC write capability where supported).

Scan business cards (optional Phase 2 OCR) → create contact.

Push notifications for new inquiries.

Offline cache of owned cards.

5) Information Architecture (IA)

Public: Home → About → Services → Pricing → Contact → Auth

User App: Dashboard → VCards → (Create/Edit) → Domains → Enquiries → Analytics → Billing → Settings

Super Admin: Dashboard → Users → VCards → Templates → Plans → Front CMS → Geo Data → Currencies → Settings → Inquiries

6) Key User Flows

6.1 Registration & Onboarding

Visit landing → pick plan (free trial or free tier) → register.

Email verification → first-login wizard: choose template, add basic info → publish card.

Prompt to download mobile app + connect custom domain (if plan allows).

6.2 Create & Publish VCard

New Card → choose template → fill profile, links, services, hours.

Upload logo/avatar/banner; choose font/theme.

Set slug or connect domain.

Preview → Publish → get QR + share options.

6.3 Share & Convert

Show QR on device; copy link; add to email signature; NFC write (mobile).

Track events: views, clicks, saves, enquiry submissions.

6.4 Handle Enquiries

Visitor submits form on card → user gets push/email.

View in inbox → reply (external), mark status, add notes, export.

6.5 Subscription Upgrade

Hit feature gate → upgrade modal → pay → features unlocked instantly.

6.6 Super Admin Impersonation

Admin → Users → “Login as” → diagnose or assist without password.

7) MVP vs Phase 2

MVP (12–14 weeks):

Multi-tenant SaaS (auth, teams optional), web vcard builder, 10 templates, enquiries, analytics v1, plans/billing, custom domains, Front CMS, Super Admin panel. Mobile apps: create/edit/share cards, QR, push for enquiries.

Phase 2 (6–8 weeks):

OCR business card scan → auto-import.

Team features (roles, shared templates, bulk provisioning).

Advanced analytics (geo/device, link heatmaps), UTM capture.

Template marketplace; font library; asset CDN optimizations.

8) Tech Stack (recommended)

Frontend (Web): Next.js 14 (App Router), React, Tailwind, shadcn/ui.

Mobile: Expo (React Native), EAS Build; modules for NFC, camera, push.

Backend: NestJS (TypeScript) or Laravel (PHP) — choose based on team.

DB: Postgres (Neon or RDS). Redis for cache/queues.

Storage: S3-compatible (Cloudflare R2 / AWS S3) + image resize worker.

Auth & Payments: Clerk/Auth.js + Stripe (global) + ToyyibPay/Payex (MY) adapter.

Email: Resend/SendGrid + custom SMTP per-tenant support.

Domains/SSL: Cloudflare API for DNS; Let’s Encrypt via proxy (Caddy/NGINX) or managed (Vercel if hosted there).

Analytics: PostHog (self-host or cloud) + internal counters.

Push: Firebase Cloud Messaging (Android/Web), APNs (iOS) via Expo.

9) Data Model (high level)

Core

users (id, email, name, role, status)

organizations/teams (id, name, owner_id)

memberships (user_id, org_id, role)

plans (id, name, price, currency, features_json, template_allowlist)

subscriptions (org_id, plan_id, status, period_start/end)

templates (id, name, version, config_json, status)

vcards (id, org_id, slug, template_id, title, bio, theme_json, font_id, publish_status)

vcard_fields (vcard_id, type, label, value, order)

business_hours (vcard_id, day, open_time, close_time)

services (vcard_id, title, description, price)

social_links (vcard_id, platform, url)

testimonials (vcard_id, name, avatar_url, rating, text)

enquiries (id, vcard_id, name, email, message, status, created_at)

media_assets (id, org_id, vcard_id, type, url, meta_json)

domains (id, org_id, hostname, target_slug, ssl_status)

analytics_events (id, vcard_id, type, ip_hash, ua, ref, created_at)

System

cms_blocks (id, type, content_json)

geo_countries / geo_states / geo_cities

currencies (code, symbol, decimals)

api_keys (org_id, key, scopes)

webhooks (org_id, url, events)

audit_logs (actor, action, target, meta, created_at)

invoices / transactions (stripe_id or local provider refs)

10) API Sketch (REST)

POST /auth/register POST /auth/login POST /auth/verify

GET /me GET /orgs POST /orgs

GET /plans POST /subscriptions/checkout

GET /vcards POST /vcards PUT /vcards/:id DELETE /vcards/:id

POST /vcards/:id/publish GET /v/:slug (public render)

POST /vcards/:id/enquiries (public) GET /vcards/:id/enquiries

GET /analytics/vcards/:id

POST /domains DELETE /domains/:id

Admin: GET /admin/users POST /admin/users POST /admin/impersonate

CMS: GET/POST /admin/cms-blocks

11) Security & Compliance

JWT with short-lived access + refresh tokens; per-tenant RBAC.

Rate limiting on public endpoints (enquiries, views).

File validation, AV scan (optional), signed URLs for downloads.

Privacy: consent checkbox on enquiry forms; PDPA/GDPR pages.

Audit logs for admin actions and impersonation events.

12) QA Checklist (MVP)

Card render on slow networks and old devices.

Template switch preserves content; responsive preview.

Custom domain provisioning (DNS guide, SSL status states).

Enquiry spam protection (honeypot + rate limit + reCAPTCHA optional).

Push notifications tested (iOS/Android) + notification deep links.

13) Pricing Draft (example)

Free: 1 card, branded footer, basic template set, no custom domain.

Pro: up to 5 cards, all templates, custom domain, analytics, RM15/mo.

Team: 25 cards, roles, export, priority support, RM49/mo.

Enterprise: custom limits, SSO, SLA, volume pricing.

14) Project Plan & Milestones

Week 1–2: IA, DB schema, templates spec, auth scaffolding.
Week 3–6: VCard builder, public render, enquiries, analytics v1.
Week 5–7: Billing + plans, custom domains, Front CMS.
Week 6–8: Super Admin panel, impersonation, geo/currency setup.
Week 7–10: Mobile apps (Expo): create/edit/share, QR, push.
Week 10–12: Polish, SEO, docs, TestFlight/Play Internal, launch.

15) Differentiators vs HiHello (opportunity)

Template marketplace with revenue share.

Per-card custom domain + white-label.

Workflow automations (webhooks to CRM, WhatsApp, email sequences).

AI assist: smart field suggestions, auto-bio from LinkedIn URL, logo cleanup.

Event mode: bulk QR badges + capture leads into one inbox.

16) Next Deliverables

Low-fidelity wireframes (Web + Mobile) based on sections above.

Template spec (JSON schema) for theming.

DNS/SSL runbook for custom domains.

App Store/Play Store listing copy & assets checklist.

Wireframes (No-Code, Annotated)

Below are visual wireframe specs written in plain English + ASCII boxes—no code. Each screen lists layout, components, states, and responsive rules so a designer or Trae can mock visually.

A) Public Marketing Site

A1. Home / Landing (/)

Goal: Communicate value, showcase templates, route to Sign Up / Pricing.

Layout (Desktop 1440)

Top Bar (64px): Left: Logo. Right: Nav (About, Services, Pricing, Contact), Sign In, CTA "Sign Up".

Hero (full width, 560–640px):

Left: H1 (2 lines), subhead (1–2 lines), primary CTA (Sign Up), secondary (See Templates).

Right: Device mockup showing vCard preview + floating QR block.

Trust Row: 4–6 logos (greyscale), optional.

Feature Grid (3 × cards): Icons, short copy.

Templates Carousel: Scrollable template thumbs; hover → quick preview.

Pricing Teaser: 3 plans, monthly toggle, "View full pricing".

Testimonials: 2–3 quotes with avatars.

FAQ Accordion: 6 items.

Footer: Links: About, Services, Pricing, Terms, Privacy; socials.

Responsive (Mobile 390)

Hamburger menu; hero stacks (copy above mockup); single‑column sections.

States

Sticky nav on scroll.

CTA button hover/press.

A2. About (/about)

Hero banner (short). Two-column: company story, mission; side column: stats (users, cards, inquiries).

A3. Services (/services)

Card list of services (icon, title, 2‑line desc). CTA to Sign Up.

A4. Pricing (/pricing)

Plan switcher (Monthly/Yearly), 3–4 cards with feature ticks; compare table beneath; FAQ.

A5. Contact (/contact)

Simple form: Name, Email, Message, Consent checkbox; right panel: address/map, support email.

B) Auth

B1. Sign In / Sign Up

Centered card with brand logo; tabs for Sign In / Sign Up.

Social SSO buttons row; email inputs; legal links.

B2. First-Run Onboarding (Wizard, 3 steps)

Choose template (carousel). 2) Basic info (name, title, company). 3) Generate card → success with QR + share tips.

C) User Dashboard (Web)

C1. Dashboard Home (/dashboard)

Layout

Sidebar (fixed 240): VCards, Enquiries, Domains, Analytics, Billing, Settings.

Header (56): Search, notifications, user menu.

Main:

KPI row (4 tiles): Total Cards, Views (7d), Clicks (7d), Enquiries (7d).

"Create New Card" button.

Table: Card Name, Slug/URL, Views, Enquiries, Status, Actions (...).

States

Empty state for new users with illustration + CTA "Create your first card".

C2. VCard Builder (/dashboard/vcards/[id]/edit)

Two‑Pane Editor

Left Pane (320px, Tabs):

Profile: Name, Title, Company, Bio, Avatar, Banner.

Links: Phone, Email, Website, WhatsApp, Location (map link).

Socials: Repeatable rows (platform icon + URL).

Services: Repeater (title, desc, price); drag to sort.

Hours: 7‑day grid with open/close pickers; Copy to all days.

Testimonials: Repeater (avatar, name, rating, text).

Theme: Template picker (grid), Colors (palette), Font selector.

Top Bar: Breadcrumb ← Cards / {Card Name}; Actions: Preview, Publish (primary), More (...).

Right Pane (Preview): Mobile device frame; QR toggle; live updates.

States

Unsaved changes toast; Publish success banner with public link + QR.

Validation errors inline (e.g., missing name/slug).

C3. Enquiries (/dashboard/enquiries)

Filters: Card, Status (New/Open/Closed), Date range.

Table: From, Email, Card, Message (excerpt), Received At, Status, Actions.

Right drawer: Full message, quick status change, export button.

C4. Domains (/dashboard/domains)

Empty state explaining CNAME; button "Add Domain" opens modal (Hostname, Target card dropdown).

Row list: hostname, target, SSL status (Pending/Issued/Error), last check.

C5. Analytics (/dashboard/analytics)

Date picker (7/30/90/custom). Tiles (Views, Unique, CTR, Enquiries).

Chart: Views over time; Top links table; Referrers list.

C6. Billing (/dashboard/billing)

Current plan card with limits; Upgrade button; Invoices list.

C7. Settings (/dashboard/settings)

Profile details; Organization name/logo; Notification toggles; API Keys (generate/revoke).

D) Public Card (Viewer) /v/:slug

Above the Fold (Mobile-first)

Avatar/Logo, Name, Title, Company; Action buttons row (Call, WhatsApp, Email, Save Contact, Directions).

QR button (opens modal with QR).

Sections

About/Bio

Services (cards with price badges)

Business Hours (weekly strip)

Social Links (icon grid)

Testimonials (carousel)

Gallery (grid)

Enquiry Form: Name, Email, Message, Consent; submit success toast.

Footer

Brand attribution (removable on paid plan).

States

Offline cache notice (mobile app); Light/Dark template variants.

E) Super Admin (Web)

E1. Overview (/admin)

KPI tiles: New users (7d), Total plans, Total vcards, Revenue (stub).

Activity feed: recent signups, domain mappings.

E2. Users (/admin/users)

Table with search; columns: Email, Name, Status, Plan, Created; Row actions: Impersonate, Deactivate.

E3. VCards (/admin/vcards)

Global list with filters; actions: copy preview URL, open preview in new tab.

E4. Templates (/admin/templates)

Grid of 10 defaults; status badge; button "Create new".

E5. Plans (/admin/plans)

Plan cards; plan editor drawer: price, currency, template allowlist, feature toggles.

E6. Front CMS (/admin/cms)

Editable sections: Hero, Features, Testimonials, FAQ, Footer; Contact inquiries inbox.

E7. Geo/Currencies (/admin/geo, /admin/currencies)

CRUD tables for countries/states/cities and currencies.

E8. Settings (/admin/settings)

Branding (logo, favicon, app name), SMTP, analytics IDs; audit log view.

F) Mobile Apps (HiHello parity intent)

F1. App Home (signed in)

Top: My Cards (carousel). CTA: New Card. Notification bell.

Quick share: QR button persistent.

F2. Card Editor (mobile)

Stepper at top: Profile → Links → Socials → Services → Theme.

Each step is a focused form; sticky Save button.

F3. Share Screen

Large QR code; buttons: Copy Link, Share Sheet, Add to Wallet (if supported), Write to NFC (Android).

F4. Enquiries

List by card; tap → detail; swipe to set status.

Mobile Patterns

Bottom tab bar: Cards, Enquiries, Analytics, Settings.

Pull to refresh; push notifications for new enquiries.

G) Interaction Notes & Edge Cases

Slug availability checker inline.

Autosave draft every 5s; show last saved timestamp.

Image upload: show cropping modal (avatar/banner presets).

Rate limit enquiry form; show CAPTCHA when suspicious.

Template switch confirmation (keep content, change styles only).

H) User Journeys (Happy Paths)

Create & Share in 3 mins: Sign up → choose template → add name/title → publish → show QR → copy link.

Upgrade Gate: User tries to add custom domain on Free → modal upsell → upgrade → domain mapping screen.

Admin Rescue: Super admin impersonates user to fix a broken slug → updates → logs event.

I) Accessibility & UX

Color contrast AA; focus outlines; keyboard nav for forms/tables.

Clear error messages; inline validation; success toasts.

J) Deliverables (Design Hand‑off)

This doc as the wireframe brief.

Optional: Convert to low‑fi grayscale frames (Figma) using the sections above.

