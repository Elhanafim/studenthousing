import { Resend } from "resend";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  const displayName = name ?? "étudiant(e)";

  try {
    await resend.emails.send({
      from: "Bayt-Talib <noreply@bayt-talib.ma>",
      to: email,
      subject: "Vérifiez votre adresse email — Bayt-Talib",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px;">
              Bayt-Talib
            </h1>
            <p style="font-size: 13px; color: #888; margin: 0; font-style: italic;">
              Logement étudiant au Maroc
            </p>
          </div>

          <!-- Body -->
          <div style="background: #f8f9ff; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a2e; margin: 0 0 12px;">
              Bonjour ${displayName} 👋
            </h2>
            <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 24px;">
              Merci de vous être inscrit(e) sur Bayt-Talib.<br>
              Cliquez sur le bouton ci-dessous pour activer votre compte et accéder
              à des milliers de logements étudiants au Maroc.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="${verifyUrl}"
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.02em;">
                Confirmer mon email
              </a>
            </div>
          </div>

          <!-- Fallback link -->
          <p style="font-size: 12px; color: #999; margin: 0 0 8px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
          </p>
          <p style="font-size: 11px; word-break: break-all; color: #2563eb; margin: 0 0 24px;">
            ${verifyUrl}
          </p>

          <!-- Footer -->
          <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 16px;" />
          <p style="font-size: 11px; color: #bbb; margin: 0; line-height: 1.5;">
            Ce lien expire dans <strong>24 heures</strong>. Si vous n'êtes pas à l'origine
            de cette inscription, ignorez cet email — votre adresse ne sera pas utilisée.<br><br>
            Si le lien a expiré, rendez-vous sur
            <a href="${baseUrl}/auth/signin" style="color: #2563eb; text-decoration: none;">
              la page de connexion
            </a>
            et cliquez sur &quot;Renvoyer l'email de vérification&quot;.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}
