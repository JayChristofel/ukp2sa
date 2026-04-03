import { z } from "zod";

/**
 * Common regex patterns or helpers
 */
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
const nikRegex = /^[0-9]{16}$/;

/**
 * 1. AUTH SCHEMAS
 */

export const loginSchema = z.object({
  email: z.string().email("Format email harus valid!").min(1, "Email harus diisi."),
  password: z.string().min(1, "Password harus diisi."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Email harus valid!"),
  password: z.string().min(8, "Password minimal 8 karakter!"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password harus sama!",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email harus valid!"),
});

/**
 * 2. PUBLIC CITIZEN REPORT SCHEMA
 * Based on src/components/ReportSection.tsx
 */

export const publicReportSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus diisi (minimal 3 huruf)."),
  phone: z.string().regex(phoneRegex, "Format no HP harus standar Indonesia!"),
  nik: z.string().regex(nikRegex, "NIK harus 16 digit angka!"),
  address: z.string().min(10, "Alamat harus detail!"),
  category: z.string().min(1, "Pilih salah satu kategori aduan."),
  regency: z.string().min(1, "Kabupaten/Kota wajib diisi."),
  district: z.string().min(1, "Kecamatan wajib diisi."),
  village: z.string().min(1, "Desa/Kelurahan wajib diisi."),
  description: z.string().min(20, "Deskripsi wajib detail!"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  images: z.any().optional(), // File list validation can be complex, often handled in component
});

/**
 * 3. ADMIN MANAGEMENT SCHEMAS
 */

export const adminUserSchema = z.object({
  name: z.string().min(3, "Nama user minimal 3 karakter."),
  email: z.string().email("Email harus valid!"),
  role: z.string().min(1, "Role wajib ditentukan (Admin/Operator/Partner)."),
  instansiId: z.string().optional().nullable(),
  password: z.string().min(8, "Password baru minimal 8 karakter!").optional().or(z.literal('')),
});

export const adminRoleSchema = z.object({
  name: z.string().min(3, "Nama role minimal 3 karakter!"),
  description: z.string().min(10, "Deskripsi fungsi role ini untuk apa? (Min 10 karakter)."),
  permissions: z.array(z.string()).min(1, "Kasih minimal 1 izin akses (Permission)!"),
});

export const adminReplySchema = z.object({
  status: z.string().min(1, "Status update harus dipilih!"),
  replyContent: z.string().min(5, "Balasan laporan jangan terlalu singkat, minimal 5 karakter!"),
});

/**
 * 4. FIELD ASSIGNMENT SCHEMA
 */

export const assignmentSchema = z.object({
  title: z.string().min(5, "Judul tugas minimal 5 karakter!"),
  description: z.string().min(10, "Instruksi kerja detail minimal 10 karakter!"),
  assignedTo: z.string().min(1, "Pilih operator yang akan mengerjakan tugas ini!"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  dueDate: z.date({
    message: "Tentukan batas waktu pengerjaan!",
  }),
});

/**
 * 5. CONTENT & SATELLITE UPDATE SCHEMA
 */

export const blogPostSchema = z.object({
  title: z.string().min(10, "Judul berita minimal 10 karakter!"),
  content: z.string().min(50, "Isi berita/intelijen harus komprehensif (minimal 50 karakter)!"),
  category: z.string().min(1, "Pilih kategori publikasi!"),
  status: z.enum(["Draft", "Published"]),
});

/**
 * 6. DONOR & NGO PROJECT SCHEMA
 */

export const donorProjectSchema = z.object({
  name: z.string().min(5, "Nama program minimal 5 karakter!"),
  partnerId: z.string().min(1, "Wajib diasosiasikan ke salah satu Partner/NGO!"),
  allocation: z.number().positive("Alokasi dana harus lebih dari 0!"),
  realization: z.number().min(0, "Realisasi gak boleh negatif!"),
  location: z.string().min(3, "Tentukan lokasi intervensi!"),
});

/**
 * 7. PUBLIC CONTACT SCHEMA
 */
export const contactSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter!"),
  email: z.string().email("Email harus valid!"),
  subject: z.string().min(5, "Subjek pesan minimal 5 karakter!"),
  message: z.string().min(10, "Pesan minimal 10 karakter!"),
});

/**
 * 8. FINANCIAL & BUDGET PAYMENT SCHEMA
 */
export const budgetPaymentSchema = z.object({
  programName: z.string().min(5, "Nama program minimal 5 karakter!"),
  budgetCode: z.string().min(3, "Kode anggaran wajib diisi!"),
  allocation: z.number().min(10000, "Alokasi minimal Rp 10.000!"),
  source: z.string().min(1, "Sumber dana wajib dipilih!"),
  disbursementStage: z.string().min(1, "Tahap pencairan wajib dipilih!"),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PublicReportInput = z.infer<typeof publicReportSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BudgetPaymentInput = z.infer<typeof budgetPaymentSchema>;
