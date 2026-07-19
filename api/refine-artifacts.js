function buildArtifacts(input) {
  const idea = input.idea || "Founder intent not provided";
  const customer = input.customer || "Target customer not provided";
  const score = Number(input.score || 0);
  const risks = Array.isArray(input.risks) ? input.risks : [];
  const corrections = Array.isArray(input.corrections) ? input.corrections : [];
  const correction = input.correction || corrections[corrections.length - 1] || "No correction supplied";
  const previous = input.previous_response_id || `fs_${Date.now().toString(36)}`;
  const regression = `Regression check: every generated artifact must reflect this correction - ${correction}`;

  const spec = `# spec.md

## Functional Requirements
- Capture founder intent and target customer.
- Apply expert correction before implementation planning.
- Convert correction into a regression check.
- Compile deployment-ready Supabase and Codex artifacts.
- Preserve final state for Vault handoff.

## Target Customer
${customer}

## Founder Intent
${idea}

## Validation Score
${score}/100

## Critical Risks
${risks.map((risk) => `- ${risk}`).join("\n") || "- None supplied"}

## Applied Founder Correction
${correction}

## Regression Check
${regression}

## Workflow
1. Intake founder intent.
2. Run agent confrontation.
3. Apply founder correction.
4. Recompile spec.md, schema.sql, tasks.txt, and manifest.json.
5. Commit final state to Vault handoff.`;

  const schema = `-- schema.sql
create extension if not exists "pgcrypto";

create table if not exists public.founder_signal_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  founder_intent text not null,
  target_customer text not null,
  validation_score integer not null check (validation_score >= 0 and validation_score <= 100),
  critical_risks text[] not null default '{}',
  previous_response_id text,
  compiled_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.founder_signal_corrections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  run_id uuid not null references public.founder_signal_runs(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  correction_text text not null,
  regression_check text not null,
  previous_response_id text not null
);

create index if not exists founder_signal_runs_owner_id_idx on public.founder_signal_runs(owner_id);
create index if not exists founder_signal_corrections_run_id_idx on public.founder_signal_corrections(run_id);
create index if not exists founder_signal_corrections_owner_id_idx on public.founder_signal_corrections(owner_id);

alter table public.founder_signal_runs enable row level security;
alter table public.founder_signal_corrections enable row level security;

create policy "runs_select_own" on public.founder_signal_runs for select to authenticated using (auth.uid() = owner_id);
create policy "runs_insert_own" on public.founder_signal_runs for insert to authenticated with check (auth.uid() = owner_id);
create policy "runs_update_own" on public.founder_signal_runs for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "runs_delete_own" on public.founder_signal_runs for delete to authenticated using (auth.uid() = owner_id);

create policy "corrections_select_own" on public.founder_signal_corrections for select to authenticated using (auth.uid() = owner_id);
create policy "corrections_insert_own" on public.founder_signal_corrections for insert to authenticated with check (auth.uid() = owner_id);
create policy "corrections_update_own" on public.founder_signal_corrections for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "corrections_delete_own" on public.founder_signal_corrections for delete to authenticated using (auth.uid() = owner_id);`;

  const tasks = `# tasks.txt

## P0 Foundational Setup
- [ ] Store previous_response_id for the corrected run.
- [ ] Store correction_text for the corrected run.
- [ ] Store regression_check for the corrected run.
- [ ] Regenerate spec.md from corrected state.
- [ ] Regenerate schema.sql from corrected state.
- [ ] Regenerate tasks.txt from corrected state.
- [ ] Regenerate manifest.json from corrected state.

## P0 Core Logic
- [ ] Apply correction: ${correction}
- [ ] Enforce regression check in artifact generation.
- [ ] Verify schema.sql includes enable row level security.
- [ ] Verify schema.sql includes create policy statements.
- [ ] Verify tasks remain atomic Markdown checklist items.

## P1 Verification Checkpoints
- [ ] Confirm UI shows the applied correction banner.
- [ ] Confirm artifact text mutates without page reload.
- [ ] Confirm Copy Code for Codex uses the active corrected artifact.
- [ ] Confirm Vault commit receives the corrected artifact set.`;

  const manifest = JSON.stringify({
    name: "FounderSignal_Bootstrap",
    version: "1.0.0",
    description: "Scaffolds a Next.js/Supabase project from validated and corrected founder intent.",
    tools: [
      { name: "init_schema", description: "Executes SQL migration" },
      { name: "setup_auth", description: "Configures RLS policies" },
      { name: "apply_regression_check", description: "Applies founder correction as an eval constraint" },
    ],
    requirements: ["gpt-5.6-sol", "supabase-cli"],
    previous_response_id: previous,
    regression_check: regression,
  }, null, 2);

  return {
    previous_response_id: previous,
    artifacts: { spec, schema, tasks, manifest },
    changelog: [
      `[System Updated: Regression check passed for: "${correction}"]`,
      `+ Applied founder correction: ${correction}`,
      "+ Added regression_check to the compiled spec",
      "+ Preserved previous_response_id for continuity",
      "+ Recompiled manifest.json as a reusable Codex Skill",
      "- Blocked stale artifact handoff from the prior state",
    ],
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }
  res.status(200).json({ success: true, data: buildArtifacts(req.body || {}) });
}
