const FS_KEY = "foundersignal-state-v3";

const demos = {
  saas: [
    "B2B AI document summarizer for law firms that converts long case files into partner-ready summaries, risks, citations, and client update drafts.",
    "Small litigation law firms handling high document volume without dedicated knowledge management staff",
    "SaaS",
    "Legal teams will not trust summarization unless citations, confidentiality, review workflow, and error boundaries are explicit.",
    "Ability to package operational AI workflows with strong trust and documentation constraints",
    "Prototype",
    "Balanced",
  ],
  local: [
    "Automated inventory management for independent coffee shops that predicts stockouts, waste, supplier reorder timing, and weekly margin leakage.",
    "Independent coffee shop owners and operators managing inventory manually across one to three locations",
    "Local services",
    "Owners may resist another dashboard unless the tool proves immediate waste reduction or fewer emergency supplier runs.",
    "Practical understanding of small business operations and founder-led local distribution",
    "Idea",
    "Conservative",
  ],
  ai: [
    "Multi-agent system for autonomous LinkedIn lead outreach that researches prospects, drafts personalized messages, tracks objections, and creates follow-up tasks.",
    "Founder-led B2B service teams that need qualified conversations but cannot hire a full sales development team",
    "Productivity",
    "The system must avoid spam behavior, protect sender reputation, and prove that personalization leads to real conversations.",
    "Strong AI workflow taste and ability to package multi-agent operating systems",
    "Launched",
    "Aggressive",
  ],
};

function $(id) { return document.getElementById(id); }
function load() { return JSON.parse(localStorage.getItem(FS_KEY) || "{}"); }
function save(state) { localStorage.setItem(FS_KEY, JSON.stringify(state)); }
function wc(value) { return (value || "").trim().split(/\s+/).filter(Boolean).length; }
function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))); }
function lab(score) {
  return score >= 88 ? "Venture-Grade" : score >= 74 ? "Strong" : score >= 58 ? "Promising" : score >= 40 ? "Early" : "Weak";
}

function analyze(state) {
  const text = [state.idea, state.customer, state.concern, state.edge, (state.corrections || []).join(" ")].join(" ").toLowerCase();
  let base = 42 + Math.min(wc(state.idea), 30) * 0.75 + Math.min(wc(state.customer), 16) * 1.1 + Math.min(wc(state.concern), 20) * 0.7;
  base += state.edge ? 9 : 0;
  base += (state.corrections || []).length * 3;
  base += ({ Idea: 0, Prototype: 8, Launched: 13, Revenue: 19 }[state.stage] || 0);
  base += ({ Conservative: -2, Balanced: 2, Aggressive: 5 }[state.mode] || 0);
  if (/pay|price|revenue|sales|cost|money/.test(text)) base += 5;
  if (/urgent|manual|risk|compliance|time|staff|waste|lost|correction|regression/.test(text)) base += 7;
  if (/everyone|all businesses|anyone/.test(text)) base -= 8;
  if (/competition|copy|crowded/.test(text)) base -= 3;
  const score = clamp(base);
  return {
    ...state,
    score,
    label: lab(score),
    market: clamp(score + (state.customer && state.customer.length > 38 ? 8 : -5)),
    pain: clamp(score + (/urgent|manual|risk|cost|time|lost|staff|correction/.test(text) ? 10 : -4)),
    fit: clamp(score + (state.edge ? 13 : -9)),
    money: clamp(score + ({ Idea: -9, Prototype: -3, Launched: 6, Revenue: 15 }[state.stage] || 0)),
    build: clamp(score + ({ Conservative: 5, Balanced: 1, Aggressive: -4 }[state.mode] || 0)),
  };
}

function requireState() {
  const state = load();
  if (!state.idea) {
    location.href = "index.html";
    return null;
  }
  return analyze(state);
}

