# Letquiz 🚀

**Letquiz** is a modern, fast, and feature-complete flashcard and study platform built with React, Vite, and Supabase PostgreSQL backend with Row Level Security (RLS).

![Letquiz Logo](public/logo.png)

## ✨ Key Features

- **Flashcard Sets**: 3D card flip views, audio text-to-speech pronunciation, star tagging, and deck duplication/forking.
- **Practice Test Generator**: Dynamic exam creation with multiple choice, true/false, and written recall questions.
- **Folders & Organization**: Group sets into public or unlisted collections with secret shareable links.
- **Invite-Only Classes**: Create and join study communities using unique 6-character access codes with member rosters and announcements.
- **Permalinks & Routing**: Direct URLs for sets (`/sets/:userId/:deckId`), test mode (`/test/:userId/:deckId`), folders (`/folders/:userId/:folderId`), classes (`/classes/:classId`), and user profiles (`/profile/:userId`).
- **Production-Grade Row Level Security**: Secure, granular database RLS policies protecting user data and private resources.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Lucide Icons, Vite
- **Backend & Database**: Supabase PostgreSQL (Publishable Key Standard, OAuth Profile Sync, RLS Policies)
- **Deployment Target**: Cloudflare Pages

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- npm / pnpm / yarn

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project details in `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

### 3. Install Dependencies & Run Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup (Supabase)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**.
2. Run [`sql/01_schema.sql`](sql/01_schema.sql) to initialize tables, indexes, grants, and secure RLS policies.
3. To reset or clear all test data, execute [`sql/02_reset_database.sql`](sql/02_reset_database.sql).

---

## ☁️ Deployment to Cloudflare Pages

1. Push this repository to **GitHub**.
2. Open the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your `Letquiz` repository.
4. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
5. Add Environment Variables in Cloudflare Pages settings:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Publishable Key
6. Click **Save and Deploy**.

*(Note: SPA routing fallback is pre-configured via `public/_redirects`).*

---

## 📜 License

MIT License.
