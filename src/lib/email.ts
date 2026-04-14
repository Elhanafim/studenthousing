import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Bayt-Talib" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Vérifiez votre adresse email — Bayt-Talib",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #1a1a2e; margin-bottom: 8px;">Bienvenue sur Bayt-Talib</h1>
        <p style="color: #555; margin-bottom: 24px;">
          Merci de vous être inscrit(e). Cliquez sur le bouton ci-dessous pour activer votre compte.
        </p>
        <a href="${verifyUrl}"
           style="display:inline-block; padding: 14px 28px; background:#2563eb; color:#fff; border-radius:8px; text-decoration:none; font-weight:600;">
          Vérifier mon adresse email
        </a>
        <p style="color:#999; font-size:12px; margin-top:24px;">
          Ce lien expire dans 24 heures. Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
        </p>
      </div>
    `,
  });
}