function meter(name, value) {
  return `<div class="meter"><small>${name}</small><b>${value}</b><div class="bar"><i style="width:${value}%"></i></div></div>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function codexBrief(r) {
  return `# Codex Build Brief

## Goal
Build a narrow MVP for: ${r.idea}

## Customer
${r.customer}

## Concern
${r.concern}

## Agent Goal
${r.goal || "Validate the idea, produce a buildable MVP scope, and identify the first customer proof loop."}

## Must Build
- Guided intake
- One strong outcome/report
- Expert correction loop
- Codex-ready build brief
- Copyable launch assets
- Vault handoff package

## Suggested Supabase Schema
\`\`\`sql
create table founder_signal_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  idea text not null,
  customer text not null,
  industry text not null,
  stage text not null,
  strategy_mode text not null,
  concern text not null,
  founder_edge text,
  signal_score integer not null,
  asset_hash text,
  owner_email text
);

alter table founder_signal_runs enable row level security;

create policy "owners can read their runs"
on founder_signal_runs for select
using (owner_email = auth.jwt() ->> 'email');

create policy "owners can insert their runs"
on founder_signal_runs for insert
with check (owner_email = auth.jwt() ->> 'email');
\`\`\`

## GitHub Loop
- Create an issue titled "FounderSignal execution: ${r.industry} MVP proof loop".
- Add the Codex build brief as the issue body.
- Add labels: founder-signal, build-week, validation-loop.
- Convert corrections into follow-up checklist items.
- Open a PR only after the validation checklist passes.

## Cron Function
\`\`\`ts
// api/cron/founder-signal-check.ts
export default async function handler(req, res) {
  // Run daily: review active validation runs, detect stale goals,
  // and generate the next founder action or GitHub issue update.
  res.status(200).json({ ok: true, job: "founder-signal-check" });
}
\`\`\`

## API Logic
- POST /api/agent-confrontation: run VC, security, and growth agents concurrently.
- POST /api/goal-execution: convert founder target into staged execution plan.
- POST /api/github-loop: create issue/PR tasks when GitHub token is configured.
- POST /api/cron/founder-signal-check: recurring goal review once persistence exists.

## Do Not Build Yet
- Accounts
- Payments
- Team dashboards
- Marketplace/community features

## User Stories
- As a founder, I can describe my idea and buyer so I can test clarity before building.
- As a founder, I can watch specialist agents confront the idea from VC, security, and growth angles.
- As a founder, I can correct the analysis so the next output reflects expert judgment.
- As a founder, I can generate a build brief so Codex can turn strategy into implementation.
- As a founder, I can export launch assets and a signed strategic asset record.

## Acceptance Criteria
- Required fields validate.
- Report changes by stage, strategy mode, concern, and correction.
- Agent confrontation returns live responses when Groq is configured.
- Correction loop shows before/after mutation.
- Tool schema, build brief, launch assets, and Vault package are copyable or downloadable.
- Mobile layout has no horizontal overflow.

## Test Plan
- Run each demo path.
- Trigger live agent confrontation.
- Apply one correction and verify the score/report changes.
- Run /goal execution and verify the staged plan changes with the target.
- Copy report, Codex brief, and tool schema.
- Download the signed Vault markdown.
- Verify Vault handoff link opens.
- Check mobile and desktop screenshots.`;
}

function skillDraft(r) {
  return `---
name: founder-signal-validation
description: Validate startup ideas, capture expert corrections, generate Codex-ready build briefs, and produce launch assets before product build.
---

# Founder Signal Validation

Workflow:
1. Clarify exact customer, pain, stage, concern, and founder edge.
2. Run specialist confrontation: VC, security architect, growth operator.
3. Score signal across market clarity, pain urgency, founder fit, monetization readiness, and build readiness.
4. Ask for expert correction.
5. Convert correction into a revised report and regression check.
6. Generate Codex build brief.
7. Generate launch assets and Vault handoff recommendation.

Current idea:
${r.idea}`;
}

