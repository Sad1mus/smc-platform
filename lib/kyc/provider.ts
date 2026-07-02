import type { KycStatus } from "@/types/database"

/**
 * Capa provider-agnostic de KYC (ver docs/specs/kyc.md).
 * Fase 1: proveedor stub determinista; el proveedor real (pago por
 * verificación) se enchufa implementando esta interfaz, sin re-arquitectura.
 */

export type KycVerificationRequest = {
  userId: string
  email: string
  fullName: string | null
}

export type KycVerificationOutcome = {
  status: Extract<KycStatus, "pending" | "approved" | "rejected">
  providerRef: string
}

export interface KycProvider {
  readonly name: string
  /** Inicia (o reintenta) la verificación de identidad de un usuario. */
  startVerification(
    request: KycVerificationRequest
  ): Promise<KycVerificationOutcome>
}

/**
 * Stub determinista, sin red (regla documentada en la spec):
 * email con "+kyc-reject" → rejected · "+kyc-pending" → pending · resto → approved.
 */
export class StubKycProvider implements KycProvider {
  readonly name = "stub"

  async startVerification(
    request: KycVerificationRequest
  ): Promise<KycVerificationOutcome> {
    const email = request.email.toLowerCase()
    const status = email.includes("+kyc-reject")
      ? "rejected"
      : email.includes("+kyc-pending")
        ? "pending"
        : "approved"

    return { status, providerRef: `stub:${request.userId}` }
  }
}

/** Punto único de swap cuando el cliente contrate un proveedor real. */
export function getKycProvider(): KycProvider {
  return new StubKycProvider()
}

/** true si la verificación de identidad está habilitada por flag (default off). */
export function isKycEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_KYC === "true"
}
