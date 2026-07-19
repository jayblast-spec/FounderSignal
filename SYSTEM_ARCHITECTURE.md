# FounderSignal System Architecture

FounderSignal is an autonomous idea-to-execution compiler for OpenAI Build Week. It positions Codex as the reasoning engine for business workflow architecture, not as an autocomplete layer.

## Core Flow

```text
Founder Intent
  -> Validation Engine
  -> Specialist Agent Debate
  -> Codex Artifact Compiler
  -> Practitioner Correction Loop
  -> Regression Check
  -> Vault Handoff
```

## Codex-First Execution Model

FounderSignal treats a startup idea as a source object. The system compiles that object into finished development materials:

- `spec.md`: product requirements, constraints, and user workflows
- `schema.sql`: Supabase PostgreSQL tables, relationships, indexes, and RLS policies
- `tasks.txt`: atomic implementation tasks for a Codex `/goal` loop
- `manifest.json`: reusable skill-style workflow contract

## Scenario Domains

### SaaS: Cloud-Native Legal Summarizer

Codex compiles a secure multi-tenant service blueprint with API routes, Supabase schema, storage boundaries, and RAG-ready PDF processing constraints.

### Local Biz: Edge Inventory Dashboard

Codex compiles an offline-first React dashboard with local persistence, sync rules, low-stock alerts, and edge-ready deployment notes.

### Agent Workflow: Autonomous Sales Hub

Codex compiles a recursive sales agent loop: prospect research, tone analysis, personalized message generation, rejection feedback, and correction strategy.

## Infrastructure Boundary

- Frontend: static Vercel deployment with platform shell and workflow pages
- Backend: Vercel Serverless Functions
- Agent package: Vercel eve-style `eve-agent/` directory
- Automation: Vercel Cron at `/api/cron/founder-signal-check`
- GitHub control plane: issue template, PR template, and agent eval workflow
- Data Contract: Supabase-ready PostgreSQL artifacts with explicit RLS
- Continuity: ArkNet Digital Vault public reference only
- Repository Safety: standalone Build Week project; does not write into ArkNet OS or ArkNet Digital

## Vercel eve Shape

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

FounderSignal uses this structure to show how the platform can become a durable production agent: the main agent compiles intent, tools emit artifacts, skills load domain rules, the GitHub channel prepares implementation packets, schedules run daily checks, and subagents review security and growth risks.

## Differentiation

| Capability | IDE Assistant | FounderSignal |
| --- | --- | --- |
| Primary mode | Autocomplete and chat | System orchestration |
| Output | Code snippets | Complete execution packets |
| State | IDE-local | API-first workflow contract |
| Correction | Manual rewrite | Regression-aware artifact recompilation |
| Handoff | Developer copy/paste | Codex brief plus Vault commit |
