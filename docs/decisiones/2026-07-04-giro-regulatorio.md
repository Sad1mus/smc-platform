# Decisión pendiente — Giro del marco regulatorio (SMC)

**Fecha:** 2026-07-04
**Estado:** 🟡 PROPUESTO por el cliente — BLOQUEADO a la espera de confirmación de compliance
**Autor del registro:** Orvex (asesor)
**Alcance:** local, sin commitear ni desplegar hasta cierre.

---

## Contexto

El cliente (Smart Money) plantea **eliminar el marco regulatorio** que hoy prohíbe en el
producto: la palabra "broker", sugerir custodia/ejecución de órdenes, KYC/AML y las promesas
de rentabilidad. Motivo declarado: **"el cliente ya tiene la licencia de un tercero"**.

Este marco está hoy documentado como restricción dura en:

- `CLAUDE.md` (§ "broker" prohibido; nada de custodia/ejecución/rentabilidad)
- `docs/specs/product.md` (§ Anti-referencias / posicionamiento)
- `docs/specs/hardening.md` (KYC/AML diferido)

## Por qué NO se ejecuta de inmediato

Tener la licencia de un tercero autoriza **actividades específicas, en jurisdicciones
específicas, bajo condiciones del contrato**. No es un "todo permitido". Riesgo legal directo
para el cliente y por asociación para Orvex si el producto declara/hace algo que la licencia
no cubre.

Regla que **no cambia con ninguna licencia**: **prohibido prometer/garantizar rentabilidad**
(fraude regulatorio en casi toda jurisdicción). Este guardrail se mantiene sí o sí.

## Preguntas abiertas (deben responderse por escrito, idealmente por el compliance del cliente)

1. ¿Qué autoriza exactamente la licencia? (broker-dealer / transmisión de dinero / asesoría /
   custodia)
2. ¿En qué jurisdicción(es) es válida?
3. ¿SMC opera COMO agente bajo esa licencia o solo la usa de paraguas? ¿Qué puede representar
   públicamente según el contrato?
4. ¿Hay confirmación legal firmada de que SMC puede usar "broker", ejecutar órdenes y/o
   custodiar? ¿Nombre del tercero y número/tipo de licencia?

## Camino de implementación (cuando se cierre lo anterior)

1. Actualizar `docs/specs/product.md` con el **nuevo alcance permitido** (redefinir, no borrar):
   qué se puede decir/hacer y qué sigue prohibido.
2. Ajustar `CLAUDE.md` en consecuencia.
3. Recién después, regenerar copy/código a partir de la spec aprobada.
4. Mantener KYC/AML y el "no rentabilidad" salvo confirmación legal explícita en contra.

## Parte 2 del playbook — Terminal de trading (ejecución + depósitos) — ESTACIONADO

El cliente anexó `playbook-landing-conversion1.md` con una **Parte 2**: la terminal tras el login
con **ticket Comprar/Vender, botón Depositar, barra Fondos/Equidad/Margen/P&L, confirmar orden,
1-click dealing, custodia, señales y patrones de retención (P&L-dopamina, riesgo reenmarcado como
"protección", depósito omnipresente)**.

Decisión de Orvex: se construye SOLO la capa **display/análisis** de esa terminal (navegador de
mercados, multi-gráfico, watchlists, alertas de precio, panel de noticias, workspaces). Se
**ESTACIONA** toda la capa de dinero/ejecución/custodia hasta que:

1. El cliente responda por escrito las 4 preguntas de arriba, y
2. Compliance confirme que la licencia cubre ejecución/custodia/depósitos en la jurisdicción, y
3. Se haga el trabajo real de compliance (KYC/AML obligatorio, avisos de riesgo prominentes, etc.).

Los patrones manipulativos que el propio playbook marca como dark-patterns (§9 + nota Parte 2) NO
se implementan en ningún caso.

## Registro

- 2026-07-04 — Cliente pide eliminar el marco. Orvex responde: se requiere alcance de la
  licencia por escrito antes de tocar producto. Documento creado, sin commitear.
- 2026-07-04 — Cliente anexa Parte 2 (terminal de trading con ejecución/depósitos/custodia).
  Orvex: se construye solo la capa display; ejecución/dinero/custodia ESTACIONADA hasta cierre
  legal. Cola `.claude/goal-queue-landing.md` actualizada en consecuencia.