function toolSchema(r) {
  return JSON.stringify({
    type: "function",
    function: {
      name: "run_founder_signal_validation",
      description: "Validate a startup idea, challenge it with specialist agents, apply corrections, and generate a Codex-ready build brief plus launch assets.",
      parameters: {
        type: "object",
        required: ["idea", "customer", "industry", "stage", "concern"],
        properties: {
          idea: { type: "string", description: "The startup idea or workflow to validate." },
          customer: { type: "string", description: "The exact buyer or user segment." },
          industry: { type: "string", description: "Market or category." },
          stage: { type: "string", enum: ["Idea", "Prototype", "Launched", "Revenue"] },
          strategy_mode: { type: "string", enum: ["Conservative", "Balanced", "Aggressive"] },
          concern: { type: "string", description: "The founder's biggest concern or risk." },
          founder_edge: { type: "string", description: "Unfair advantage, network, data access, or domain expertise." },
          expert_corrections: { type: "array", items: { type: "string" }, description: "Corrections that should mutate the brief and launch plan." },
        },
      },
    },
    example_input: {
      idea: r.idea,
      customer: r.customer,
      industry: r.industry,
      stage: r.stage,
      strategy_mode: r.mode,
      concern: r.concern,
      founder_edge: r.edge || "",
      expert_corrections: r.corrections || [],
    },
  }, null, 2);
}

function skillManifest(r) {
  return JSON.stringify({
    name: "FounderSignal_Bootstrap",
    version: "1.0.0",
    description: "Scaffolds a Next.js/Supabase project from validated founder intent.",
    input_contract: {
      founder_intent: "string",
      agent_validation_score: "integer",
      critical_risks: "string[]",
      founder_corrections: "string[]",
    },
    tools: [
      { name: "compile_spec", description: "Generates spec.md from validated founder intent." },
      { name: "init_schema", description: "Generates Supabase PostgreSQL schema.sql with RLS policies." },
      { name: "plan_tasks", description: "Generates independent Codex /goal checklist tasks." },
      { name: "setup_auth", description: "Configures owner-scoped RLS policies." },
      { name: "vault_handoff", description: "Packages final artifacts for ArkNet Digital Vault continuity." },
    ],
    requirements: ["gpt-5.6-sol", "supabase-cli", "vercel", "codex"],
    outputs: ["spec.md", "schema.sql", "tasks.txt", "AGENTS.md"],
    current_signal: {
      idea: r.idea,
      customer: r.customer,
      score: r.score,
      label: r.label,
    },
  }, null, 2);
}

function executionSpec(r) {
  return `# spec.md

## Product
${r.idea}

## Exact User
${r.customer}

## Problem Constraint
${r.concern}

## Founder Edge
${r.edge || "Not provided. Treat this as an open validation risk."}

## Positioning
FounderSignal compiles founder intent into execution-ready artifacts. The output is not advice; it is a bounded implementation packet for Codex, GitHub, and a founder validation loop.

## MVP Boundary
Build:
- Guided founder intake
- /goal execution loop
- Multi-agent confrontation
- Correction-to-regression loop
- Codex brief compiler
- GitHub issue packet
- Daily cron review hook
- Vault handoff artifact

Do not build:
- Auth
- Payments
- Team workspace
- Marketplace features
- Long-term data retention without RLS

## Agent Workflow
1. Define scope from buyer, pain, category, and stage.
2. Generate schema and implementation tasks.
3. Run specialist critique: VC, security, growth.
4. Capture founder correction.
5. Convert correction into a regression check.
6. Recompile spec, schema, tasks, and handoff.
7. Ship finished materials.`;
}

