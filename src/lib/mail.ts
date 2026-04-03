import nodemailer from "nodemailer";

/**
 * Singleton SMTP transporter — reusable across all email sends.
 * Menggunakan konfigurasi webmail hosting dari .env
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Kirim email via SMTP webmail hosting.
 * Throws error jika gagal — handle di caller.
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""),
  });
}
