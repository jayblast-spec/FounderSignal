# FounderSignal Agentic Architecture

FounderSignal is a standalone Build Week project by ArkNet Digital. It acts as an intent compiler: raw founder input becomes Codex-ready execution artifacts.

## Model Selection & Topology

- **Strategic Validation Core:** `gpt-5.6-sol` prompt architecture for deep technical reasoning and constraint verification.
- **Asset Compilation Line:** `gpt-5.6-terra/luna` style contract for low-latency structural markdown, SQL, and JSON generation.
- **Public Demo Runtime:** Groq-compatible endpoint plus deterministic compiler fallback, so the Build Week demo remains verifiable without pretending unavailable credentials exist.

## State Management & Token Optimization

To prevent drift during correction cycles, the execution pipeline preserves state by passing `previous_response_id` to `/api/refine-artifacts`. Each correction becomes a regression check before the artifact set is handed to Codex or Vault.

## Public Boundary

- Keep this project standalone.
- Reference the public ArkNet Digital Vault only as the continuity layer.
- Do not expose private project details.

## Agent Pipeline

CEO -> CTO -> Backend Logic -> Frontend -> Integration/API -> Security -> Testing -> Deployment -> Documentation -> Growth

## Product Contract

FounderSignal must produce finished materials, not only advice:

- `spec.md`
- `schema.sql`
- `tasks.txt`
- reusable OpenAI tool schema
- GitHub issue packet
- scheduled review hook
- Vault handoff markdown

## /goal Execution Loop

The `/goal` workflow turns a founder target into staged execution:

1. Define scope.
2. Generate schema.
3. Validate constraints.
4. Produce tasks.
5. Package handoff.

## Correction Loop

Every expert correction must become:

- a revised output,
- a regression check,
- and an updated Codex task.

When OpenAI Responses API credentials are configured, store and reuse `previous_response_id` for continuity across correction passes. In this public deployment, the app exposes the state contract and deterministic artifact compiler without pretending missing server credentials exist.

## FounderSignal Skill

```json
{
  "name": "FounderSignal_Bootstrap",
  "version": "1.0.0",
  "description": "Scaffolds a Next.js/Supabase project from validated founder intent.",
  "input_contract": {
    "founder_intent": "string",
    "agent_validation_score": "integer",
    "critical_risks": "string[]",
    "founder_corrections": "string[]",
    "previous_response_id": "string"
  },
  "tools": [
    {
      "name": "compile_spec",
      "description": "Generates spec.md from validated founder intent."
    },
    {
      "name": "init_schema",
      "description": "Generates Supabase PostgreSQL schema.sql with explicit RLS policies."
    },
    {
      "name": "plan_tasks",
      "description": "Generates independent Codex /goal checklist tasks."
    },
    {
      "name": "apply_regression_check",
      "description": "Turns founder corrections into regression checks before artifact handoff."
    },
    {
      "name": "vault_handoff",
      "description": "Packages final artifacts for ArkNet Digital Vault continuity."
    }
  ],
  "requirements": ["gpt-5.6-sol", "supabase-cli", "vercel", "codex"],
  "outputs": ["spec.md", "schema.sql", "tasks.txt", "manifest.json"]
}
```

## Verification

Before reporting success:

- Fetch the live route.
- Confirm the expected text appears.
- Hit each deployed API endpoint.
- Verify no private project reference appears in public output.