function implementationSchema(r) {
  return JSON.stringify({
    product: "FounderSignal compiled project",
    source_signal: {
      idea: r.idea,
      customer: r.customer,
      industry: r.industry,
      stage: r.stage,
      strategy_mode: r.mode,
      score: r.score,
      label: r.label,
    },
    database: {
      tables: [
        {
          name: "founder_signal_runs",
          rls: true,
          columns: [
            "id uuid primary key",
            "created_at timestamptz",
            "idea text not null",
            "customer text not null",
            "industry text not null",
            "signal_score integer not null",
            "owner_email text",
          ],
          policies: ["owner_select", "owner_insert"],
        },
        {
          name: "founder_signal_corrections",
          rls: true,
          columns: [
            "id uuid primary key",
            "run_id uuid references founder_signal_runs(id)",
            "correction text not null",
            "regression_check text not null",
            "previous_output_id text",
          ],
          policies: ["owner_select", "owner_insert"],
        },
      ],
    },
    api: {
      routes: [
        "POST /api/agent-confrontation",
        "POST /api/goal-execution",
        "POST /api/github-loop",
        "GET /api/cron/founder-signal-check",
      ],
    },
    outputs: ["spec.md", "schema.sql", "tasks.txt", "AGENTS.md", "Vault decision record"],
  }, null, 2);
}

function schemaSql(r) {
  return `-- schema.sql
-- FounderSignal compiled Supabase PostgreSQL schema

create extension if not exists "pgcrypto";

create table if not exists public.founder_signal_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  founder_intent text not null,
  target_customer text not null,
  industry text not null,
  stage text not null check (stage in ('Idea', 'Prototype', 'Launched', 'Revenue')),
  strategy_mode text not null check (strategy_mode in ('Conservative', 'Balanced', 'Aggressive')),
  founder_edge text,
  validation_score integer not null check (validation_score >= 0 and validation_score <= 100),
  signal_label text not null,
  critical_risks text[] not null default '{}',
  previous_response_id text,
  asset_hash text
);

create table if not exists public.founder_signal_corrections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  run_id uuid not null references public.founder_signal_runs(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  correction_text text not null,
  regression_check text not null,
  previous_response_id text,
  corrected_output jsonb not null default '{}'::jsonb
);

create table if not exists public.founder_signal_artifacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  run_id uuid not null references public.founder_signal_runs(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  artifact_type text not null check (artifact_type in ('spec_md', 'schema_sql', 'tasks_txt', 'agents_md', 'vault_md')),
  content text not null,
  content_hash text not null
);

create index if not exists founder_signal_runs_owner_id_idx on public.founder_signal_runs(owner_id);
create index if not exists founder_signal_runs_created_at_idx on public.founder_signal_runs(created_at desc);
create index if not exists founder_signal_corrections_run_id_idx on public.founder_signal_corrections(run_id);
create index if not exists founder_signal_corrections_owner_id_idx on public.founder_signal_corrections(owner_id);
create index if not exists founder_signal_artifacts_run_id_idx on public.founder_signal_artifacts(run_id);
create index if not exists founder_signal_artifacts_owner_id_idx on public.founder_signal_artifacts(owner_id);

alter table public.founder_signal_runs enable row level security;
alter table public.founder_signal_corrections enable row level security;
alter table public.founder_signal_artifacts enable row level security;

create policy "founder_signal_runs_select_own"
on public.founder_signal_runs
for select
to authenticated
using (auth.uid() = owner_id);

create policy "founder_signal_runs_insert_own"
on public.founder_signal_runs
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "founder_signal_runs_update_own"
on public.founder_signal_runs
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "founder_signal_runs_delete_own"
on public.founder_signal_runs
for delete
to authenticated
using (auth.uid() = owner_id);

create policy "founder_signal_corrections_select_own"
on public.founder_signal_corrections
for select
to authenticated
using (auth.uid() = owner_id);

create policy "founder_signal_corrections_insert_own"
on public.founder_signal_corrections
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "founder_signal_corrections_update_own"
on public.founder_signal_corrections
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "founder_signal_corrections_delete_own"
on public.founder_signal_corrections
for delete
to authenticated
using (auth.uid() = owner_id);

create policy "founder_signal_artifacts_select_own"
on public.founder_signal_artifacts
for select
to authenticated
using (auth.uid() = owner_id);

create policy "founder_signal_artifacts_insert_own"
on public.founder_signal_artifacts
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "founder_signal_artifacts_update_own"
on public.founder_signal_artifacts
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "founder_signal_artifacts_delete_own"
on public.founder_signal_artifacts
for delete
to authenticated
using (auth.uid() = owner_id);`;
}

