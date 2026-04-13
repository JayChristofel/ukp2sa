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

[Live](https://www.ukp2sa.id) · [API Reference](#-api-endpoints) · [Deployment](#-build--deployment)

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
| 📡 **Sinkronisasi Data** | Auto-sync data dari API Banjir Sumatera & Tilikan/Diswatch ke database lokal |
| 📰 **Blog & Konten** | CMS berbasis TipTap Editor untuk publikasi berita dan analisis |
| 🔍 **Audit Trail** | Pencatatan otomatis setiap mutasi data untuk akuntabilitas dan transparansi |
| 🌐 **Multi-Bahasa (i18n)** | Dukungan Bahasa Indonesia dan English |
| 📱 **Mobile Ready** | Build native Android/iOS via Capacitor |

---

## 🛠️ Tech Stack

### Core

| Layer | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16.2 (App Router + Turbopack) |
| **Runtime** | React 19.2, TypeScript 5 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Custom JWT (HTTP-Only Cookies + Bearer Token) |
| **Styling** | Tailwind CSS 4.1 |
| **UI** | shadcn/ui (Radix UI) — 59 komponen |
| **State** | Zustand + TanStack Query v5 |
| **Validation** | Zod v4 |
| **Editor** | TipTap v3 |
| **Maps** | React Leaflet + Leaflet Cluster |
| **Charts** | Recharts |

### Integrasi & Infrastruktur

| Service | Fungsi |
| :--- | :--- |
| **Cloudflare** | CDN, Proxy, WAF, DNSSEC |
| **Cloudflare R2** | Object storage (foto bukti laporan) |
| **Midtrans** | Payment gateway donasi |
| **Nodemailer** | Email transaksional (SMTP) |
| **Banjir Sumatera API** | Data bencana real-time |
| **Tilikan/Diswatch API** | Data intelijen penanggulangan |
| **Capacitor** | Native mobile build (Android/iOS) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.0.0 | **npm** >= 10
- Akun [Supabase](https://supabase.com)

### Instalasi

```bash
# 1. Clone repo
git clone <repo-url>
cd ukp2sa

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Fill in all credentials in .env

# 4. Setup database — jalankan di Supabase SQL Editor
# File: supabase_schema.sql

# 5. Development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Project

```
ukp2sa/
├── public/                       # Aset statis (logo, gambar)
├── server.js                     # Entry point cPanel (Passenger)
├── .htaccess                     # Security rules (LiteSpeed/Apache)
├── src/
│   ├── proxy.ts                  # Edge Middleware (i18n, RBAC, Security Headers)
│   ├── app/
│   │   ├── [lang]/               # i18n routing (id/en)
│   │   │   ├── (public)/         # Halaman publik (landing, kontak, tentang, dsb.)
│   │   │   ├── admin/            # Dashboard admin (18 modul)
│   │   │   │   ├── assignments/  # Penugasan K/L
│   │   │   │   ├── audit-trail/  # Jejak Audit Real-time
│   │   │   │   ├── blog/         # CMS Konten & Blog
│   │   │   │   ├── clearing-house/ # Resolusi Konflik Anggaran
│   │   │   │   ├── donor/        # Registrasi Program Donor
│   │   │   │   ├── economy/      # Ekonomi Rakyat
│   │   │   │   ├── financial/    # Progress Finansial
│   │   │   │   ├── intel/        # Laporan Intelijen
│   │   │   │   ├── kpi/          # Key Performance Indicators
│   │   │   │   ├── laporan/      # Laporan Lapangan
│   │   │   │   ├── map/          # Peta Pemulihan GIS
│   │   │   │   ├── notifications/ # Pusat Notifikasi
│   │   │   │   ├── roles/        # Role & Permission Management
│   │   │   │   ├── settings/     # Pengaturan Sistem
│   │   │   │   ├── tracking/     # Pelacakan Hasil
│   │   │   │   └── users/        # Manajemen User
│   │   │   ├── auth/             # Login, Register, Forgot/Reset Password
│   │   │   ├── laporan/          # Detail laporan publik
│   │   │   └── portal/           # Portal mitra/instansi (Multi-tenant)
│   │   └── api/                  # REST API Endpoints
│   │       ├── admin/            # Admin API (Protected)
│   │       ├── auth/             # Authentication API
│   │       ├── payment/          # Midtrans Integration
│   │       ├── portal/           # Portal Stats API
│   │       ├── reports/          # Laporan CRUD
│   │       ├── sync/             # Data Synchronization
│   │       ├── upload/           # File Upload (R2)
│   │       ├── topics/           # Kuesioner Topics (Public)
│   │       └── questions/        # Kuesioner Questions (Public)
│   ├── components/               # Reusable UI Components
│   │   ├── admin/                # Admin-specific components
│   │   ├── layouts/              # Layout wrappers
│   │   ├── sections/             # Landing page sections
│   │   └── ui/                   # shadcn/ui primitives (59 components)
│   ├── hooks/                    # Custom React Hooks (12 hooks)
│   ├── lib/                      # Utilities & Configurations
│   │   ├── api-middleware.ts     # secureRoute — JWT + RBAC + Rate Limiting
│   │   ├── jwt.ts                # JWT sign & verify (HS256)
│   │   ├── rate-limit.ts         # In-memory rate limiter
│   │   ├── r2.ts                 # Cloudflare R2 client
│   │   ├── mail.ts               # SMTP email sender
│   │   ├── supabase-admin.ts     # Supabase Service Role client
│   │   ├── permissions.ts        # RBAC permission definitions
│   │   ├── validations.ts        # Zod schemas
│   │   └── constants.ts          # App constants & coordinates
│   ├── services/                 # Business Logic Services
│   │   ├── AuditService.ts       # Audit trail logging
│   │   ├── SyncManager.ts        # External API sync orchestrator
│   │   └── unifiedService.ts     # Unified data layer
│   ├── stores/                   # Zustand Stores
│   │   └── authStore.ts          # Auth state management
│   └── dictionaries/             # i18n Translation Files
│       ├── id.json               # Bahasa Indonesia (public strings)
│       ├── en.json               # English (public strings)
│       └── admin/                # Admin-only strings (server-side loaded)
├── supabase_schema.sql           # Database migration script
├── .env.example                  # Template environment variables
└── next.config.ts                # Next.js configuration
```

---

## 🔐 Autentikasi & Keamanan

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

Platform Agnostic Full API Auth — tanpa NextAuth / Server Actions:

- **Web**: JWT via HTTP-Only Cookie (`POST /api/auth/login`). Aman dari XSS.
- **Mobile**: JWT + Refresh Token via body JSON + `Authorization: Bearer <token>` header.
- **Edge Guard**: `src/proxy.ts` — i18n routing, RBAC, tenant isolation, security headers.

### Security Hardening

| Layer | Implementasi |
| :--- | :--- |
| **API Protection** | `secureRoute` middleware — JWT verification + RBAC + rate limiting |
| **JWT Algorithm** | HS256 only — `alg:none` attack ditolak |
| **Rate Limiting** | App-level per IP (login: 5/15min, register: 3/15min) |
| **Security Headers** | HSTS, X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **File Blocking** | `.git`, `.env`, `.zip`, `.bak` blocked via proxy + `.htaccess` |
| **CDN** | Full Cloudflare Proxy — IP asli server tersembunyi |
| **DNSSEC** | Aktif — proteksi DNS spoofing |
| **Cookie** | HTTP-Only, Secure, SameSite=Lax |
| **Dictionary Split** | Admin strings di-load server-side only, tidak masuk public bundle |

---

## 📡 API Endpoints

### Public (No Auth Required)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/reports` | Daftar laporan publik (PII stripped) |
| `GET` | `/api/topics` | Daftar topik kuesioner |
| `GET` | `/api/questions?topicId=X` | Pertanyaan per topik |

### Authentication

| Method | Endpoint | Deskripsi | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login (Cookie/Bearer) | 5/15min |
| `POST` | `/api/auth/register` | Registrasi user baru | 3/15min |
| `POST` | `/api/auth/logout` | Clear session cookie | — |
| `GET` | `/api/auth/session` | Decode & validasi JWT | — |
| `POST` | `/api/auth/forgot-password` | Kirim email reset | 3/15min |
| `POST` | `/api/auth/reset-password` | Reset password via token | — |
| `POST` | `/api/auth/refresh` | Refresh token (mobile) | — |

### Protected — Admin (Requires `secureRoute`)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET/PATCH/DELETE` | `/api/admin/users` | Manajemen user |
| `GET/POST/DELETE` | `/api/admin/roles` | Role & permission CRUD |
| `GET/POST/DELETE` | `/api/admin/permissions` | Permission master data |
| `GET` | `/api/admin/financial/latest` | Data finansial terbaru |
| `GET` | `/api/admin/blog` | Konten blog management |
| `GET/POST` | `/api/admin/audit` | Audit trail logs |
| `ALL` | `/api/admin/notifications` | Notifikasi sistem |

### Protected — Other

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST/DELETE` | `/api/reports` | CUD laporan (auth required) |
| `POST` | `/api/upload` | Upload file ke R2 |
| `POST` | `/api/payment/create` | Buat transaksi Midtrans |
| `POST` | `/api/payment/webhook` | Midtrans callback (S2S) |
| `GET` | `/api/portal/stats` | Statistik portal instansi |
| `GET` | `/api/sync?key=***` | Trigger sync data (API key) |

---

## 🏗️ Build & Deployment

### Build Scripts

```bash
# Development (Turbopack)
npm run dev

# Production — Vercel
npm run build:vercel

# Production — cPanel (standalone + static copy)
npm run build:cpanel

# Production — Mobile (Capacitor HTML Export)
npm run build:mobile

# Linting
npm run lint
```

### Deploy ke cPanel

1. **Build**: `npm run build:cpanel`
2. **Upload**: ZIP dan upload `.next/standalone/` ke cPanel
3. **Config**: cPanel Node.js Selector:
   - Application startup file: `server.js`
   - Node.js version: >= 22
4. **Environment**: Set semua variabel `.env` di cPanel
5. **Upload** file `.htaccess` ke `public_html/`

### Deploy ke Vercel

1. Hubungkan repository ke Vercel
2. Build Command: `npm run build:vercel`
3. Set Environment Variables dari `.env.example`
4. Deploy! Vercel auto-detect Next.js.

---

## 🗄️ Database

Database menggunakan **Supabase (PostgreSQL)**. Schema lengkap di `supabase_schema.sql`.

### Tabel Utama

| Tabel | Fungsi |
| :--- | :--- |
| `users` | Data pengguna + hashed credentials |
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
| `password_resets` | Token reset password |

---

## 🧪 Environment Variables

Lihat `.env.example` untuk template lengkap.

| Kategori | Variabel | Wajib | Deskripsi |
| :--- | :--- | :---: | :--- |
| **App** | `NEXT_PUBLIC_API_URL` | ✅ | Base URL aplikasi |
| **Database** | `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase |
| | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | ✅ | Publishable key Supabase |
| **Auth** | `AUTH_SECRET` | ✅ | Secret untuk JWT signing |
| | `NEXTAUTH_URL` | ✅ | Base URL aplikasi |
| | `ENCRYPTION_KEY` | ✅ | AES-256 key untuk PII encryption |
| **Storage** | `R2_ACCESS_KEY_ID` | ✅ | Cloudflare R2 access key |
| | `R2_SECRET_ACCESS_KEY` | ✅ | Cloudflare R2 secret |
| | `R2_BUCKET_NAME` | ✅ | Nama bucket R2 |
| **Payment** | `MIDTRANS_SERVER_KEY` | ⚠️ | Server key Midtrans (jika payment aktif) |
| **Email** | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | ⚠️ | Konfigurasi email SMTP |
| **Sync** | `SYNC_KEY` | ⚠️ | API key untuk cron job sync |

> **⚠️ Penting**: Jangan pernah commit file `.env` ke repository. Gunakan `.env.example` sebagai template.

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
