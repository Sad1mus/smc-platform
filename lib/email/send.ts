import "server-only"

import { Resend } from "resend"

/**
 * Capa de emails transaccionales (Resend).
 *
 * Sin RESEND_API_KEY configurada funciona en modo stub: registra el
 * email en logs sin enviarlo, para que los flujos no fallen en
 * desarrollo. Con la key, envía de verdad.
 */

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "SMC <onboarding@resend.dev>"

type EmailPayload = {
  to: string
  subject: string
  html: string
}

export type EmailResult = {
  sent: boolean
  stub: boolean
  error?: string
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.info(
      `[email:stub] to=${payload.to} subject="${payload.subject}" (RESEND_API_KEY no configurada)`
    )
    return { sent: false, stub: true }
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    })

    if (error) {
      console.error("[email] Error de Resend:", error.message)
      return { sent: false, stub: false, error: error.message }
    }
    return { sent: true, stub: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : "desconocido"
    console.error("[email] Error enviando:", message)
    return { sent: false, stub: false, error: message }
  }
}

/** Escapa HTML para prevenir inyección en las plantillas de email. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

/** Plantilla base: layout oscuro con la identidad SMC. */
function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:32px 16px;background-color:#101218;font-family:Arial,Helvetica,sans-serif;color:#ededf0;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;">
      <tr><td style="padding-bottom:24px;font-size:22px;font-weight:bold;letter-spacing:-0.5px;">
        SMC<span style="color:#d9a948;">.</span>
      </td></tr>
      <tr><td style="background-color:#181b23;border:1px solid #2a2e3a;border-radius:12px;padding:32px;">
        <h1 style="margin:0 0 16px;font-size:20px;color:#ffffff;">${title}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding-top:24px;font-size:12px;color:#8b8f9a;line-height:1.6;">
        SMC es una plataforma de visualización de datos de mercado. No ejecuta órdenes
        ni constituye asesoría de inversión.
      </td></tr>
    </table>
  </body>
</html>`
}

/** Email de bienvenida tras confirmar la cuenta. */
export async function sendWelcomeEmail(
  to: string,
  fullName?: string | null
): Promise<EmailResult> {
  const name = escapeHtml(fullName?.split(" ")[0] ?? "")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return sendEmail({
    to,
    subject: "Tu cuenta de SMC está lista",
    html: baseTemplate(
      `Bienvenido${name ? `, ${name}` : ""}`,
      `<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#c9ccd4;">
        Tu cuenta está confirmada. Ya puedes entrar a la plataforma y ver los
        mercados en tiempo real.
      </p>
      <a href="${appUrl}/dashboard"
         style="display:inline-block;padding:12px 24px;background-color:#d9a948;color:#15171e;border-radius:8px;font-size:14px;font-weight:bold;text-decoration:none;">
        Ir a la plataforma
      </a>`
    ),
  })
}

/** Email de confirmación de pago (lo dispara el webhook de Stripe). */
export async function sendPaymentConfirmationEmail(
  to: string,
  planName: string
): Promise<EmailResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const safePlanName = escapeHtml(planName)
  return sendEmail({
    to,
    subject: `Pago confirmado — Plan ${safePlanName}`,
    html: baseTemplate(
      "Pago confirmado",
      `<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#c9ccd4;">
        Tu pago del plan <strong style="color:#ffffff;">${safePlanName}</strong> fue
        procesado correctamente por Stripe. Tu acceso ya está activo.
      </p>
      <a href="${appUrl}/dashboard"
         style="display:inline-block;padding:12px 24px;background-color:#d9a948;color:#15171e;border-radius:8px;font-size:14px;font-weight:bold;text-decoration:none;">
        Ver los mercados
      </a>`
    ),
  })
}
