<div align="center">

# 🇮🇩 UKP2SA

### Unit Kerja Presiden untuk Percepatan Pembangunan Sumatera dan Aceh

**Sistem Informasi Terpadu Penanggulangan Bencana & Koordinasi Pembangunan**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red)](#)

[Demo](https://ukp2sa.id) · [Dokumentasi API](#api-endpoints) · [Deployment](#deployment)

</div>

---

## 📋 Deskripsi

**UKP2SA** adalah platform digital terpadu yang dirancang untuk mendukung koordinasi pembangunan dan penanggulangan bencana di wilayah Sumatera dan Aceh. Sistem ini menyediakan dashboard analitik real-time, pelaporan aduan warga berbasis geospasial, serta portal kolaborasi multi-instansi.

### Fitur Utama

| Modul | Deskripsi |
| :--- | :--- |
| 🗺️ **GIS & Peta Interaktif** | Visualisasi laporan bencana, titik pengungsian, dan kantor SAR menggunakan React Leaflet dengan clustering |
| 📊 **Dashboard Analitik** | Statistik real-time laporan, KPI instansi, dan grafik ekonomi regional (Recharts) |
| 📝 **Pelaporan Aduan Warga** | Multi-step form (5 tahap) dengan upload bukti foto ke Cloudflare R2 dan pemetaan koordinat |
| 🏢 **Portal Mitra/Instansi** | Multi-tenant dashboard untuk BPBD, SAR, PMI, dan NGO dengan isolasi data per instansi |
| 👥 **RBAC (Role-Based Access)** | Sistem permission granular: Superadmin, Admin, Presiden, Deputi, Operator, Partner, NGO |
| 💰 **Manajemen Donasi** | Integrasi Midtrans Payment Gateway untuk transparansi keuangan bantuan bencana |
| 📡 **Sinkronisasi Satelit** | Auto-sync data dari API Banjir Sumatera & Tilikan/Diswatch ke database lokal |
| 📰 **Blog & Intel** | CMS berbasis TipTap Editor untuk publikasi berita dan analisis intelijen satelit |
| 🔍 **Audit Trail** | Pencatatan otomatis setiap mutasi data untuk akuntabilitas dan transparansi |
| 🌐 **Multi-Bahasa (i18n)** | Dukungan Bahasa Indonesia dan English |
| 📱 **Mobile Ready** | Build native Android/iOS via Capacitor |

---

## 🛠️ Tech Stack

### Core

| Layer | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Runtime** | React 19, TypeScript 5 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Custom JWT (Cookies + Bearer Token) |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix UI) |
| **State** | Zustand + TanStack Query v5 |
| **Validation** | Zod v4 |

### Integrasi & Infrastruktur

| Service | Fungsi |
| :--- | :--- |
| **Cloudflare R2** | Object storage (foto bukti laporan) |
| **Midtrans** | Payment gateway donasi |
| **Nodemailer** | Email transaksional (SMTP) |
| **Banjir Sumatera API** | Data bencana real-time |
| **Tilikan/Diswatch API** | Data intelijen penanggulangan |
| **Capacitor** | Native mobile build (Android/iOS) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.0.0
- **npm** >= 10
- Akun [Supabase](https://supabase.com) (Free tier cukup)

### Instalasi

```bash
# 1. Clone repo
git clone https://github.com/jaychristofel/ukp2sa.git
cd ukp2sa

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env dan isi semua kredensial

# 4. Setup database — jalankan di Supabase SQL Editor
# File: supabase_schema.sql

# 5. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Project

```
ukp2sa/
├── public/                   # Aset statis (logo, gambar)
├── server.js                 # Entry point cPanel (Passenger)
├── src/
│   ├── app/
│   │   ├── [lang]/           # i18n routing (id/en)
│   │   │   ├── (public)/     # Halaman publik (kontak, tentang)
│   │   │   ├── admin/        # Dashboard admin (16 modul)
│   │   │   ├── auth/         # Login, Register, Forgot Password
│   │   │   ├── laporan/      # Detail laporan publik
│   │   │   └── portal/       # Portal mitra/instansi
│   │   └── api/              # REST API endpoints (Full MVC Logic)
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities, Supabase clients, validations
│   ├── services/             # SyncManager, AuditService
│   ├── stores/               # Zustand Store (Auth)
│   └── types/                # TypeScript type definitions
├── supabase_schema.sql       # Database migration script
├── .env.example              # Template environment variables
└── next.config.ts            # Next.js configuration (Auto-detect Vercel/cPanel)
```

---

## 🔐 Autentikasi & Otorisasi

### Role Hierarchy

```
Superadmin ──→ Full access, bypass semua permission
  ├── Presiden ──→ Dashboard executive, KPI, ekonomi
  ├── Deputi ──→ Laporan, financial, donor
  ├── Admin ──→ User management, roles, settings
  ├── Operator ──→ CRUD laporan, assignments, tracking
  ├── Partner ──→ Portal instansi (BPBD, SAR, dll)
  └── NGO ──→ Portal organisasi (PMI, ACF, dll)
```

### Multi-Channel Auth

Kita menggunakan arsitektur **Platform Agnostic Full API Auth** (Tanpa NextAuth / Server Actions):
- **Web**: Mendapatkan JWT melalui HTTP-Only Cookie via jalur `POST /api/auth/login`. Aman dari XSS.
- **Mobile**: Mendapatkan JWT + Refresh Token via body JSON. Dipasang pada request header `Bearer <token>`.
- **Middleware**: `src/proxy.ts` membaca custom JWT. Menangani Edge-Compatible Route Guard, i18n, & Tenant Isolation.

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login (Mengembalikan JSON Token atau mengatur HTTP-Only Cookie) |
| `GET` | `/api/auth/session` | Decode session dan validasi JWT yang melekat |
| `POST` | `/api/auth/logout` | Membersihkan session cookie |
| `GET` | `/api/reports` | Daftar laporan |
| `POST` | `/api/reports` | Buat laporan baru |
| `GET` | `/api/admin/users` | Daftar user (Admin) |
| `GET` | `/api/admin/roles` | Daftar role & permission |
| `POST` | `/api/upload` | Upload file ke R2 |
| `GET` | `/api/sync?key=SECRET` | Trigger sinkronisasi data |
| `GET` | `/api/questions?topicId=X` | Pertanyaan kuesioner |

---

## 🏗️ Build & Deployment

Didukung penuh untuk platform Serverless (Vercel) maupun Dedicated/Shared (cPanel). Configuration pada `next.config.ts` mendeteksi root variable platform secara dinamis.

### Build Scripts

```bash
# Development (Turbopack)
npm run dev

# Production build untuk Vercel (Auto handle static routes & functions)
npm run build:vercel

# Production build + auto-copy static assets untuk cPanel
npm run build:cpanel

# Mobile build (Capacitor HTML Export)
npm run build:mobile

# Lint
npm run lint
```

### Deploy ke cPanel

1. **Build**: `npm run build:cpanel` (via terminal lokal/Windows)
2. **Upload**: ZIP isi folder `.next/standalone/` → upload ke cPanel file manager
3. **Config**: Di cPanel Node.js Selector:
   - Application startup file: `server.js`
   - Node.js version: >= 22
4. **Environment**: Tambahkan semua variabel dari `.env` ke cPanel Environment Variables
5. **Cron Job** (Opsional): Setup auto-sync data setiap 5 menit:
   ```
   */5 * * * * curl -X GET "https://domain.id/api/sync?key=YOUR_SYNC_KEY" > /dev/null 2>&1
   ```

### Deploy ke Vercel

1. Hubungkan repository GitHub ke layanan Vercel
2. Atur **Build Command** menjadi `npm run build:vercel` atau `next build`
3. Masukkan `Environment Variables` dari file `.env.example` ke dashboard Vercel
4. Klik **Deploy**! Vercel akan otomatis mengenali Next.js dan tidak akan menggunakan "standalone" build.

---

## 🗄️ Database

Database menggunakan **Supabase (PostgreSQL)**. Schema lengkap ada di file `supabase_schema.sql`.

### Tabel Utama

| Tabel | Fungsi |
| :--- | :--- |
| `users` | Data pengguna + password hash |
| `roles` | Definisi role + array permissions |
| `permissions` | Master daftar permission |
| `partners` | Data instansi/mitra |
| `reports` | Laporan aduan warga |
| `tasks` | Penugasan lapangan |
| `audit_logs` | Jejak audit aktivitas |
| `blog_posts` | Artikel & berita |
| `questions` | Kuesioner dinamis per topik |
| `dashboard_metrics` | Cache statistik dashboard |
| `refresh_tokens` | Token refresh mobile auth |

---

## 🧪 Environment Variables

Lihat file `.env.example` untuk daftar lengkap. Variabel kritis:

| Variabel | Wajib | Deskripsi |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | ✅ | Publishable key Supabase |
| `AUTH_SECRET` | ✅ | Secret untuk JWT NextAuth |
| `AUTH_URL` | ✅ | URL endpoint auth (production) |
| `NEXTAUTH_URL` | ✅ | Base URL aplikasi |
| `R2_ACCESS_KEY_ID` | ✅ | Cloudflare R2 access key |
| `MIDTRANS_SERVER_KEY` | ⚠️ | Payment gateway (jika aktif) |
| `SYNC_KEY` | ⚠️ | Autentikasi cron job sync |

---

## 👨‍💻 Kontributor

<table>
  <tr>
    <td align="center">
      <strong>Jay Christofel</strong><br>
      <sub>Lead Developer</sub>
    </td>
  </tr>
</table>

---

## 📄 Lisensi

Project ini bersifat **Private** dan dikembangkan untuk kepentingan Unit Kerja Presiden Republik Indonesia. Seluruh hak cipta dilindungi.

---

<div align="center">

**Built with ❤️ for Indonesia 🇮🇩**

*Accelerating Disaster Recovery & Development in Sumatera*

</div>
