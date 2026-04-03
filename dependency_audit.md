# Dependency Audit: UKP2SA Modernization

Berikut adalah hasil audit pada `package.json` untuk mengidentifikasi package yang sudah tidak digunakan, redundan, atau kategori "Legacy" yang bisa dihapus setelah migrasi ke Supabase selesai.

## 📊 Summary
- **Total Dependencies**: ~67
- **Total Unused/Redundant**: 3 (Safe to remove now)
- **Legacy Candidates**: 7 (Remove after full Supabase migration)

---

## 🧹 1. Unused (Bisa Dihapus Sekarang)
Package ini tidak ditemukan import-nya di `src/` atau fungsinya sudah digantikan oleh library lain.

| Package | Alasan | Status |
| :--- | :--- | :--- |
| `@auth/mongodb-adapter` | NextAuth v5 sudah pakai custom `authorize` yang langsung hit Supabase. | **Unused** |
| `bluebird` | Native Promise bawaan Node.js sudah cukup. Tidak ada pemanggilan eksplisit di `src/`. | **Redundant** |
| `ts-morph` | Tidak ditemukan pemanggilan di codebase utama. Mungkin sisa-sisa script migrasi lama. | **Unused** |

## 🏺 2. Legacy / Migrating (Hapus Setelah Migrasi Selesai)
Package ini masih digunakan di beberapa titik (terutama Mobile Login & Notification sync), tapi harusnya dibuang jika transisi ke Supabase sudah 100%.

| Package | Catatan | Lokasi Penggunaan |
| :--- | :--- | :--- |
| `mongoose` | Masih dipakai di `src/lib/models` dan `src/app/api/auth/mobile`. | API Mobile & Sync |
| `mongoose-history-trace` | Tergantung pada mongoose. | Models |
| `winston-mongodb` | Logger masih nge-stream ke MongoDB Cloud. | `src/lib/logger.ts` |
| `express` | Dipakai di custom server (`server/server.js`). | Custom Server |
| `cors` / `helmet` | Dipakai di custom server. | Custom Server |
| `cookie-parser` | Dipakai di custom server. | Custom Server |

## 🛠️ 3. Optimization Tips
- **Serverless Readiness**: Jika fokus ke cPanel/Vercel, usahakan hapus `express` dan gunakan internal Next.js Route Handlers.
- **Icon Set**: `lucide-react` sudah sangat lengkap, pastikan tidak ada library icon lain yang tersembunyi (misal: FontAwesome) untuk menghemat bundle size.
- **Capacitor**: Jika tidak ada rencana update Android/iOS dalam waktu dekat, package `@capacitor/*` bisa dipindah ke devDependencies atau dipisah di repo lain.

---

> [!TIP]
> **Rekomendasi Sat-set**: Hapus `@auth/mongodb-adapter`, `bluebird`, dan `ts-morph` sekarang juga dengan perintah:
> `npm uninstall @auth/mongodb-adapter bluebird ts-morph`
