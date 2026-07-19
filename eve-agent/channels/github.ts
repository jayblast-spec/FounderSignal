// Eve channel concept: GitHub receives compiled issue packets and review tasks.
// In production, this would use Vercel Connect credentials instead of raw tokens.

export default {
  channel: "github",
  events: ["issue.created", "pull_request.opened", "workflow_run.completed"],
  routes: ["/api/github-loop"],
};
