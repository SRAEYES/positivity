# DharmaVeda (positivity) — Project Documentation

## 1) What this app is
**DharmaVeda** is a modern spiritual learning platform for **Sanatana Dharma** that combines:
- Courses (free + paid)
- Student dashboard (enrolled courses, profile, notifications)
- Spiritual practice tools (Sadhana / progress)
- Interactive learning (quizzes/games, arena)
- Admin dashboard (manage courses, users, analytics, notifications)

**Core idea:** a calm, modern UI for spiritual learning, with gated enrollment for paid content.

---

## 2) Tech stack (A → Z)

### Frontend
- **Next.js (App Router)**: UI routing and rendering using the `app/` directory.
- **React 19**: component architecture + hooks.
- **TypeScript**: strict typing across UI and API routes.
- **Tailwind CSS**: utility-first styling and responsive design.
- **shadcn/ui + Radix UI**: accessible UI primitives and consistent components.
- **framer-motion**: animations and micro-interactions.
- **lucide-react**: icon system.
- **Recharts**: charts in admin/analytics/dashboard views.
- **react-hook-form + zod**: forms + validation (where used).

### Backend
- **Next.js Route Handlers** (`app/api/**/route.ts`): backend endpoints without a separate server.
- **Node.js runtime** (serverless on Vercel): runs API handlers.
- **bcryptjs**: password hashing for registration/login.
- **Razorpay**: payment order creation + signature verification.

### Database
- **PostgreSQL**: primary relational database.
- **Prisma ORM**:
  - Schema in `prisma/schema.prisma`
  - Client generated into `app/generated/prisma`
  - Uses `@prisma/adapter-pg` with `pg` pool.

### Tooling / Quality
- **ESLint**: lint rules via `eslint-config-next`.
- **TypeScript strict mode**: safer builds.
- **Prisma migrations**: database evolution (path configured in `prisma.config.ts`).

### Deployment
- **Vercel**: production hosting and serverless API deployment.

---

## 3) Languages used (for resume)
- **TypeScript** (UI + API route handlers)
- **JavaScript** (tooling/config files)
- **SQL** (via PostgreSQL; schema defined using Prisma)
- **HTML/JSX** (React components)
- **CSS** (Tailwind CSS utilities + global CSS)

---

## 4) App architecture (high level)

### Monorepo-style single Next.js app
- **UI pages** live under `app/`.
- **Backend APIs** live under `app/api/`.
- **DB access** is via `lib/prisma.ts` (Prisma client).

### Key domains
- **Auth**: register/login endpoints; client stores the returned user object (MVP-style).
- **Courses**: list courses, enrollments, and enrollment gating.
- **Payments**: create Razorpay order, verify signature, store payment status.
- **Admin**: manage courses/enrollments and analytics.
- **Sadhana**: practice/progress tracking endpoints and UI.

---

## 5) Database design (key tables)
(Defined in `prisma/schema.prisma`)

- **User**: accounts + role (student/admin), profile.
- **Course**: title, pricing, schedule links, description.
- **Enrollment**: joins User ↔ Course, contains `paid` flag and progress.
- **Payment**: one-to-one with Enrollment (`enrollmentId` unique), stores provider/status/amount.
- Additional learning/practice tables: notifications, journals, japa goals/progress, quizzes/results, puzzles, smartcards.

**Why this is solid:**
- Enrollment is the core record.
- Payment attaches to enrollment, enabling paid/free flows.

---

## 6) Payments + enrollment gating (how it works)

### Paid course flow (Razorpay)
1. Client calls **Order API** → creates/updates a pending `Enrollment` and pending `Payment` record.
2. Client opens Razorpay checkout.
3. On success, client calls **Verify API** → server verifies signature and updates:
   - `Enrollment.paid = true`
   - `Payment.status = success`
4. User is redirected to a **Receipt page**.

### Enrollment rules
- **Free courses:** enrolled immediately.
- **Paid courses:** user is considered enrolled **only after payment success**.

---

## 7) UI/UX novelty (what makes it stand out)
- **Spiritual-themed design language**: calm gradients, paper texture background, soft glow highlights.
- **Modern “premium” UI patterns**: large rounded cards, blurred glass panels, subtle shadows.
- **Accessible component primitives** (Radix + shadcn/ui).
- **Meaningful micro-animations** using framer-motion.
- **Professional receipt** experience after payment verification.

---

## 8) Notable routes (examples)

### Public
- `/` landing page
- `/login`, `/register`

### Student
- `/courses` course browsing + enroll/pay
- `/dashboard/enrolled` paid enrollments
- `/dashboard/receipt/[enrollmentId]` payment receipt
- `/dashboard/sadhana` practice hub

### APIs
- `/api/courses`
- `/api/enroll`, `/api/enrollments`
- `/api/payment/order`, `/api/payment/verify`, `/api/payment/receipt`

---

## 9) Environment variables (typical)
- `DATABASE_URL` — PostgreSQL connection string
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay server keys
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay public key for the client

---

## 10) Resume-ready description (copy/paste)

### One-liner
Built **DharmaVeda**, a Next.js + PostgreSQL spiritual learning platform with paid course enrollment via Razorpay, admin dashboards, and a modern Tailwind + shadcn UI.

### Bullet points
- Developed a full-stack app using **Next.js App Router**, **React 19**, **TypeScript**, and **Tailwind CSS**.
- Implemented **PostgreSQL + Prisma** data model for users, courses, enrollments, payments, and progress tracking.
- Integrated **Razorpay** payments (order creation + signature verification) and enforced **paid-only enrollment**.
- Built a **professional receipt page** showing transaction + course details after payment success.
- Delivered a premium UI with **shadcn/Radix components**, **framer-motion animations**, and consistent design tokens.

---

## 11) Suggested future upgrades (optional)
- Replace localStorage user handling with secure auth (HTTP-only cookies, JWT, or NextAuth).
- Add a webhook-based payment confirmation flow (server-to-server verification).
- Add PDF/print-friendly receipt and invoice numbering.
- Add role-based authorization middleware for admin routes.
