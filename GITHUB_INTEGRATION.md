# FounderSignal GitHub Integration

FounderSignal uses GitHub as the implementation control plane.

## Issue Packet

Each compiled run can become a GitHub issue with:

- validated intent
- `spec.md`
- `schema.sql`
- `tasks.txt`
- regression checks
- labels: `founder-signal`, `codex`, `build-week`, `agentic-workflow`

## Pull Request Loop

When implementation begins, Codex can open a PR and attach:

- generated artifacts
- RLS checklist
- verification notes
- Vault handoff hash

## CI/Eval Gate

The repository includes a GitHub Actions workflow concept for agent evals. A production version would run:

- schema contract checks
- artifact completeness checks
- no-private-project-reference scan
- API smoke checks

This gives judges evidence that FounderSignal is designed for production review, not one-off prompting.