function implementationTasks(r) {
  const plan = goalPlan(r);
  return `# tasks.txt

## P0 Foundational Setup
- [ ] Create standalone repository for the compiled MVP.
- [ ] Add environment variable validation for AI, Supabase, GitHub, and delivery keys.
- [ ] Create Supabase migration from schema.sql.
- [ ] Enable RLS on founder_signal_runs.
- [ ] Enable RLS on founder_signal_corrections.
- [ ] Enable RLS on founder_signal_artifacts.
- [ ] Add indexes for owner_id on every user-owned table.
- [ ] Add indexes for run_id on every child table.

## P0 Core Logic
- [ ] Capture founder_intent, target_customer, industry, stage, strategy_mode, and critical_risks.
- [ ] Generate validation_score from market clarity, pain urgency, founder fit, monetization, and build readiness.
- [ ] Generate spec.md from the current run state.
- [ ] Generate schema.sql from the current run state.
- [ ] Generate tasks.txt from the current run state.
- [ ] Generate AGENTS.md from the current run state.
- [ ] Generate GitHub issue packet from the current run state.
- [ ] Generate Vault handoff markdown from the current run state.

## P0 Goal Loop
${plan.stages.map((stage) => `- [ ] ${stage}`).join("\n")}

## P1 Correction Loop
- [ ] Store each founder correction as correction_text.
- [ ] Convert each correction into one regression_check.
- [ ] Store previous_response_id when OpenAI Responses API is configured.
- [ ] Recompile spec.md after every correction.
- [ ] Recompile schema.sql after every correction.
- [ ] Recompile tasks.txt after every correction.
- [ ] Recompile AGENTS.md after every correction.

## P1 Integration
- [ ] POST GitHub issue packet to /api/github-loop when GITHUB_TOKEN and repo are configured.
- [ ] Run /api/cron/founder-signal-check daily from Vercel Cron.
- [ ] Send build brief email only when RESEND_API_KEY is configured.

## P2 Verification Checkpoints
- [ ] Verify / loads without horizontal overflow.
- [ ] Verify /goal.html loads with a staged execution loop.
- [ ] Verify /report.html applies a correction and changes state.
- [ ] Verify /brief.html displays spec.md, schema.sql, tasks.txt, and AGENTS.md.
- [ ] Verify /api/agent-confrontation returns agent output or a truthful fallback.
- [ ] Verify /api/goal-execution returns JSON.
- [ ] Verify /api/github-loop returns issue packet or created issue response.
- [ ] Verify /api/cron/founder-signal-check returns daily review JSON.
- [ ] Verify public output contains no private project reference.`;
}

function agentsBlock(r) {
  return `# AGENTS.md

## FounderSignal Agentic Architecture

FounderSignal is an intent compiler. It converts raw founder instinct into Codex-ready implementation artifacts.

## Public Boundary
- This project is standalone.
- Reference the public ArkNet Digital Vault only as the continuity layer.
- Do not expose private project details.

## Workflow Order
CEO -> CTO -> Backend Logic -> Frontend -> Integration/API -> Security -> Testing -> Deployment -> Documentation -> Growth

## /goal Contract
Input: ${r.goal || "/goal find 10 leads and draft personalized outreach for this ICP"}

The agent must break the goal into staged work:
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

When the OpenAI Responses API is configured, preserve continuity by storing previous_response_id and using it on the next correction pass. In this static Build Week deployment, the app exposes the state contract without pretending server-side OpenAI credentials exist.

## Required Outputs
- spec.md
- schema.sql
- tasks.txt
- reusable tool schema
- GitHub issue packet
- Vault handoff markdown

## Current Compiled Signal
Idea: ${r.idea}
Customer: ${r.customer}
Score: ${r.score}/100 (${r.label})`;
}

