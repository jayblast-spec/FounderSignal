---
description: Load before generating any Supabase schema or SQL migration.
---

# Supabase RLS Skill

Every user-owned table must include:

- `owner_id uuid references auth.users(id)`
- `created_at timestamptz`
- indexes on `owner_id` and foreign keys
- explicit select, insert, update, and delete policies

Never emit a production schema without `alter table ... enable row level security`.
