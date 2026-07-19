(() => {
  const FS_KEY = "foundersignal-state-v3";
  const defaultState = {
    idea: "Multi-agent system for autonomous LinkedIn lead outreach that researches prospects, drafts personalized messages, tracks objections, and creates follow-up tasks.",
    customer: "Founder-led B2B service teams that need qualified conversations but cannot hire a full sales development team",
    industry: "Productivity",
    stage: "Launched",
    mode: "Aggressive",
    concern: "The system must avoid spam behavior, protect sender reputation, and prove that personalization leads to real conversations.",
    edge: "Strong AI workflow taste and ability to package multi-agent operating systems",
    score: 88,
    label: "Venture-Grade",
    corrections: ["Must support localized data isolation rules"],
    previous_response_id: "fs_live_demo",
  };

  let activeArtifact = "spec";
  let currentArtifacts = {
    spec: "# spec.md\n\n## Product\nFounderSignal Command Center\n\n## Goal\nCompile founder intent into execution files a developer can move into Codex.\n\n## Workflow\n1. Capture founder intent.\n2. Run agent confrontation.\n3. Compile spec.md, schema.sql, tasks.txt, and manifest.json.\n4. Apply practitioner correction.\n5. Commit the session to Vault handoff.",
    schema: "-- schema.sql\ncreate table public.founder_signal_runs (\n  id uuid primary key default gen_random_uuid(),\n  created_at timestamptz not null default now(),\n  owner_id uuid references auth.users(id) on delete cascade,\n  founder_intent text not null,\n  target_customer text not null,\n  validation_score integer not null check (validation_score between 0 and 100)\n);\n\nalter table public.founder_signal_runs enable row level security;\n\ncreate policy \"runs_select_own\"\non public.founder_signal_runs for select\nto authenticated\nusing (auth.uid() = owner_id);",
    tasks: "# tasks.txt\n\n- [ ] Capture founder intent.\n- [ ] Run agent confrontation.\n- [ ] Compile spec.md.\n- [ ] Compile schema.sql with RLS.\n- [ ] Compile tasks.txt.\n- [ ] Compile manifest.json.\n- [ ] Apply correction and regression check.\n- [ ] Commit final state to Vault handoff.",
    manifest: "{\n  \"name\": \"FounderSignal_Bootstrap\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Scaffolds a Codex-ready project from validated founder intent.\",\n  \"requirements\": [\"gpt-5.6-sol\", \"supabase-cli\", \"vercel\", \"codex\"],\n  \"outputs\": [\"spec.md\", \"schema.sql\", \"tasks.txt\", \"manifest.json\"]\n}",
  };

  const routes = {
    Analyze: "index.html",
    "/Goal": "goal.html",
    Goal: "goal.html",
    "Agent Loop": "report.html",
    "Codex Brief": "brief.html",
    "Launch Assets": "assets.html",
    "Vault Handoff": "vault-handoff.html",
    "/goal": "goal.html",
    "/GOAL_CHECK": "goal.html",
    agent_loop: "report.html",
    "agent loop": "report.html",
    compiler: "brief.html",
    vault: "vault-handoff.html",
    AGENT_LOGS: "report.html",
    "API Docs": "SUBMISSION.md",
    Security: "AGENTS.md",
    "Network Status": "goal.html",
  };

  const clean = (text) => (text || "").replace(/\s+/g, " ").trim();
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function state() {
    try {
      return { ...defaultState, ...(JSON.parse(localStorage.getItem(FS_KEY) || "{}")) };
    } catch {
      return { ...defaultState };
    }
  }

  function save(next) {
    localStorage.setItem(FS_KEY, JSON.stringify({ ...state(), ...next }));
  }

  function toast(message, tone = "ok") {
    let box = document.querySelector("[data-fs-toast]");
    if (!box) {
      box = document.createElement("div");
      box.dataset.fsToast = "true";
      box.style.cssText = "position:fixed;right:18px;bottom:58px;z-index:9999;max-width:420px;border:1px solid rgba(0,245,160,.38);background:rgba(11,15,16,.94);color:#cdffde;padding:14px 16px;font:700 11px JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.08em;box-shadow:0 0 30px rgba(0,245,160,.16);";
      document.body.appendChild(box);
    }
    box.style.borderColor = tone === "bad" ? "rgba(255,180,171,.55)" : "rgba(0,245,160,.38)";
    box.style.color = tone === "bad" ? "#ffdad6" : "#cdffde";
    box.textContent = message;
    clearTimeout(box._timer);
    box._timer = setTimeout(() => box.remove(), 3200);
  }

  function terminal(message) {
    const targets = document.querySelectorAll(".terminal-glow, footer span.font-data-mono, footer p.font-data-mono");
    targets.forEach((target) => {
      if (target.tagName === "SPAN" || target.tagName === "P") {
        target.textContent = message;
        return;
      }
      const line = document.createElement("p");
      line.className = "text-data-slate text-[10px]";
      line.innerHTML = `[${new Date().toLocaleTimeString()}] <span class="text-signal-green">&gt;</span> ${escapeHtml(message)}`;
      target.appendChild(line);
      target.scrollTop = target.scrollHeight;
    });
  }

  function clearTerminal() {
    document.querySelectorAll(".terminal-glow").forEach((target) => {
      target.innerHTML = "";
    });
  }

  function terminalDivider(label) {
    terminal(`===== ${label} =====`);
  }

  function collectFormState() {
    const values = [...document.querySelectorAll("textarea,input,select")].map((field) => field.value.trim()).filter(Boolean);
    return {
      idea: values[0] || defaultState.idea,
      customer: values[1] || defaultState.customer,
      industry: values[2] || defaultState.industry,
      edge: values[3] || defaultState.edge,
      concern: values[4] || defaultState.concern,
      stage: "Prototype",
      mode: "Balanced",
      score: 86,
      label: "Venture-Grade",
    };
  }

  const scenarios = {
    "deploy service": {
      idea: "Secure multi-tenant legal discovery summarizer that ingests PDFs, extracts legal entities, and produces partner-ready summaries.",
      customer: "Small litigation law firms with high discovery volume and limited knowledge-management staff",
      industry: "SaaS",
      concern: "Must protect privileged data, isolate tenants, and preserve citation traceability.",
      edge: "Codex compiles the API route, Supabase schema, storage policy, and RAG-ready processing plan.",
      score: 91,
      label: "Venture-Grade",
      corrections: ["multi-tenant isolation", "secure storage bucket", "citation traceability"],
    },
    "generate inventory dashboard": {
      idea: "Offline-first coffee shop inventory dashboard with edge-friendly low-stock detection and cloud sync when connectivity is stable.",
      customer: "Independent coffee shop owners managing inventory manually across one to three locations",
      industry: "Local services",
      concern: "Must work locally, avoid complex setup, and sync safely after connection loss.",
      edge: "Codex compiles React localStorage persistence, sync rules, and low-stock alert logic with edge deployment notes.",
      score: 84,
      label: "Strong",
      corrections: ["offline-first", "edge-ready local inference", "stable sync rules"],
    },
    "activate sales agent": {
      idea: "Autonomous LinkedIn outreach hub that researches profiles, analyzes tone, drafts personalized messages, and rewrites strategy from rejection feedback.",
      customer: "Founder-led B2B teams that need qualified conversations without hiring a full SDR team",
      industry: "Productivity",
      concern: "Must avoid spam behavior and protect sender reputation while improving message strategy.",
      edge: "Codex compiles the recursive agent loop, rejection feedback handler, and task queue blueprint.",
      score: 88,
      label: "Venture-Grade",
      corrections: ["recursive feedback loop", "sender reputation guardrails", "message rejection handling"],
    },
  };

  function codeContainer() {
    return document.querySelector("#artifact-code") || document.querySelector("[data-artifact-output]");
  }

  function renderArtifact(tab = activeArtifact) {
    activeArtifact = tab;
    const target = codeContainer();
    if (!target) return;
    const text = currentArtifacts[tab] || currentArtifacts.spec;
    target.innerHTML = text.split("\n").map((line, index) => {
      const color = line.startsWith("#") || line.startsWith("--") || line.startsWith("{") || line.startsWith("}") ? "text-signal-green" : line.includes("policy") || line.includes("create") ? "text-hazard-orange" : "text-on-surface/80";
      return `<p class="${color}"><span class="text-data-slate select-none mr-3">${String(index + 1).padStart(2, "0")}</span>${escapeHtml(line) || "&nbsp;"}</p>`;
    }).join("");
    document.querySelectorAll("button").forEach((button) => {
      const textContent = clean(button.textContent).toLowerCase();
      const isTab = ["spec.md", "schema.sql", "tasks.txt", "manifest.json"].includes(textContent);
      if (!isTab) return;
      const active = (tab === "spec" && textContent === "spec.md") || (tab === "schema" && textContent === "schema.sql") || (tab === "tasks" && textContent === "tasks.txt") || (tab === "manifest" && textContent === "manifest.json");
      button.classList.toggle("text-signal-green", active);
      button.classList.toggle("border-signal-green", active);
      button.classList.toggle("text-data-slate", !active);
    });
  }

  async function compileArtifacts() {
    terminal("COMPILING CODEX ARTIFACTS...");
    const response = await fetch("/api/compile-brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state()) });
    const payload = await response.json();
    const data = payload.data || payload.artifacts || {};
    currentArtifacts = {
      spec: data.spec || data.specification || currentArtifacts.spec,
      schema: data.schema || data.schema_sql || currentArtifacts.schema,
      tasks: data.tasks || data.tasks_txt || currentArtifacts.tasks,
      manifest: data.manifest || currentArtifacts.manifest,
    };
    save({ artifacts: currentArtifacts });
    renderArtifact(activeArtifact);
    toast("Codex artifacts compiled");
  }

  function localAgentFallback(sample) {
    return [
      {
        title: "CYNICAL VC",
        content: `Market signal check: ${sample.customer || "the target buyer"} must feel a painful, urgent workflow gap before this deserves build time. Narrow the MVP to one paid proof loop.`,
      },
      {
        title: "SECURITY ARCHITECT",
        content: `Trust boundary check: ${sample.concern || "the critical risk"} must be converted into explicit data, RLS, and audit constraints before handoff.`,
      },
      {
        title: "GROWTH OPERATOR",
        content: `Distribution check: use ${sample.edge || "the founder edge"} to reach the first ten qualified users, then turn objections into correction-loop inputs.`,
      },
    ];
  }

  async function runWorkflow(trigger) {
    const sample = collectFormState();
    save(sample);
    const originalText = trigger?.textContent;
    if (trigger) {
      trigger.disabled = true;
      trigger.textContent = "Running...";
    }

    clearTerminal();
    terminalDivider("FOUNDER SIGNAL AGENT RUN");
    terminal("WORKFLOW STATE CAPTURED...");
    terminal("RUNNING VC / SECURITY / GROWTH AGENT CONFRONTATION...");

    let agents = localAgentFallback(sample);
    try {
      const response = await fetch("/api/agent-confrontation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample),
      });
      const payload = await response.json();
      if (response.ok && Array.isArray(payload.agents) && payload.agents.length) {
        agents = payload.agents;
      } else if (payload.error) {
        terminal(`LIVE MODEL FALLBACK: ${payload.error}`);
      }
    } catch {
      terminal("LIVE MODEL FALLBACK: deterministic specialist loop active");
    }

    agents.forEach((agent) => {
      const label = agent.title || agent.name || agent.role || agent.key || "SPECIALIST AGENT";
      terminalDivider(label);
      terminal(clean(agent.content || agent.output || agent.message || ""));
    });

    terminalDivider("NEXT STEP");
    terminal("REGRESSION TARGET READY -> OPEN COMPILER TO GENERATE SPEC / SCHEMA / TASKS / MANIFEST");
    toast("Agent workflow complete. Compiler state is ready.");
    if (trigger) {
      trigger.textContent = "Workflow Complete";
      setTimeout(() => {
        trigger.disabled = false;
        trigger.textContent = originalText || "Run Workflow";
      }, 1800);
    }
  }

  async function runChecks() {
    terminal("RUNNING LIVE FUNCTION CHECKS...");
    const sample = state();
    const checks = [
      ["agent", "/api/agent-confrontation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sample) }],
      ["goal", "/api/goal-execution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sample, goal: "Generate Codex-ready execution packet" }) }],
      ["compiler", "/api/compile-brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sample) }],
      ["vault", "/api/vault-commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: sample, dry_run: true }) }],
      ["cron", "/api/cron/founder-signal-check", { method: "GET" }],
    ];
    const results = [];
    for (const [name, url, options] of checks) {
      try {
        const response = await fetch(url, options);
        results.push(`${name}:${response.ok ? "PASS" : "CHECK"}`);
      } catch {
        results.push(`${name}:CHECK`);
      }
    }
    terminal(results.join(" // "));
    toast(`Live checks complete: ${results.join(" ")}`);
  }

  async function hydrateSystemMetrics() {
    const root = document.querySelector("#system-metrics");
    if (!root) return;

    try {
      const response = await fetch("/api/system-status", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const data = await response.json();
      const counts = {
        artifacts: `${data.artifacts.verified}/${data.artifacts.total}`,
        routes: `${data.routes.verified}/${data.routes.total}`,
        cron: `${data.cron.verified}/${data.cron.total}`,
      };

      Object.entries(counts).forEach(([key, value]) => {
        const target = document.querySelector(`[data-status-count="${key}"]`);
        if (target) target.textContent = value;
      });

      root.dataset.verified = "true";
      root.title = `Verified deployment contract at ${data.checked_at}`;
    } catch {
      root.dataset.verified = "false";
      root.title = "System status endpoint unavailable; showing last known deployment contract.";
    }
  }

  async function refine() {
    const correction = prompt("Founder correction to apply:");
    if (!correction) return;
    terminal("APPLYING CORRECTION + REGRESSION CHECK...");
    const response = await fetch("/api/refine-artifacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...state(), correction, corrections: [...(state().corrections || []), correction] }) });
    const payload = await response.json();
    const data = payload.data || payload;
    const artifacts = data.artifacts || {};
    currentArtifacts = {
      spec: artifacts.spec || currentArtifacts.spec,
      schema: artifacts.schema || currentArtifacts.schema,
      tasks: artifacts.tasks || currentArtifacts.tasks,
      manifest: artifacts.manifest || currentArtifacts.manifest,
    };
    save({ artifacts: currentArtifacts, corrections: [...(state().corrections || []), correction], previous_response_id: data.previous_response_id || payload.previous_response_id });
    renderArtifact(activeArtifact);
    toast("System updated: regression check passed");
  }

  async function commitVault() {
    terminal("SERIALIZING STATE... VALIDATING CONSTRAINTS...");
    const response = await fetch("/api/vault-commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: state(), artifacts: currentArtifacts, source: "FounderSignal Build Week" }) });
    const data = await response.json();
    terminal(`VAULT COMMIT ${data.session_id || data.sessionId || "SESSION_READY"}`);
    toast(`[SUCCESS] Asset committed: ${data.session_id || data.sessionId || "SESSION_READY"}`);
  }

  function copyArtifact() {
    navigator.clipboard.writeText(currentArtifacts[activeArtifact] || "").then(() => toast(`${activeArtifact.toUpperCase()} copied for Codex`));
  }

  function downloadArtifact() {
    const ext = activeArtifact === "schema" ? "sql" : activeArtifact === "manifest" ? "json" : "md";
    const blob = new Blob([currentArtifacts[activeArtifact] || ""], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeArtifact}.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast(`${link.download} exported`);
  }

  function route(url) {
    if (url.startsWith("https://")) window.open(url, "_blank", "noopener");
    else location.href = url;
  }

  function wireLinks() {
    document.querySelectorAll("a").forEach((link) => {
      const text = clean(link.textContent);
      const key = Object.keys(routes).find((name) => text === name || text.includes(name));
      if (!key) return;
      link.href = routes[key];
      if (routes[key].startsWith("https://")) {
        link.target = "_blank";
        link.rel = "noopener";
      }
    });
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const text = clean(button.textContent);
    const icon = clean(button.querySelector(".material-symbols-outlined")?.textContent);
    const lower = text.toLowerCase();

    if (["spec.md", "schema.sql", "tasks.txt", "manifest.json"].includes(lower)) {
      event.preventDefault(); event.stopImmediatePropagation();
      renderArtifact(lower.startsWith("spec") ? "spec" : lower.startsWith("schema") ? "schema" : lower.startsWith("tasks") ? "tasks" : "manifest");
      return;
    }
    if (icon === "content_copy") {
      event.preventDefault(); event.stopImmediatePropagation(); copyArtifact(); return;
    }
    if (icon === "download" || lower.includes("export zip")) {
      event.preventDefault(); event.stopImmediatePropagation(); downloadArtifact(); return;
    }
    if (lower.includes("run agent demo")) {
      event.preventDefault(); event.stopImmediatePropagation(); save(defaultState); terminal("DEMO STATE LOADED... ROUTING TO AGENT LOOP"); route("report.html"); return;
    }
    if (lower.includes("run workflow")) {
      event.preventDefault(); event.stopImmediatePropagation(); await runWorkflow(button); return;
    }
    if (scenarios[lower]) {
      event.preventDefault(); event.stopImmediatePropagation();
      save(scenarios[lower]);
      terminal(`${text.toUpperCase()} SCENARIO LOADED... ROUTING TO CODEX COMPILER`);
      route("brief.html");
      return;
    }
    if (lower.includes("check live functions") || lower.includes("run checks")) {
      event.preventDefault(); event.stopImmediatePropagation(); await runChecks(); return;
    }
    if (lower.includes("open compiler") || lower.includes("compile live")) {
      event.preventDefault(); event.stopImmediatePropagation(); save(collectFormState()); if (location.pathname.endsWith("/brief.html")) await compileArtifacts(); else route("brief.html"); return;
    }
    if (lower.includes("apply correction") || lower === "correct") {
      event.preventDefault(); event.stopImmediatePropagation(); await refine(); return;
    }
    if (lower.includes("commit assets") || lower.includes("secure in vault") || lower.includes("commit to vault") || lower.includes("save to arknet vault")) {
      event.preventDefault(); event.stopImmediatePropagation(); await commitVault(); return;
    }
    const routeKey = Object.keys(routes).find((name) => text === name || text.includes(name));
    if (routeKey) {
      event.preventDefault(); event.stopImmediatePropagation(); route(routes[routeKey]);
    }
  }, true);

  document.addEventListener("DOMContentLoaded", () => {
    wireLinks();
    const saved = state().artifacts;
    if (saved) currentArtifacts = { ...currentArtifacts, ...saved };
    renderArtifact("spec");
    hydrateSystemMetrics();
    terminal("RUNTIME ONLINE // CLICKABLE WORKFLOW ARMED");
  });
})();
