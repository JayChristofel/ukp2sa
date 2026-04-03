/**
 * Email template collection — HTML templates yang inline-styled
 * untuk kompatibilitas maksimal di semua email clients.
 */

interface ResetPasswordTemplateOptions {
  userName: string;
  resetUrl: string;
  expiryMinutes?: number;
}

/**
 * Template email untuk reset password.
 * Inline CSS only — email clients nggak support external/embedded stylesheets.
 */
export function resetPasswordTemplate({
  userName,
  resetUrl,
  expiryMinutes = 60,
}: ResetPasswordTemplateOptions): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - UKP2SA</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6d28d9 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                UKP2SA
              </h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:3px;font-weight:700;">
                Unit Kerja Percepatan Pemulihan
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;font-weight:800;">
                Reset Password
              </h2>
              <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">
                Halo <strong style="color:#0f172a;">${userName}</strong>,
              </p>
              <p style="margin:0 0 32px;color:#64748b;font-size:14px;line-height:1.6;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. 
                Klik tombol di bawah ini untuk membuat kata sandi baru:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" 
                       style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:50px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">
                      Atur Ulang Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notice -->
              <div style="margin:32px 0;padding:16px 20px;background-color:#fef3c7;border-radius:12px;border-left:4px solid #f59e0b;">
                <p style="margin:0;color:#92400e;font-size:13px;font-weight:600;">
                  ⏰ Link ini berlaku selama <strong>${expiryMinutes} menit</strong>. 
                  Setelah itu, Anda perlu request ulang.
                </p>
              </div>

              <!-- Fallback URL -->
              <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;">
                Jika tombol tidak berfungsi, copy & paste URL berikut ke browser:
              </p>
              <p style="margin:0 0 24px;color:#8b5cf6;font-size:12px;word-break:break-all;">
                ${resetUrl}
              </p>

              <!-- Security Note -->
              <div style="padding:16px 20px;background-color:#f8fafc;border-radius:12px;">
                <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;">
                  🔒 Jika Anda <strong>tidak merasa</strong> meminta reset password, 
                  abaikan email ini. Akun Anda tetap aman.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.5;">
                Email ini dikirim otomatis oleh sistem UKP2SA.<br>
                © ${new Date().getFullYear()} Unit Kerja Percepatan Pemulihan Sumatera Aceh
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