function launchMemo(r) {
  return `Launch memo

Buyer: ${r.customer}
Signal: ${r.score}/100 (${r.label})
Offer: I am testing a focused way to solve: ${r.concern.toLowerCase()}
Proof to collect: saved time, avoided cost, reduced risk, or paid pilot commitment.
Next 24 hours: contact 10 exact-fit buyers and ask if the outcome is worth paying for.`;
}

function shell(active) {
  const pages = [["index.html", "Analyze"], ["goal.html", "/Goal"], ["report.html", "Agent Loop"], ["brief.html", "Codex Brief"], ["assets.html", "Launch Assets"], ["vault-handoff.html", "Vault Handoff"]];
  return `<aside class="rail"><div class="brand"><div class="mark">FS</div><div><b>FounderSignal</b><span>by ArkNet Digital</span></div></div><nav class="nav">${pages.map((page) => `<a class="${active === page[1] ? "active" : ""}" href="${page[0]}">${page[1]} <i></i></a>`).join("")}</nav><a class="vault-link" href="https://www.arknet.digital/vault.html" target="_blank" rel="noopener"><span>Public Vault</span><span style="margin-left:auto;color:var(--teal2)">open</span></a><small class="rail-foot">For founders who need sharper judgment before turning an idea into an asset.</small></aside>`;
}

function mobile() {
  return `<nav class="mobile-nav"><a href="index.html">Analyze</a><a href="goal.html">Goal</a><a href="report.html">Loop</a><a href="brief.html">Brief</a><a href="assets.html">Assets</a><a href="vault-handoff.html">Vault</a></nav>`;
}

function pageBar(backHref, backLabel, title, nextHref, nextLabel) {
  return `<div class="page-bar"><a class="back-link" href="${backHref}"><span>&larr;</span>${backLabel}</a><b>${title}</b>${nextHref ? `<a class="next-link" href="${nextHref}">${nextLabel}<span>&rarr;</span></a>` : "<i></i>"}</div>`;
}

function goalPlan(r) {
  const target = r.goal || "Find first customer proof";
  const lower = target.toLowerCase();
  const leadCount = /25/.test(lower) ? 25 : /10|ten/.test(lower) ? 10 : 7;
  return {
    target,
    stages: [
      `Define the exact buyer from the current ICP: ${r.customer}.`,
      `Generate ${leadCount} lead hypotheses from channels the founder can reach directly.`,
      "Draft a personalized opener tied to the buyer pain and proof request.",
      "Run a security and trust check before collecting sensitive buyer data.",
      "Turn replies into correction notes and rerun the signal score.",
      "Package the revised decision record for Codex and Vault handoff.",
    ],
    doneWhen: [
      `${leadCount} named lead hypotheses exist.`,
      "Each lead has one personalized outreach angle.",
      "At least one paid-proof question is ready.",
      "The Codex brief includes the latest correction.",
    ],
  };
}

async function copyText(text, button) {
  await navigator.clipboard.writeText(text);
  const old = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = old; }, 1300);
}

async function signedMarkdown(r) {
  const payload = JSON.stringify({ idea: r.idea, customer: r.customer, industry: r.industry, stage: r.stage, mode: r.mode, score: r.score, label: r.label, corrections: r.corrections || [], created_at: new Date().toISOString() });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `# Authenticated Strategic Asset

Asset: FounderSignal Decision Record
SHA-256: ${hash}
Created: ${new Date().toISOString()}

## Idea
${r.idea}

## Customer
${r.customer}

## Signal
${r.score}/100 (${r.label})

## Corrections
${(r.corrections || []).map((c) => `- ${c}`).join("\n") || "- None"}

## Launch Memo
${launchMemo(r)}
`;
}

function downloadFile(name, text) {
  const blob = new Blob([text], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
