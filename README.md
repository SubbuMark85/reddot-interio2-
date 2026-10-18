# RedDot Interio — Luxury Interior Architecture & Design (Hyderabad)

Production website built for **RedDot Interio**, an interior design company based in Hyderabad, Telangana.

Inspired by **ElevenLabs'** clean, minimal design language with large lightweight Inter headlines, smooth dark mode, floating 3D spheres, rounded cards, and pill buttons.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) & `@react-three/fiber` / `@react-three/drei`
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth, Postgres DB, Storage, Row Level Security)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Color Palette**:
  - Cream White: `#f6f3f0`
  - Deep Obsidian Black: `#0d0d0d`
  - Signature Crimson Red: `#e5262d`
  - High-contrast Dark Mode support

---

## ✨ Features & Architecture

### 1. ElevenLabs Minimalist Aesthetic
- **Top Announcement Bar**: Subtle pulse indicator, Hyderabad booking alerts, and instant consultation link.
- **Rounded Sticky Header**: Floating pill navbar with glassmorphism backdrop blur, navigation links, theme toggle, and Admin Login trigger.
- **Lightweight Inter Typography**: Oversized, ultra-clean headlines (`font-light`, `-0.04em` tracking).
- **Pill Buttons & Rounded Cards**: `rounded-3xl` and `rounded-full` controls with smooth micro-interactions.

### 2. Interactive 3D Hero
- Floating, glossy 3D spheres (**Red**, **Obsidian Black**, and **Pearlescent White/Chrome**) rendered in real-time WebGL.
- **Interactive Mouse Reaction**: Spheres tilt, float, and orbit with smooth spring damping in response to pointer/touch movements.
- Directional lighting with a dynamic crimson rim light that casts specular highlights across the spheres.

### 3. Filterable Projects Gallery & 3D Tilt Cards
- **Category Tabs**: *All, Living Room, Modular Kitchen, Master Bedroom, Luxury Villa, Commercial*.
- **Tilt-on-Hover 3D Cards**: Project cards tilt with realistic perspective mouse-tracking and glossy reflection highlights.
- **Media Support**: Full support for both high-resolution photography and video.
- **WhatsApp Pre-filled Enquiry**: Pre-populates the project name, category, and offer price directly to WhatsApp (`+91 93489 23689`).

### 4. Admin Auth & Row Level Security (RLS)
- **Customer Privacy**: No public registration or customer accounts; customers only browse approved projects.
- **Admin Access**:
  - Click **"Admin login"** in the header.
  - Supabase email & password authentication (configured with fallback preview).
  - Admin email: `bhaskarjv3689@gmail.com`.
- **Admin Controls**:
  - **"+ Upload work"** button appears in header and gallery upon login.
  - Per-card **Enable / Disable toggle** (disabled cards are hidden from public visitors via RLS).
  - Per-card **Edit** and **Delete** buttons.
  - Photo / video upload to Supabase Storage bucket `projects`.

### 5. Verified Contact & Hyderabad Local Business Schema
- **Phone**: `+91 93489 23689`
- **Email**: `bhaskarjv3689@gmail.com`
- **Studio Address**: Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
- **Local Enclaves**: Jubilee Hills, Banjara Hills, Financial District, Gachibowli, Hitec City, Kokapet, Kondapur, Madhapur.
- **Structured Data**: JSON-LD `HomeAndConstructionBusiness` schema for Google search ranking.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Setup (Postgres, Storage & RLS)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the script in:
   ```
   supabase/schema.sql
   ```
   This automatically creates:
   - `public.projects` table with all fields (`name`, `category`, `media_url`, `media_type`, `price`, `offer_price`, `enabled`, `location`, `description`).
   - Row Level Security (RLS) policies ensuring customers only SELECT `enabled = true` rows, and only authenticated admins can INSERT, UPDATE, or DELETE.
   - Public Storage bucket `projects` with storage RLS policies.
   - Initial seed projects for Hyderabad residences.
3. In Supabase Dashboard -> **Authentication** -> **Users**, click **"Add User"** and create your admin account (e.g. `bhaskarjv3689@gmail.com`).
4. Copy your project URL and anon public key into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
