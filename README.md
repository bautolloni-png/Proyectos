# Bautista Tolloni — Proyectos

**→ [bautolloni-png.github.io/Proyectos](https://bautolloni-png.github.io/Proyectos/)**

CRM, lifecycle marketing y entregabilidad de email. Esto no es un CV: son las secuencias que corrí, los tests, los pipelines y los registros DNS que dejé publicados, más el producto que construí.

---

## Qué hay acá

### [El one-pager](https://bautolloni-png.github.io/Proyectos/) — interactivo

Diez secciones sobre trabajo real, con demos que se tocan:

| | |
|---|---|
| **Cold email** | Una secuencia de producción nodo por nodo — 20.268 contactos, tres pasos, variantes de asunto en cada envío |
| **A/B testing** | Selector de variantes con previsualización de bandeja de entrada |
| **Pipelines** | Explorador de etapas de CRM con leads integrados desde Meta Ads |
| **Entregabilidad** | Constructor interactivo de registros DMARC: `p=none/quarantine/reject` y `pct` |
| **Reporting** | Dashboards de Looker Studio en producción |
| **Templates** | Dos series de email maquetadas a mano en HTML |

### [Nesvir](./nesvir) — un SaaS, con el código y las decisiones

Un producto para capturar cómo funciona una empresa de verdad, sin obligarla a entrar en la plantilla de otro. Construido solo, de punta a punta.

- **[El case study](./nesvir/README.md)** — el problema, la apuesta, cinco decisiones de producto con su razonamiento, la feature que corté y por qué, los trade-offs y las métricas con las que lo validaría
- **[El código](./nesvir)** — Next.js 16, TypeScript, Supabase con row-level security, Mermaid.js
- **[Funcionando](https://nesvir.vercel.app)** — nesvir.vercel.app

El case study dice que corté `plantillas` porque se solapaba con `archivos`. La migración que lo hace está en [`nesvir/supabase/migrations`](./nesvir/supabase/migrations), con su fecha.

---

## Stack

**Entregabilidad** SPF · DKIM · DMARC · warm-up de dominio · reputación de remitente · Mailgun · MXToolbox · Google Postmaster Tools
**Email y lifecycle** Mailchimp · Snov.io · Doppler · HTML a mano · A/B testing
**CRM** GoHighLevel · Zoho · Bitrix24
**Outbound y automatización** Clay · n8n · Apollo.io · Linked Helper · Sales Navigator
**Analítica** Looker Studio · Power BI · GA4

---

[LinkedIn](https://www.linkedin.com/in/bautistatolloni) · bautolloni@gmail.com
