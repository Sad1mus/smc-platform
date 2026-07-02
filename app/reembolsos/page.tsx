import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata = { title: "Política de Reembolsos — SMC" }

// TODO: reemplazar con datos legales reales del cliente
// ([[RAZÓN SOCIAL]], [[EMAIL_CONTACTO]], [[VENTANA_REEMBOLSO]], [[MONEDA]]).
export default function ReembolsosPage() {
  return (
    <LegalPage title="Política de Reembolsos">
      <LegalSection heading="1. Alcance">
        <p>
          Esta política aplica a las suscripciones y pagos realizados en la
          plataforma a través de Stripe, operada por [[RAZÓN SOCIAL]].
        </p>
      </LegalSection>
      <LegalSection heading="2. Derecho de reembolso">
        <p>
          Podés solicitar el reembolso dentro de los [[VENTANA_REEMBOLSO]] días
          posteriores a la compra, siempre que no se haya hecho un uso
          sustancial del servicio. Los importes se devuelven en [[MONEDA]] al
          medio de pago original.
        </p>
      </LegalSection>
      <LegalSection heading="3. Cancelación de suscripción">
        <p>
          Podés cancelar en cualquier momento desde tu cuenta. La cancelación
          detiene las renovaciones futuras; el acceso permanece hasta el fin del
          período ya pagado.
        </p>
      </LegalSection>
      <LegalSection heading="4. Cómo solicitarlo">
        <p>
          Escribí a [[EMAIL_CONTACTO]] indicando el correo de tu cuenta y la
          fecha de compra. Procesamos las solicitudes en un plazo razonable.
        </p>
      </LegalSection>
      <LegalSection heading="5. Excepciones">
        <p>
          No corresponden reembolsos sobre períodos ya consumidos ni sobre
          planes expresamente marcados como no reembolsables al momento de la
          compra.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
