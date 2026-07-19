export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    job: "founder-signal-check",
    cadence: "daily",
    purpose: "Review active validation goals, detect stale loops, and generate the next founder action.",
    next_actions: [
      "Find runs with no correction in 24 hours.",
      "Find runs with no launch asset exported.",
      "Prepare GitHub issue update packet.",
      "Prepare Vault handoff reminder.",
    ],
  });
}
