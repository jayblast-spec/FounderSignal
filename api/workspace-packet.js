function list(value, fallback = []) {
  return Array.isArray(value) ? value.filter(Boolean) : fallback;
}

function clean(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function buildPacket(input) {
  const idea = clean(input.idea || input.founderIntent, "Founder intent not provided");
  const customer = clean(input.customer, "Founder-led teams that need execution clarity");
  const mode = clean(input.mode, "Codex");
  const score = Number(input.score || input.validationScore || 0);
  const risks = list(input.risks, [input.concern || "Unverified market, security, and distribution risk"]);
  const corrections = list(input.corrections, ["No correction supplied yet"]);
  const target = clean(input.target, "repo-ready MVP implementation");

  const goal = `/goal Build the first shippable MVP for: ${idea}

Use the FounderSignal packet as the contract. Do not expand scope. Create the smallest production-ready implementation that satisfies the acceptance checks, database boundaries, and deployment notes.`;

  const acceptance = [
    "The MVP has a working first user workflow, not a static mockup.",
    "Every generated data table has explicit owner boundaries or a documented reason it is public.",
    "All secrets are environment variables; no keys or tokens are committed.",
    "The UI includes empty, loading, success, and failure states.",
    "The repository includes a README quickstart and a verification checklist.",
    "The final answer includes files changed, commands run, and remaining risks.",
  ];

  const files = [
    "README.md",
    "AGENTS.md",
    "spec.md",
    "schema.sql",
    "tasks.txt",
    "manifest.json",
    "app or pages routes for the primary workflow",
    "api routes for compile/refine/status where applicable",
  ];

  const codexPrompt = `You are the implementation agent for FounderSignal.

Founder intent:
${idea}

Target user:
${customer}

Validation score:
${score}/100

Critical risks:
${risks.map((risk) => `- ${risk}`).join("\n")}

Founder corrections:
${corrections.map((correction) => `- ${correction}`).join("\n")}

Execution target:
${target}

Operating rules:
- Treat this as an execution packet, not a brainstorming request.
- Preserve the MVP boundary.
- Generate or edit real files.
- Add tests or verification steps proportional to risk.
- Report only after checking the result.

${goal}`;

  const handoff = `# FounderSignal Workspace Packet

## Intent
${idea}

## User
${customer}

## Mode
${mode}

## Codex Goal
${goal}

## Acceptance Criteria
${acceptance.map((item) => `- [ ] ${item}`).join("\n")}

## Files To Prepare
${files.map((file) => `- ${file}`).join("\n")}

## Guardrails
${risks.map((risk) => `- ${risk}`).join("\n")}

## Corrections
${corrections.map((correction) => `- ${correction}`).join("\n")}

## Prompt For Codex Or GPT
\`\`\`text
${codexPrompt}
\`\`\``;

  return {
    status: "packet_ready",
    runtime: "vercel-functions",
    target_runtime: mode,
    packet: {
      goal,
      acceptance,
      files,
      guardrails: risks,
      corrections,
      codex_prompt: codexPrompt,
      markdown: handoff,
    },
  };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const packet = buildPacket(req.body || {});
    res.status(200).json(packet);
  } catch (error) {
    res.status(500).json({ error: "Unable to generate workspace packet", detail: error.message });
  }
}
