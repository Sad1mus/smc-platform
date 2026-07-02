import { Clock3, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

import { isKycEnabled } from "@/lib/kyc/provider"
import { getCurrentUserKycVerification } from "@/lib/kyc/queries"
import type { KycStatus } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KycVerifyButton } from "@/components/dashboard/kyc-verify-button"

const STATUS_UI: Record<
  KycStatus,
  { label: string; detail: string; icon: typeof ShieldCheck; tone: string }
> = {
  unverified: {
    label: "No verificado",
    detail:
      "Verifica tu identidad para dejar tu cuenta lista ante futuros requisitos de cumplimiento.",
    icon: ShieldQuestion,
    tone: "text-muted-foreground",
  },
  pending: {
    label: "En revisión",
    detail:
      "Recibimos tu verificación y está siendo revisada. Te avisaremos cuando haya novedades.",
    icon: Clock3,
    tone: "text-amber-500",
  },
  approved: {
    label: "Verificada",
    detail: "Tu identidad fue verificada correctamente.",
    icon: ShieldCheck,
    tone: "text-emerald-500",
  },
  rejected: {
    label: "Rechazada",
    detail:
      "No pudimos verificar tu identidad. Revisa tus datos e intenta nuevamente.",
    icon: ShieldAlert,
    tone: "text-destructive",
  },
}

/**
 * Estado de verificación de identidad (KYC). Solo se renderiza con
 * NEXT_PUBLIC_ENABLE_KYC=true; sin flag la plataforma queda idéntica
 * (ver docs/specs/kyc.md — no bloqueante en Fase 1).
 */
export async function KycCard() {
  if (!isKycEnabled()) return null

  const verification = await getCurrentUserKycVerification()
  const status: KycStatus = verification?.status ?? "unverified"
  const ui = STATUS_UI[status]
  const Icon = ui.icon

  return (
    <Card data-testid="kyc-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Icon aria-hidden className={`size-5 ${ui.tone}`} />
            Verificación de identidad
          </CardTitle>
          <Badge variant="outline" className={ui.tone}>
            {ui.label}
          </Badge>
        </div>
        <CardDescription>{ui.detail}</CardDescription>
      </CardHeader>
      {status === "unverified" || status === "rejected" ? (
        <CardContent>
          <KycVerifyButton retry={status === "rejected"} />
        </CardContent>
      ) : null}
    </Card>
  )
}
