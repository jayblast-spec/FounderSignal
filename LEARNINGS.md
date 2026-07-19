# FounderSignal Learnings

## What Changed

The first version was too close to a static analyzer. The Build Week bar is higher: the product needed to show workflow power, not just nice text output.

The final direction became:

Founder input -> `/goal` execution plan -> live agent confrontation -> correction diff -> Codex build brief -> tool schema -> launch assets -> Vault handoff.

## Engineering Decisions

- Kept the MVP multi-page and static-first so judges can use it instantly.
- Added a Vercel serverless route for live Groq agent confrontation.
- Used deterministic local scoring so the workflow still works if the model endpoint fails.
- Added honest fallbacks for unavailable services instead of fake success states.
- Kept Resend and Supabase as generated implementation specs because production credentials were not available in this environment.
- Added a browser-side SHA-256 signed markdown package for the Vault handoff.

## Debug Notes

- Initial Groq model slug returned `400`; switching to `llama-3.3-70b-versatile` fixed the live endpoint.
- Mobile overflow had to be verified with real Chrome screenshots, not assumed from CSS.
- Public copy had to remove private-system references and implementation notes.

## Future Production Upgrade

- Add authenticated Supabase persistence with RLS.
- Add Resend email delivery after domain verification.
- Add GitHub API integration to open validation-loop issues automatically.
- Add scheduled Vercel Cron review for stale goals and unresolved correction loops.
