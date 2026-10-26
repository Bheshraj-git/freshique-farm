# Freshique Farm 🌾🚜

**Freshique Farm** is a modern, full-stack farm-to-table web marketplace connecting consumers directly with local farmers. Built with Next.js 16 (App Router & Turbopack), React 19, Supabase, and Google Gemini AI, it eliminates middlemen to bring fresh, sustainably harvested farm produce straight to consumers while empowering farmers with real-time sales dashboards, inventory control, and an intelligent AI Plant Doctor.

---

## ✨ Features

### 🛒 Consumer Experience
- **Interactive Marketplace:** Browse and filter fresh farm produce by category, price range, in-stock status, and real-time search.
- **Dynamic Shopping Cart & Instant Checkout:** Client-hydrated, optimistic cart management synced seamlessly with Supabase session data.
- **Order Tracking:** Detailed order history with live status indicators (`pending`, `confirmed`, `processing`, `completed`, `cancelled`).
- **Farmer Profiles:** Dedicated public farmer pages highlighting farm origin, customer favorites, sold counts, and farming stories.
- **Favorites & Wishlist:** One-tap save for favorite produce items with instant visual feedback.
- **Community Feed:** Discussion board where consumers and farmers share updates, farming practices, and photos.

### 🚜 Farmer Experience
- **Dedicated Farmer Dashboard:** Streamlined portal for inventory and operational management.
- **Product Management:** Add, edit, upload photos, and toggle active status for farm products.
- **Real-time Order Fulfillment:** Update order statuses directly from the farmer orders view.
- **Analytics & Trends:** Visual sales charts, daily revenue metrics, payment method distributions, and top-selling product statistics.
- **AI Plant Doctor:** Powered by Google Gemini AI to analyze leaf and crop photos, diagnose diseases, rate severity, and generate tailored organic remedies and preventative measures.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16.3.5](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Icons:** [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Visualizations:** [Recharts](https://recharts.org/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage, SSR Auth)
- **AI Diagnostics:** [Google Gemini API](https://ai.google.dev/) (Multimodal vision analysis)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 20.x or higher
- **npm** or **pnpm**
- A [Supabase](https://supabase.com/) project
- *(Optional)* [Google Gemini API Key](https://aistudio.google.com/) for the AI Plant Doctor feature

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Fill in the required values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Database & Storage Setup
Ensure the SQL tables, policies, and storage bucket are initialized in your Supabase project (refer to `supabase/storage_setup.sql`).

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build & Quality Checks

Run the production build:
```bash
npm run build
```

Run code formatting and lint verification:
```bash
npm run lint
```
