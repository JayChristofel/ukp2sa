import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email nggak valid nih."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Email nggak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter biar aman!"),
});
