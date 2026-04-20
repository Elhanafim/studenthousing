// Brevo transactional email — replaces Resend
// API docs: https://developers.brevo.com/reference/sendtransacemail

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function getAppUrl(): string {
  // Priority: APP_URL → NEXT_PUBLIC_APP_URL → NEXTAUTH_URL → localhost
  // Set APP_URL in Vercel env vars to your deployed domain (no trailing slash)
  // e.g. https://studenthome.ma or https://yourapp.vercel.app
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

export async function sendVerificationEmail(
  email: string,
  rawToken: string,
  name?: string
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("[brevo] BREVO_API_KEY is not set.");
  }

  const senderEmail = process.env.EMAIL_FROM;
  if (!senderEmail) {
    throw new Error("[brevo] EMAIL_FROM is not set.");
  }

  const baseUrl = getAppUrl();
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${rawToken}`;
  const displayName = name ?? "étudiant(e)";

  console.log(`[brevo] Sending verification email to ${email}`);
  console.log(`[brevo] Verify URL base: ${baseUrl}`);

  const payload = {
    sender: { name: "StudentHome.ma", email: senderEmail },
    to: [{ email }],
    subject: "Confirmez votre adresse email — StudentHome.ma",
    htmlContent: buildEmailHtml(displayName, verifyUrl, baseUrl),
    textContent: buildEmailText(displayName, verifyUrl),
  };

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }
    console.error(`[brevo] API error ${res.status}:`, JSON.stringify(errorBody));
    throw new Error(`[brevo] Failed to send email (HTTP ${res.status})`);
  }

  const data = await res.json() as { messageId?: string };
  console.log(`[brevo] Email sent successfully to ${email}, messageId: ${data.messageId ?? "n/a"}`);
}

function buildEmailHtml(displayName: string, verifyUrl: string, baseUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e40af,#7c3aed);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.02em;">StudentHome.ma</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Logement étudiant au Maroc</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <h2 style="margin:0 0 12px;color:#111827;font-size:20px;font-weight:600;">
        Bonjour ${displayName} 👋
      </h2>
      <p style="margin:0 0 8px;color:#374151;font-size:15px;line-height:1.6;">
        Bienvenue sur <strong>StudentHome.ma</strong> — la plateforme de logement étudiant au Maroc.
      </p>
      <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:1.6;">
        Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
        Ce lien est valable <strong>24 heures</strong>.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${verifyUrl}"
           style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1e40af,#7c3aed);color:#ffffff;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.01em;">
          Confirmer mon email
        </a>
      </div>

      <!-- Security note -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
        <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
          🔒 Si vous n'avez pas créé de compte sur StudentHome.ma, ignorez cet email.
          Votre adresse ne sera pas utilisée.
        </p>
      </div>

      <!-- Fallback link -->
      <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">Si le bouton ne fonctionne pas, copiez ce lien :</p>
      <p style="margin:0 0 24px;font-size:11px;word-break:break-all;">
        <a href="${verifyUrl}" style="color:#1e40af;text-decoration:none;">${verifyUrl}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:11px;line-height:1.5;">
        Lien expiré ?
        <a href="${baseUrl}/auth/signin" style="color:#1e40af;text-decoration:none;">
          Renvoyer l'email de vérification
        </a>
        depuis la page de connexion.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

function buildEmailText(displayName: string, verifyUrl: string): string {
  return [
    `Bonjour ${displayName},`,
    "",
    "Bienvenue sur StudentHome.ma — la plateforme de logement étudiant au Maroc.",
    "",
    "Confirmez votre adresse email en cliquant sur ce lien (valable 24h) :",
    verifyUrl,
    "",
    "Si vous n'avez pas créé de compte, ignorez cet email.",
    "",
    "— L'équipe StudentHome.ma",
  ].join("\n");
}
