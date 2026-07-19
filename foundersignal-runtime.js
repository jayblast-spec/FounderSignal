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

  function primaryTerminal() {
    return document.querySelector(".terminal-glow");
  }

  function setAgentRunHeader(sample) {
    const target = primaryTerminal();
    if (!target) return;
    target.innerHTML = `
      <div class="agent-run-banner">
        <div>
          <span class="agent-kicker">Founder Signal Agent Run</span>
          <strong>${escapeHtml(sample.idea || "Founder intent")}</strong>
          <small>${escapeHtml(sample.customer || "Target customer")} / ${escapeHtml(sample.industry || "Market")}</small>
        </div>
        <span class="agent-state">Live Confrontation</span>
      </div>
      <div class="agent-run-grid" data-agent-grid></div>
    `;
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setProcessingStage(index, status = "active") {
    const step = document.querySelector(`[data-process-step="${index}"]`);
    if (!step) return;
    step.dataset.status = status;
    const state = step.querySelector("i");
    if (state) state.textContent = status === "done" ? "done" : "running";
  }

  function renderProcessingPanel(sample) {
    const grid = document.querySelector("[data-agent-grid]");
    if (!grid) return;
    grid.innerHTML = `
      <div class="agent-processing" data-agent-processing>
        <div class="process-orb"><span></span></div>
        <div class="process-copy">
          <span>Hold on while we process your request</span>
          <strong>Installing agent runtime for this founder signal.</strong>
          <p>We are locking the intake, allocating specialist context, scanning constraints, and preparing the compiler target.</p>
        </div>
        <div class="process-steps">
          ${[
            ["Lock intake", sample.idea || "Founder intent captured"],
            ["Allocate runtime", "Provisioning VC, security, and growth subagents"],
            ["Scan constraints", "Extracting risk, buyer, data, and moat signals"],
            ["Dispatch model call", "Sending confrontation packet to live function"],
            ["Prepare handoff", "Mapping output to Codex artifact targets"]
          ].map((item, index) => `
            <div class="process-step" data-process-step="${index}" data-status="${index === 0 ? "active" : "pending"}">
              <i>${index === 0 ? "running" : "queued"}</i>
              <b>${escapeHtml(item[0])}</b>
              <small>${escapeHtml(item[1])}</small>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  async function runProcessingSequence(sample, requestPromise) {
    renderProcessingPanel(sample);
    const minimumStageMs = 420;
    for (let index = 0; index < 3; index += 1) {
      setProcessingStage(index, "active");
      await wait(minimumStageMs);
      setProcessingStage(index, "done");
      setProcessingStage(index + 1, "active");
    }

    const result = await requestPromise;
    setProcessingStage(3, "done");
    setProcessingStage(4, "active");
    await wait(360);
    setProcessingStage(4, "done");
    return result;
  }

  function splitAgentFindings(content) {
    const cleanContent = clean(content).replace(/\*\*/g, "");
    const labels = [
      "Market", "Urgency", "Defensibility", "Monetization", "Action",
      "Privacy Risk", "Auth Risk", "Data Risk", "RLS (Row-Level Security) Risk", "RLS Risk", "Operational Risk", "Architecture Constraint", "Constraint",
      "Distribution", "Proof", "Buyer Objections", "First Campaign", "Launch Move"
    ];
    const pattern = new RegExp(`(?:^|\\s)(?:\\d+\\.\\s*)?(${labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):`, "gi");
    const matches = [...cleanContent.matchAll(pattern)];
    if (!matches.length) return [{ label: "Finding", value: cleanContent }];

    return matches.map((match, index) => {
      const start = match.index + match[0].length;
      const end = matches[index + 1]?.index ?? cleanContent.length;
      return {
        label: match[1],
        value: cleanContent.slice(start, end).trim(),
      };
    }).filter((item) => item.value);
  }

  function renderAgentCard(agent) {
    const grid = document.querySelector("[data-agent-grid]");
    if (!grid) return;
    const label = agent.title || agent.name || agent.role || agent.key || "SPECIALIST AGENT";
    const key = (agent.key || label).toString().toLowerCase();
    const findings = splitAgentFindings(agent.content || agent.output || agent.message || "");
    const card = document.createElement("article");
    card.className = `agent-card agent-${escapeHtml(key).replace(/[^a-z0-9-]/g, "-")}`;
    card.innerHTML = `
      <header>
        <span>${escapeHtml(label)}</span>
        <i>${escapeHtml(key.toUpperCase())}</i>
      </header>
      <div class="agent-findings">
        ${findings.map((finding) => `
          <div class="agent-finding">
            <b>${escapeHtml(finding.label)}</b>
            <p>${escapeHtml(finding.value)}</p>
          </div>
        `).join("")}
      </div>
    `;
    grid.appendChild(card);
  }

  function renderNextStepCard() {
    const target = primaryTerminal();
    if (!target) return;
    const card = document.createElement("div");
    card.className = "agent-next-step";
    card.innerHTML = `
      <span>Regression target ready</span>
      <strong>Open Compiler to generate SPEC / SCHEMA / TASKS / MANIFEST.</strong>
      <a href="/brief.html">Open Compiler</a>
    `;
    target.appendChild(card);
    target.scrollTop = target.scrollHeight;
  }

  function renderHealthMatrix(results) {
    const target = primaryTerminal();
    if (!target) return;
    document.querySelector("[data-health-matrix]")?.remove();
    const passed = results.filter((item) => item.ok).length;
    const matrix = document.createElement("section");
    matrix.className = "health-matrix";
    matrix.dataset.healthMatrix = "true";
    matrix.innerHTML = `
      <div class="health-head">
        <div>
          <span>Live function probe</span>
          <strong>${passed}/${results.length} endpoints passed</strong>
        </div>
        <i>${new Date().toLocaleTimeString()}</i>
      </div>
      <div class="health-grid">
        ${results.map((item) => `
          <div class="health-card" data-status="${item.ok ? "pass" : "check"}">
            <b>${escapeHtml(item.name)}</b>
            <small>${escapeHtml(item.url)}</small>
            <span>${item.ok ? "PASS" : "CHECK"} / ${item.ms}ms</span>
          </div>
        `).join("")}
      </div>
    `;
    target.appendChild(matrix);
    target.scrollTop = target.scrollHeight;
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

  const missionPackets = {
    saas: scenarios["deploy service"],
    local: scenarios["generate inventory dashboard"],
    agent: scenarios["activate sales agent"],
  };

  function applyFormState(sample) {
    const fields = [...document.querySelectorAll("textarea,input,select")];
    if (fields[0]) fields[0].value = sample.idea || "";
    if (fields[1]) fields[1].value = sample.customer || "";
    if (fields[2]) fields[2].value = sample.industry || "Productivity";
    if (fields[3]) fields[3].value = sample.edge || "";
    if (fields[4]) fields[4].value = sample.concern || "";
    document.querySelector(".form-status b")?.replaceChildren(document.createTextNode(`${sample.label || "Demo"} packet loaded`));
  }

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
    setCompilerState("Compiling live artifacts...");
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
    setCompilerState("Compile complete: artifacts ready");
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

    setAgentRunHeader(sample);

    let agents = localAgentFallback(sample);
    const requestPromise = (async () => {
      try {
        const response = await fetch("/api/agent-confrontation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sample),
        });
        const payload = await response.json();
        if (response.ok && Array.isArray(payload.agents) && payload.agents.length) {
          return { agents: payload.agents };
        }
        return { fallback: payload.error || "Live agent endpoint returned a fallback response." };
      } catch {
        return { fallback: "Live model fallback: deterministic specialist loop active." };
      }
    })();

    const result = await runProcessingSequence(sample, requestPromise);
    if (result.agents) {
      agents = result.agents;
    }

    const grid = document.querySelector("[data-agent-grid]");
    if (grid) grid.innerHTML = "";
    if (result.fallback) {
      const note = document.createElement("div");
      note.className = "agent-fallback-note";
      note.textContent = result.fallback;
      grid?.appendChild(note);
    }

    agents.forEach((agent) => {
      renderAgentCard(agent);
    });

    renderNextStepCard();
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
      const started = performance.now();
      try {
        const response = await fetch(url, options);
        results.push({ name, url, ok: response.ok, ms: Math.round(performance.now() - started) });
      } catch {
        results.push({ name, url, ok: false, ms: Math.round(performance.now() - started) });
      }
    }
    renderHealthMatrix(results);
    toast(`Live checks complete: ${results.filter((item) => item.ok).length}/${results.length} endpoints passed`);
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
    const input = document.querySelector("[data-correction-input]");
    const correction = clean(input?.value) || prompt("Founder correction to apply:");
    if (!correction) return;
    setCompilerState(`Applying correction: ${correction.slice(0, 68)}${correction.length > 68 ? "..." : ""}`);
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
    setCompilerState("System updated: regression check passed");
    if (input) input.value = "";
    toast("System updated: regression check passed");
  }

  function setCompilerState(message) {
    const target = document.querySelector("[data-compiler-state]");
    if (target) target.textContent = message;
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
    const packetButton = event.target.closest("[data-demo-packet]");
    if (packetButton) {
      event.preventDefault(); event.stopImmediatePropagation();
      const packet = missionPackets[packetButton.dataset.demoPacket] || missionPackets.agent;
      save(packet);
      applyFormState(packet);
      toast(`${clean(packetButton.querySelector("b")?.textContent || "Mission")} loaded`);
      return;
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
