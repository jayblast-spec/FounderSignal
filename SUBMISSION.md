# FounderSignal: OpenAI Build Week Submission

## Project Title

FounderSignal: The Autonomous Idea-to-Execution Compiler

## Headline

Most founders do not need more ideas. They need a deterministic execution system before they build. FounderSignal compiles raw human intent into production-ready, Codex-executable development briefs.

## Live Demo

https://foundersignal-buildweek.vercel.app/

## Builder Proof

https://foundersignal-buildweek.vercel.app/builder.html

Use this route when a reviewer wants the shortest path to inspect the full public proof set: live workflow, Codex compiler, API reference, GitHub packet, eve agent directory, Vault handoff, repository link, and submission materials.

## Project Narrative

FounderSignal proves that the gap between founder strategy and repository bootstrapping can be compressed dramatically. The platform runs a multi-step validation pipeline, processes practitioner corrections through a `previous_response_id` continuity contract, and outputs structured technical blueprints ready for Codex or an automated IDE workspace.

The live Build Week deployment demonstrates the system through a Groq-powered public agent endpoint and deterministic compiler fallbacks. The architecture is designed around the GPT-5.6 Sol/Terra prompt contract for deeper OpenAI runtime integration.

Note: public metrics are limited to verifiable Build Week proof points. FounderSignal does not claim production volume, latency SLA, or uptime history that has not been measured.

## What It Does

- Runs one-click founder demo inputs for SaaS, Local Business, and Agent Workflow scenarios.
- Executes a VC/Security/Growth agent confrontation loop.
- Converts founder corrections into regression checks.
- Mutates `spec.md`, `schema.sql`, `tasks.txt`, and `manifest.json` in place.
- Generates a Codex Skill manifest named `FounderSignal_Bootstrap`.
- Produces Supabase-native SQL with explicit RLS policies.
- Creates GitHub loop packets and scheduled review endpoints.
- Commits the corrected artifact state through a Vault handoff endpoint with session hash.

## Key Innovations

- **Recursive `/goal` Pattern:** Orchestrates staged agent work to maintain state across architectural decisions.
- **Direct-to-IDE Artifacts:** Generates machine-parsable `spec.md`, `schema.sql`, `tasks.txt`, and `manifest.json` for immediate repository bootstrapping.
- **Self-Improving Evals:** Traces practitioner input into regression checks, then recompiles artifacts in place.
- **Data Continuity:** Packages final state for ArkNet Digital Vault handoff with a content hash and session id.

## Judge Verification Path

```text
[1. Select Demo] -> [2. Open Codex Brief] -> [3. Compile Live]
                                                    |
                                                    v
[6. Commit to Vault] <- [5. View Manifest/Schema] <- [4. Apply Correction]
```

1. Open https://foundersignal-buildweek.vercel.app/
2. Click **Open Agent Console**.
3. Select **Agent Mission** or another mission packet.
4. Click **Run Workflow** and inspect the VC, security, and growth cards.
5. Open **Codex Brief**.
6. Click **Compile Live**.
7. In **Founder correction**, enter: `Must support completely localized data isolation rules.`
8. Click **Apply Correction**.
9. Verify **System updated: regression check passed** and inspect **SCHEMA.SQL** plus **MANIFEST.JSON**.
10. Open **Launch Assets** and click **Generate GitHub Packet**.
11. Open **Vault Handoff**.
12. Click **Commit Assets** and verify the `SESSION_...` commit id.
13. Open **Builder Proof** to inspect the full evidence map and repository link.

## Technical Implementation

- Static multi-page frontend deployed on Vercel.
- Vercel serverless endpoints:
  - `POST /api/agent-confrontation`
  - `POST /api/compile-brief`
  - `POST /api/refine-artifacts`
  - `POST /api/goal-execution`
  - `POST /api/github-loop`
  - `GET /api/cron/founder-signal-check`
  - `POST /api/vault-commit`
- Supabase-ready generated schema with explicit `enable row level security` and `create policy` statements.
- Artifact compiler guardrails that reject non-compliant model output and fall back to safe SQL/task generation.

## Impact

FounderSignal saves founders and developers hours of ambiguous planning by turning idea validation into executable architecture. The output is not a chat transcript; it is a repo-ready implementation packet.
