export default function handler(req, res) {
  res.status(200).json({
    name: "FounderSignal Eve Agent",
    framework: "Vercel eve-style agent directory",
    runtime: {
      functions: [
        "/api/agent-confrontation",
        "/api/compile-brief",
        "/api/refine-artifacts",
        "/api/github-loop",
        "/api/vault-commit",
        "/api/cron/founder-signal-check",
      ],
      cron: "0 9 * * *",
      deployment: "Vercel",
    },
    tree: {
      "agent.ts": "model and runtime configuration",
      "instructions.md": "identity and charter",
      "tools/compile_intent.ts": "compile artifacts",
      "tools/create_github_issue_packet.ts": "prepare GitHub issues",
      "tools/commit_vault_handoff.ts": "prepare Vault commits",
      "skills/startup-validation.md": "validation rubric",
      "skills/supabase-rls.md": "RLS rules",
      "channels/github.ts": "GitHub channel concept",
      "schedules/daily-signal-check.md": "daily autonomous check",
      "subagents/security-reviewer/": "security delegation",
      "subagents/growth-operator/": "growth delegation",
    },
  });
}
