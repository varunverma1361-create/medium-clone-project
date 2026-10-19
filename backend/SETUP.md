# Backend: Hono + Cloudflare Workers + Prisma 6.19.3 + Neon

## SECURITY FIRST
The previous Neon password was posted in chat. Rotate your Neon database password before using this archive. This ZIP deliberately contains no passwords or JWT secret.

## First run (PowerShell, from `backend`)
```powershell
Copy-Item .env.example .env
Copy-Item .dev.vars.example .dev.vars
```
Open `.env` and `.dev.vars` and replace `USERNAME:ROTATED_PASSWORD` with your newly rotated Neon credentials (keep punctuation and full URL), and update `JWT_SECRET` in `.dev.vars`. The direct address has no `-pooler` and is used by CLI. Worker runtime uses `-pooler` address. Both private files are .gitignored.

```powershell
npm install
npx prisma validate
npx prisma generate
npx prisma migrate status
npm run dev
```
The signup route is `/api/v1/signup` and creates a database record, so don't use it with real passwords until you've added password hashing, validation, and safer errors. Other API endpoints remain unfinished (as in original code).

## Important database safeguards
This archive does NOT contain migrations or make any database changes. `migrate status` is read-only. If tables already exist, DO NOT run `migrate reset` or `migrate dev --name init` until the current schema and migration history are assessed. If database is empty, `npx prisma migrate dev --name init` can initialize it, after confirming connection and emptiness.

If you still receive P1001 after rotating URLs, run `Test-NetConnection ep-damp-fog-atfw1qt6.c-9.us-east-1.aws.neon.tech -Port 5432` and check Neon project's status, firewall/VPN/network and URL correctness.

## Deployment
At deploy time, use `npx wrangler secret put DATABASE_URL` (pooled URL) and `npx wrangler secret put JWT_SECRET`; never commit them into `wrangler.jsonc`. `npm run deploy` publishes worker code (only after validating environment and user-auth security).
