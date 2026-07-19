const compilerPrompt = `You are the Technical Architect Core of FounderSignal. Your task is to compile raw human startup intent, validation metrics, and founder corrections into a machine-parsable, deployment-ready specification.

Do not include conversational introductions, filler text, or concluding notes. Output only JSON with these exact string keys: spec, schema, tasks, manifest.

CONSTRAINTS
- Database primitives must map perfectly to Supabase PostgreSQL types.
- Row Level Security policies must be explicitly written for all data operations.
- Tasks must be independent, atomic, and formatted as a strict Markdown checklist ready for a Codex /goal context loop.

EXECUTION OUTPUT TARGETS
1. SPECIFICATION (spec.md): Functional requirements, constraints, and target user workflows.
2. SCHEMATICS (schema.sql): Production-grade database tables, relations, and RLS rules.
3. LOGISTICS (tasks.txt): A prioritized implementation backlog split into foundational setup, core logic, and verification checkpoints.
4. CODEX SKILL (manifest.json): Reusable skill manifest with name, version, description, tools, requirements, and outputs.`;

function isCompliant(data) {
  if (!data || typeof data.spec !== "string" || typeof data.schema !== "string" || typeof data.tasks !== "string" || typeof data.manifest !== "string") return false;
  const schema = data.schema.toLowerCase();
  const tasks = data.tasks.toLowerCase();
  const manifest = data.manifest.toLowerCase();
  return schema.includes("enable row level security")
    && schema.includes("create policy")
    && schema.includes("uuid")
    && schema.includes("timestamptz")
    && tasks.includes("- [ ]")
    && manifest.includes("foundersignal_bootstrap")
    && manifest.includes("outputs");
}

function fallbackArtifacts(input) {
  const idea = input.idea || input.founderIntent || "Founder intent not provided";
  const customer = input.customer || "Target customer not provided";
  const score = Number(input.score || input.validationScore || 0);
  const risks = Array.isArray(input.risks) ? input.risks : [input.concern || "Critical risk not provided"];
  const corrections = Array.isArray(input.corrections) ? input.corrections : [];

  const spec = `# spec.md

## Functional Requirements
- Capture founder intent, target customer, validation score, critical risks, and founder corrections.
- Compile the input into implementation-ready artifacts.
- Generate a /goal-compatible task loop.
- Generate a Supabase schema with RLS.
- Generate a GitHub issue packet.
- Generate a Vault handoff record.

## Constraints
- Validation score: ${score}/100.
- Target customer: ${customer}.
- Critical risks: ${risks.join("; ")}.
- Founder corrections: ${corrections.join("; ") || "None"}.
- Do not expand beyond the MVP boundary until buyer proof exists.

## Target User Workflow
1. Founder enters raw intent.
2. Agent cluster challenges the idea.
3. Founder adds correction.
4. Technical Architect Core recompiles artifacts.
5. Founder hands spec.md, schema.sql, and tasks.txt to Codex.

## Founder Intent
${idea}`;

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
  previous_response_id text
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
- [ ] Create Supabase migration from schema.sql.
- [ ] Enable RLS on founder_signal_runs.
- [ ] Enable RLS on founder_signal_corrections.
- [ ] Add owner_id indexes.
- [ ] Add run_id indexes.
- [ ] Add environment validation.

## P0 Core Logic
- [ ] Capture founder intent.
- [ ] Capture target customer.
- [ ] Capture validation score.
- [ ] Capture critical risks.
- [ ] Capture founder corrections.
- [ ] Compile spec.md.
- [ ] Compile schema.sql.
- [ ] Compile tasks.txt.
- [ ] Compile manifest.json.

## P1 Verification Checkpoints
- [ ] Verify compiled JSON includes spec.
- [ ] Verify compiled JSON includes schema.
- [ ] Verify compiled JSON includes tasks.
- [ ] Verify compiled JSON includes manifest.
- [ ] Verify schema.sql contains RLS policies for select.
- [ ] Verify schema.sql contains RLS policies for insert.
- [ ] Verify schema.sql contains RLS policies for update.
- [ ] Verify schema.sql contains RLS policies for delete.`;

  const manifest = JSON.stringify({
    name: "FounderSignal_Bootstrap",
    version: "1.0.0",
    description: "Scaffolds a Codex-ready project from validated founder intent.",
    input_contract: {
      founder_intent: "string",
      target_customer: "string",
      agent_validation_score: "integer",
      critical_risks: "string[]",
      founder_corrections: "string[]",
    },
    tools: [
      { name: "compile_spec", description: "Generate spec.md from validated founder intent." },
      { name: "init_schema", description: "Generate Supabase PostgreSQL schema.sql with explicit RLS policies." },
      { name: "plan_tasks", description: "Generate independent Codex /goal checklist tasks." },
      { name: "apply_regression_check", description: "Apply founder corrections before artifact handoff." },
      { name: "vault_handoff", description: "Package final artifacts for ArkNet Digital Vault continuity." },
    ],
    requirements: ["codex", "vercel", "supabase-cli"],
    outputs: ["spec.md", "schema.sql", "tasks.txt", "manifest.json"],
  }, null, 2);

  return { spec, schema, tasks, manifest, mode: "deterministic" };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const input = req.body || {};
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    res.status(200).json({ success: true, data: fallbackArtifacts(input) });
    return;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 2200,
        messages: [
          { role: "system", content: compilerPrompt },
          { role: "user", content: JSON.stringify(input) },
        ],
      }),
    });

    if (!response.ok) {
      res.status(200).json({ success: true, data: fallbackArtifacts(input), fallback_reason: `Groq returned ${response.status}` });
      return;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content || "{}";
    const data = JSON.parse(content);
    if (!isCompliant(data)) {
      res.status(200).json({ success: true, data: fallbackArtifacts(input), fallback_reason: "model output failed Supabase/RLS contract" });
      return;
    }
    res.status(200).json({ success: true, data: { spec: data.spec, schema: data.schema, tasks: data.tasks, manifest: data.manifest, mode: "model" } });
  } catch (error) {
    res.status(200).json({ success: true, data: fallbackArtifacts(input), fallback_reason: error.message || "compile failed" });
  }
}
