export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const target = body.goal || "Find first customer proof";
  const lower = target.toLowerCase();
  const leadCount = /25/.test(lower) ? 25 : /10|ten/.test(lower) ? 10 : 7;

  res.status(200).json({
    target,
    lead_count: leadCount,
    stages: [
      `Define the exact buyer: ${body.customer || "target customer"}.`,
      `Generate ${leadCount} lead hypotheses from founder-reachable channels.`,
      "Draft a personalized opener tied to pain and proof.",
      "Run trust/security check before collecting sensitive data.",
      "Convert replies into corrections and rerun signal.",
      "Package the revised record for Codex and Vault handoff.",
    ],
    done_when: [
      `${leadCount} lead hypotheses exist.`,
      "Each lead has a personalized outreach angle.",
      "At least one paid-proof question is ready.",
      "The Codex brief includes latest corrections.",
    ],
  });
}
