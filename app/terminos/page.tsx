import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata = { title: "Términos y Condiciones — SMC" }

// TODO: reemplazar con datos legales reales del cliente
// ([[RAZÓN SOCIAL]], [[JURISDICCIÓN]], [[EMAIL_CONTACTO]], [[MONEDA]]).
export default function TerminosPage() {
  return (
    <LegalPage title="Términos y Condiciones">
      <LegalSection heading="1. Objeto del servicio">
        <p>
          SMC es una plataforma de{" "}
          <strong>visualización de datos de mercado</strong> en tiempo real. El
          servicio es informativo:{" "}
          <strong>
            no ejecuta órdenes, no enruta operaciones a mercados, no custodia
            fondos y no constituye asesoría de inversión
          </strong>
          . Los gráficos se muestran con atribución a TradingView.
        </p>
      </LegalSection>
      <LegalSection heading="2. Titular">
        <p>
          El servicio es operado por [[RAZÓN SOCIAL]], con domicilio en
          [[DOMICILIO]] ([[JURISDICCIÓN]]). Contacto: [[EMAIL_CONTACTO]].
        </p>
      </LegalSection>
      <LegalSection heading="3. Cuenta y acceso">
        <p>
          El usuario es responsable de la veracidad de sus datos de registro y
          de la confidencialidad de sus credenciales. El acceso a las funciones
          de pago requiere un plan activo.
        </p>
      </LegalSection>
      <LegalSection heading="4. Planes y pagos">
        <p>
          Los pagos se procesan a través de Stripe. Los precios se expresan en
          [[MONEDA]] e incluyen los planes vigentes publicados en la plataforma.
          La contratación de un plan se rige además por la Política de
          Reembolsos.
        </p>
      </LegalSection>
      <LegalSection heading="5. Uso aceptable">
        <p>
          El usuario se compromete a no usar la plataforma con fines ilícitos,
          ni a intentar vulnerar su seguridad o disponibilidad.
        </p>
      </LegalSection>
      <LegalSection heading="6. Propiedad intelectual">
        <p>
          La marca, el diseño y el software son propiedad de [[RAZÓN SOCIAL]].
          Los datos y gráficos de mercado se proveen mediante TradingView, cuya
          atribución permanece visible conforme a sus términos.
        </p>
      </LegalSection>
      <LegalSection heading="7. Limitación de responsabilidad">
        <p>
          La información se ofrece &quot;tal cual&quot;, sin garantía de
          exactitud, continuidad o disponibilidad. [[RAZÓN SOCIAL]] no se
          responsabiliza por decisiones tomadas a partir de la información
          mostrada.
        </p>
      </LegalSection>
      <LegalSection heading="8. Ley aplicable">
        <p>
          Estos Términos se rigen por las leyes de [[JURISDICCIÓN]]. Cualquier
          controversia se someterá a los tribunales competentes de dicha
          jurisdicción.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
