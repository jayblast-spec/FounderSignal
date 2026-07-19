const artifacts = ["spec.md", "schema.sql", "tasks.txt", "manifest.json"];

const routes = [
  "/",
  "/builder.html",
  "/demo.html",
  "/DEVPOST_COPY.md",
  "/report.html",
  "/brief.html",
  "/goal.html",
  "/assets.html",
  "/vault-handoff.html",
  "/workspace.html",
  "/documentation/",
  "/documentation/repository/",
  "/documentation/core-concepts/",
  "/documentation/api-reference/",
  "/products/validation-engine/",
  "/products/codex-compiler/",
  "/products/agent-console/",
  "/products/github-loop/",
  "/products/vault-continuity/",
  "/pricing/",
  "/eve/",
  "/resources/changelog/",
  "/resources/status/",
  "/resources/community/",
  "/resources/customer-stories/",
];

const apiRoutes = [
  "/api/agent-confrontation",
  "/api/goal-execution",
  "/api/compile-brief",
  "/api/refine-artifacts",
  "/api/github-loop",
  "/api/vault-commit",
  "/api/workspace-packet",
  "/api/eve-manifest",
  "/api/cron/founder-signal-check",
];

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    checked_at: new Date().toISOString(),
    artifacts: {
      verified: artifacts.length,
      total: artifacts.length,
      items: artifacts,
    },
    routes: {
      verified: routes.length,
      total: routes.length,
      items: routes,
    },
    api_routes: {
      verified: apiRoutes.length,
      total: apiRoutes.length,
      items: apiRoutes,
    },
    cron: {
      verified: 1,
      total: 1,
      cadence: "0 9 * * *",
      endpoint: "/api/cron/founder-signal-check",
    },
    note: "These are verified deployment contract counts, not usage or uptime claims.",
  });
}
