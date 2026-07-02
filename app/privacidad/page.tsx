import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata = { title: "Política de Privacidad — SMC" }

// TODO: reemplazar con datos legales reales del cliente
// ([[RAZÓN SOCIAL]], [[JURISDICCIÓN]], [[EMAIL_CONTACTO]], [[DPO]]).
export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad">
      <LegalSection heading="1. Responsable del tratamiento">
        <p>
          [[RAZÓN SOCIAL]], [[DOMICILIO]] ([[JURISDICCIÓN]]). Para consultas
          sobre tus datos: [[EMAIL_CONTACTO]].
        </p>
      </LegalSection>
      <LegalSection heading="2. Datos que tratamos">
        <p>
          Datos de cuenta (nombre, correo), datos de autenticación y, para
          pagos, los datos que gestiona el procesador. La plataforma{" "}
          <strong>no almacena números de tarjeta</strong>: los datos de tarjeta
          se manejan directamente en Stripe.
        </p>
      </LegalSection>
      <LegalSection heading="3. Finalidad y base legal">
        <p>
          Tratamos los datos para prestar el servicio, gestionar la suscripción
          y cumplir obligaciones legales. La base legal es la ejecución del
          contrato y, en su caso, el consentimiento del usuario.
        </p>
      </LegalSection>
      <LegalSection heading="4. Encargados y terceros">
        <p>
          Nos apoyamos en proveedores que actúan como encargados del
          tratamiento: Supabase (autenticación y base de datos), Stripe (pagos)
          y Vercel (alojamiento). Cada uno trata los datos conforme a sus
          propios términos.
        </p>
      </LegalSection>
      <LegalSection heading="5. Conservación">
        <p>
          Conservamos los datos mientras la cuenta esté activa y durante los
          plazos legales aplicables tras su baja.
        </p>
      </LegalSection>
      <LegalSection heading="6. Tus derechos">
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión,
          oposición, limitación y portabilidad escribiendo a [[EMAIL_CONTACTO]].
          Si resides en la UE, puedes reclamar ante la autoridad de control
          competente.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
