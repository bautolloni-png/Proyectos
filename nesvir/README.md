# Nesvir — operational knowledge that people actually trust

**A SaaS for capturing how a company actually works, without forcing it into someone else's template.**

Live: [nesvir.vercel.app](https://nesvir.vercel.app) · Built solo, end to end — problem framing, product decisions, design and code.

---

## The problem

Every company runs on operational knowledge that lives in three places: someone's head, a chat thread, and a document nobody has opened in two years. When that person leaves or gets busy, the knowledge goes with them.

The tools that claim to solve this mostly don't, for one of two reasons:

- **Generic wikis** (Notion, Confluence) give you an empty page. A process is not a page — it has steps, branches, decision points and attached material. People give up on the formatting before they finish writing it down.
- **Rigid process tools** give you a predefined module — "onboarding", "sales", "support" — and every company that doesn't work that way has to lie to the software.

Both failures share a root cause: the tool decides the shape of the knowledge before it knows anything about the company.

## The bet

**Model the one thing every process has in common — an ordered sequence of steps, where some steps are decisions — and refuse to model anything else.**

No predefined modules. No categories. A process is a name and a list of steps; everything else is optional and hidden until asked for.

---

## Product decisions

### 1. Two step types, and only two

A step is either an **action** or a **decision**. That's the whole vocabulary.

It's enough to auto-generate a flow diagram (rendered with Mermaid, live as you type), which means the person writing the process gets a visual back for free — without ever opening a diagramming tool. And it's few enough that nobody has to learn a taxonomy before writing their first process.

The alternative — richer step types, swimlanes, roles per step — buys expressiveness at the cost of the only moment that matters: whether someone finishes writing down the first process at all.

### 2. Progressive disclosure, applied twice

The same principle governs both the write and the read view:

| View | Visible immediately | Behind a toggle |
|---|---|---|
| Create a process | Name + step editor, with live diagram preview | Objective, files, videos, links, notes |
| Read a process | Diagram + numbered steps | Files, videos, links, objective, observations |

A form with fourteen fields reads as work. The same form with two fields and an *"Add more detail"* link reads as a quick task. The fields are identical — the perceived cost is not.

On the read side the logic inverts but leads to the same layout: someone opening a process at 9am needs the steps, not the attachments. Attachments are what you go looking for *after* you know which step you're stuck on.

### 3. The freshness badge — the decision I'd defend hardest

Every process carries an *"Updated N days ago"* badge, in three tiers:

| Age | Tier | Treatment |
|---|---|---|
| Under 30 days | Recent | Accent — read it with confidence |
| 30–90 days | Medium | Neutral grey — no signal either way |
| Over 90 days | Stale | **Amber** — verify before you rely on this |

This is the feature that addresses why knowledge bases die. They don't fail because nothing gets written; they fail because after a year nobody can tell which pages are still true. One wrong answer from a stale page and people stop trusting the whole system — and go back to asking a colleague.

The badge doesn't fix staleness. It makes staleness *visible*, which is a smaller and much more achievable goal: the reader gets a calibrated confidence signal, and the owner gets a nudge with a deadline attached. Amber at 90 days is deliberately uncomfortable.

### 4. Registration creates the company

Signing up creates the company and the admin user in one database trigger. No "create your workspace" step, no invite flow before you can see anything.

The cost of this is real: it makes the multi-tenant model an assumption baked into the very first write, instead of a decision made later. I took it because the alternative — three screens before a user sees a single feature — is where solo evaluators drop off.

Every row is isolated by company through Postgres row-level security, not through application code. A missed `where` clause in a query is then a bug that returns nothing, not a bug that leaks another company's processes.

### 5. Email confirmation stays on

Supabase ships with "Confirm email" enabled. Turning it off makes local testing faster and is what most side projects do.

I left it on, because a signup flow that has never been tested with a real inbox round-trip is a flow that breaks on the first real user. The friction I feel in development is the friction I'd otherwise discover in production.

---

## What I cut

**Templates.** The schema originally had a `plantillas` field on every process. It shipped, and then I removed it:

> `plantillas` overlapped with `archivos` and added no differential value in the MVP.
> — `supabase/migrations/0001_remove_plantillas.sql`

Two fields that hold attached material, distinguished only by the author's intent at the moment of upload, is a distinction users don't reliably make and can't be expected to maintain. It made the form longer and the data model weaker at the same time.

Removing something already built is harder than not building it. Keeping it would have been free in the short term and would have cost a field in every form, forever.

**Editing an existing process** does not have its own screen yet, and the README says so. Creating a process is the flow that decides whether the product is worth anything; editing is the flow that decides whether it survives. In that order, on purpose.

---

## Tradeoffs I'd defend, and ones I wouldn't

**Would defend:**
- Two step types over an expressive taxonomy — adoption beats expressiveness in a tool nobody is required to use.
- RLS over application-level filtering — makes the dangerous failure mode impossible rather than unlikely.
- Shipping without edit — the create flow is the one that proves or kills the premise.

**Wouldn't:**
- Database types are maintained by hand rather than generated, because the project isn't linked to a real Supabase instance. This is debt, and it will produce a runtime bug the first time the schema and the types drift.
- No tests. For a solo MVP that changes shape weekly this is a defensible trade for maybe two more months. Not beyond that.

**A constraint I hit and worked around:** the original deploy target was Netlify. Its Next.js plugin didn't support Next 16 — it failed to detect the version and aborted the build, and without the plugin Netlify only serves static files, so auth, server actions and dynamic routes were all dead. I evaluated pinning to Next 15 versus changing host, and moved to Vercel, which supported Next 16 from day one. Downgrading the framework to keep the host would have been optimizing for the wrong variable.

---

## How I'd measure it

No usage data yet — the product is built, not validated. What I'd instrument first, in order:

| Question | Metric |
|---|---|
| Does anyone finish the first process? | % of signups that create ≥1 process with ≥3 steps |
| Is it a filing cabinet or a tool? | Reads per process per week, by non-authors |
| Does the freshness badge do anything? | Update rate on processes that crossed 90 days vs. those that didn't |
| Did we solve the real problem? | Share of processes whose reader is not the author |

That last one is the only metric that matters. A knowledge base read exclusively by the people who wrote it has not preserved anything.

---

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind · Supabase (Postgres, Auth, RLS) · Mermaid.js · Vercel

---

## Status

Working: registration and login, dashboard with global search, process creation with live diagram preview, process detail view, freshness badges.

Not built: editing an existing process, team invitations, versioning.
