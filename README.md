# FounderSignal

FounderSignal is a standalone OpenAI Build Week 2026 project by ArkNet Digital.

**Pitch:** FounderSignal is an autonomous idea-to-execution compiler. It turns raw founder intent into Codex-ready system blueprints: `spec.md`, `schema.sql`, `tasks.txt`, `manifest.json`, GitHub issue packets, eve agent files, and a Vault handoff package.

Live demo: https://foundersignal-buildweek.vercel.app/

FounderSignal is not a chat interface. It is a workflow utility for founders and software teams who need to move from vague business instinct to executable architecture without losing constraints, security rules, or implementation context.

## Judge Path

Use this sequence to verify the complete Build Week loop:

1. Open https://foundersignal-buildweek.vercel.app/
2. Select a one-click demo: `SaaS`, `Local Biz`, or `Agent Workflow`.
3. Open `Codex Brief`.
4. Click `Compile Live`.
5. Add a correction such as `Must support completely localized data isolation rules.`
6. Click `Apply Correction + Recompile`.
7. Verify the `System Updated: Regression check passed` state.
8. Inspect `SPEC.MD`, `SCHEMA.SQL`, `TASKS.TXT`, and `MANIFEST.JSON`.
9. Copy the Codex brief or manifest.
10. Open `Vault Handoff` and run the ArkNet Digital Vault handoff flow.

Expected outcome: the same founder intent becomes a corrected, machine-parsable implementation packet instead of a loose AI answer.

## Why It Fits Build Week

FounderSignal is built around the 2026 shift from AI answers to finished professional work:

- **Codex-first output:** Generates implementation artifacts a repo-level agent can execute.
- **Self-improving correction loop:** Converts practitioner feedback into regression checks before recompiling artifacts.
- **Reusable skill packaging:** Emits a `FounderSignal_Bootstrap` manifest and provides reusable skill files under `eve-agent/skills`.
- **Production boundary:** Produces Supabase PostgreSQL schema and explicit RLS policies instead of generic database advice.
- **Continuity:** Packages final corrected state for the public ArkNet Digital Vault continuity layer.

Public metrics are intentionally limited to verifiable proof points. FounderSignal does not claim production volume, latency SLA, or uptime history that has not been measured.

## What It Generates

- `spec.md` - functional requirements, constraints, and user workflows.
- `schema.sql` - Supabase PostgreSQL tables, relations, indexes, and RLS policies.
- `tasks.txt` - atomic Codex `/goal` checklist tasks.
- `manifest.json` - reusable Codex Skill manifest.
- `AGENTS.md` block - repo-ready agent operating instructions.
- GitHub issue packet - implementation-ready issue title, labels, and checklist.
- Vault package - signed markdown handoff for ArkNet Digital Vault reference.

## Use FounderSignal as a Codex Skill

FounderSignal can be used as a reusable Codex workflow, not only as a hosted demo.

1. Copy the agent instructions from `AGENTS.md` into a Codex project or thread.
2. Use `eve-agent/skills/startup-validation.md` as the validation skill.
3. Use `eve-agent/skills/supabase-rls.md` for database and RLS generation.
4. Use `eve-agent/tools/compile_intent.ts` as the compile tool contract.
5. Use the generated `manifest.json` tab in the live app as the portable skill descriptor.

Minimal skill invocation contract:

```json
{
  "founder_intent": "B2B AI document summarizer for law firms",
  "agent_validation_score": 84,
  "critical_risks": ["data privacy", "multi-tenant isolation", "workflow adoption"],
  "founder_corrections": ["Must support firm-level data isolation"],
  "outputs": ["spec.md", "schema.sql", "tasks.txt", "manifest.json"]
}
```

The generated tasks are formatted as independent Markdown checklist items so they can be pasted into a Codex `/goal` execution loop.

## Vercel eve Agent Shape

The repository includes an eve-style durable agent directory:

```text
eve-agent/
  agent.ts
  instructions.md
  tools/
  skills/
  channels/
  schedules/
  subagents/
```

This mirrors the new Vercel eve model:

- `agent.ts` defines model and runtime configuration.
- `instructions.md` defines the agent charter.
- `tools/` defines compile, GitHub, and Vault handoff actions.
- `skills/` stores reusable startup validation and Supabase RLS instructions.
- `channels/github.ts` describes GitHub work intake.
- `schedules/daily-signal-check.md` defines a recurring signal review.
- `subagents/` delegates security and growth review.

Live proof endpoint:

```bash
curl https://foundersignal-buildweek.vercel.app/api/eve-manifest
```

## API Surface

The public deployment exposes these Build Week endpoints:

```text
POST /api/agent-confrontation
POST /api/goal-execution
POST /api/compile-brief
POST /api/refine-artifacts
POST /api/github-loop
POST /api/vault-commit
GET  /api/eve-manifest
GET  /api/cron/founder-signal-check
```

Example compile request:

```bash
curl -X POST https://foundersignal-buildweek.vercel.app/api/compile-brief \
  -H "Content-Type: application/json" \
  -d "{\"intent\":\"Multi-agent LinkedIn lead outreach system\",\"score\":82,\"risks\":[\"platform policy\",\"deliverability\",\"personalization quality\"]}"
```

## GitHub Loop

FounderSignal includes repository-facing proof assets:

- `.github/ISSUE_TEMPLATE/foundersignal-compile.yml`
- `.github/pull_request_template.md`
- `.github/workflows/foundersignal-agent-evals.yml`
- `GITHUB_INTEGRATION.md`
- `SYSTEM_ARCHITECTURE.md`

The app can generate an implementation issue packet through `/api/github-loop`, making the output useful for a real engineering queue instead of ending at a report.

## Security Guardrails

- Generated database artifacts target Supabase PostgreSQL primitives.
- Every generated table must include `enable row level security`.
- RLS policies are emitted explicitly for read, insert, update, and delete where applicable.
- The public demo keeps credential-dependent AI work behind optional environment variables and deterministic fallbacks.
- ArkNet Digital Vault is referenced as a public continuity handoff layer; this repo does not write into ArkNet OS or the arknet.digital project.

## Local Development

Optional environment variable:

```bash
GROQ_API_KEY=...
```

Run locally with Vercel:

```bash
npx vercel dev
```

Deploy:

```bash
npx vercel deploy --prod
```

Without `GROQ_API_KEY`, the UI still works with deterministic local artifact generation. With it, `/api/agent-confrontation` and `/api/compile-brief` can use the live model-backed path.

## File Map

```text
index.html                         Product shell and live playground
platform.css                       Shared platform UI system
platform.js                        Route shell and navigation helpers
foundersignal-runtime.js           Compile, refine, vault, and tab interactions
api/compile-brief.js               Artifact compiler endpoint
api/refine-artifacts.js            Correction and regression endpoint
api/github-loop.js                 GitHub issue packet endpoint
api/vault-commit.js                Vault handoff endpoint
api/eve-manifest.js                eve agent manifest endpoint
eve-agent/                         eve-style agent source
AGENTS.md                          Codex operating instructions
SYSTEM_ARCHITECTURE.md             Technical architecture proof
SUBMISSION.md                      Devpost narrative and judge walkthrough
```

## Submission Narrative

FounderSignal compresses the idea-to-execution gap. It lets a founder describe a business system once, then produces the artifacts a developer or Codex agent needs to begin implementation with clear constraints, database security, task order, and correction history.

The project demonstrates useful intelligence by turning uncertainty into finished materials.
