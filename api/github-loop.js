export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const title = `FounderSignal execution: ${body.industry || "MVP"} proof loop`;
  const issueBody = [
    `# ${title}`,
    "",
    `Idea: ${body.idea || "Founder idea"}`,
    `Customer: ${body.customer || "Target customer"}`,
    `Concern: ${body.concern || "Unknown"}`,
    "",
    "## Validation Checklist",
    "- [ ] Exact buyer confirmed",
    "- [ ] Outreach sequence drafted",
    "- [ ] First proof conversation booked",
    "- [ ] Correction loop applied",
    "- [ ] Codex build brief updated",
  ].join("\n");

  if (!process.env.GITHUB_TOKEN || !body.repo) {
    res.status(200).json({
      mode: "packet",
      reason: "GITHUB_TOKEN or repo was not configured, so no issue was created.",
      issue: {
        title,
        labels: ["founder-signal", "build-week", "validation-loop"],
        body: issueBody,
      },
      cli: `gh issue create --title "${title}" --label founder-signal,build-week,validation-loop --body-file codex-build-brief.md`,
    });
    return;
  }

  const response = await fetch(`https://api.github.com/repos/${body.repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "FounderSignal",
    },
    body: JSON.stringify({ title, body: issueBody, labels: ["founder-signal", "build-week", "validation-loop"] }),
  });

  const data = await response.json();
  res.status(response.ok ? 200 : response.status).json(data);
}
