# WebManager Pro — Foundation v0.1

Starter application for a multi-client website management portal.

## Included
- React + TypeScript + Vite frontend
- Supabase email/password authentication
- First-run organization bootstrap
- Administrator dashboard
- Client register/list workflow
- Website register/list workflow
- PostgreSQL schema, role helpers and Row Level Security policies

## Important security boundaries
- Only the Supabase publishable/anon key belongs in the browser.
- Never put a Supabase service-role key, GitHub token, hosting password or encryption key in `.env` variables prefixed with `VITE_`.
- The credentials vault, GitHub App, source editor and deployment engine are NOT implemented in this foundation release.
- Do not store client passwords in the `clients` or `websites` tables. A dedicated encrypted vault service will be added in a later phase.
- RLS is defense in depth, not a substitute for testing. Test with separate administrator and client accounts before production.

## 1. Create a Supabase project
Create a project in Supabase, then open **SQL Editor** and run `supabase/migrations/0001_initial_schema.sql`.

## 2. Configure authentication
In Supabase Authentication:
- Enable Email provider.
- For a real deployment, configure SMTP and email confirmation.
- Disable public sign-ups after creating your administrator account, or implement an invitation-only signup flow before inviting clients.
- Configure your production site URL and redirect URLs.

For the first administrator, create the account through Supabase Auth. Then sign in through this app and use **Create workspace** when prompted. The bootstrap function only allows a user with no existing workspace membership to create their first workspace.

## 3. Run locally
```bash
npm install
cp .env.example .env
# Fill in your Supabase project URL and publishable/anon key
npm run dev
```

## 4. Build
```bash
npm run build
```

## 5. Deployment note
GitHub Pages can host this static frontend, but it cannot run secure server-side code. Supabase Edge Functions (or another trusted backend) will handle privileged operations in later phases. Configure SPA fallback/routing appropriately for the chosen host.

## Next implementation milestones
1. Invite-only client onboarding and client portal.
2. Private file storage with per-client authorization.
3. GitHub App integration supporting both agency-managed repositories and client-owned repositories.
4. Monaco source editor with isolated branches and commits.
5. Preview builds, approval workflows, deployment and rollback.
6. Encrypted credentials vault using server-side key management.
