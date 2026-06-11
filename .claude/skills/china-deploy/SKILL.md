---
name: china-deploy
description: Deploy a web app for China domestic access using GitHub Pages + Supabase Edge Functions. Use when the user needs a free deployment accessible from mainland China, especially when migrating from Vercel/Netlify whose default domains are blocked by the GFW.
metadata:
  type: skill
  tags: [deployment, china, github-pages, supabase, edge-function, gfw]
---

# China-Deploy: Free China-Accessible Deployment

Deploy a web app so it's accessible from mainland China without spending money on a custom domain or ICP filing. Uses GitHub Pages for static hosting and Supabase Edge Functions for serverless APIs — both platforms whose default domains are generally reachable from China.

## When to Use

- The user's deployed site is on Vercel (`*.vercel.app`) or Netlify (`*.netlify.app`) and Chinese users report they can't access it
- The user wants a **free** solution (no domain registration, no cloud server)
- The user's app is a SPA with a small number of API endpoints

## Architecture

```
Chinese User → GitHub Pages (github.io) → Supabase Edge Function → Third-party API (DeepSeek, OpenAI, etc.)
                                       → Supabase Database (if needed)
```

| Component | Service | Free Tier | Domestic Access |
|-----------|---------|-----------|-----------------|
| Static frontend | GitHub Pages | Unlimited | ✅ Usually accessible |
| Serverless API | Supabase Edge Functions | 500K calls/month | ✅ Usually accessible |
| Database | Supabase PostgreSQL | 2 projects free | ✅ Via Edge Function |
| Secrets | Supabase Secrets | Included | ✅ Server-side only |

## Prerequisites (Before Starting)

Ask the user for:

1. **GitHub username** — to create the repo and enable Pages
2. **Supabase project ref** — if they already have a Supabase project; otherwise create one
3. **Third-party API keys** — any secrets the API needs (e.g., DEEPSEEK_API_KEY)

If the user doesn't have a GitHub account, direct them to `https://github.com/signup` first.

## Step 1: Create Supabase Edge Function

If the user's API is currently a Vercel/Netlify function, convert it to a Deno-flavored Supabase Edge Function.

### 1a. Create the function file

Create `supabase-functions/<name>/index.ts`:

```typescript
Deno.serve(async (req: Request) => {
  // CORS headers — allow any origin
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Health check endpoint — useful for monitoring
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
      { status: 200, headers }
    );
  }

  // ... API logic here ...
});
```

Key differences from Vercel Edge Functions:
- `Deno.env.get("KEY")` instead of `process.env.KEY`
- `Deno.serve()` instead of `export default function handler`
- No `export const config` needed
- Same `fetch()` API, same `Request`/`Response` objects

### 1b. Deploy the function

Use the Supabase MCP `deploy_edge_function` tool:

```
mcp__supabase__deploy_edge_function(
  project_id: "<ref>",
  name: "<function-name>",
  entrypoint_path: "index.ts",
  verify_jwt: false,  // false for public API
  files: [{ name: "index.ts", content: "<file-content>" }]
)
```

### 1c. Set secrets via Supabase Dashboard

**IMPORTANT**: The Supabase CLI requires interactive browser login, which doesn't work in headless environments. Direct the user to set secrets manually:

👉 `https://supabase.com/dashboard/project/<ref>/settings/functions`

Ask the user to add each secret (e.g., `DEEPSEEK_API_KEY` = `sk-...`).

**Verify** the function is working with a curl test before proceeding:

```bash
curl https://<ref>.supabase.co/functions/v1/<name>  # should return {"status":"ok"}
curl -X POST https://<ref>.supabase.co/functions/v1/<name> \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"test"}'
```

## Step 2: Update Frontend API Endpoint

Modify the frontend to auto-detect the environment and use the correct API base:

```javascript
const API_BASE = (function(){
  // Local dev: use the local Node server or Vercel dev
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return '/api/analyze';
  }
  // Production: use Supabase Edge Function (China-accessible)
  return 'https://<ref>.supabase.co/functions/v1/<name>';
})();
```

This way local development still works with `vercel dev` or `node server.js`.

## Step 3: Set Up GitHub Repository and Pages

### 3a. Initialize git and commit

```bash
git init  # if not already
git add -A
git commit -m "Initial commit"
```

**CRITICAL**: Verify `.gitignore` covers `.env`, `.env.local`, and any files with real secrets before committing. The `.env.example` template is fine to commit — it has no real keys.

### 3b. Create GitHub repository

Ask the user to:
1. Go to `https://github.com/new`
2. Name the repo (e.g., `calmos`)
3. Choose **Public** (required for free GitHub Pages)
4. Do **NOT** check "Add a README"
5. Click **Create repository**

### 3c. Push code

The user needs to authenticate. Easiest path: ask them to create a Personal Access Token:
1. `https://github.com/settings/tokens`
2. Generate new token (classic), check **repo** scope
3. Share the token

Then push:

```bash
git remote add origin https://<username>:<token>@github.com/<username>/<repo>.git
git push -u origin main
# SECURITY: Immediately remove token from remote URL after push
git remote set-url origin https://github.com/<username>/<repo>.git
```

**Remind the user**: Delete the PAT from GitHub settings after the push is done.

### 3d. Enable GitHub Pages

Via API:
```bash
curl -X POST \
  -H "Authorization: token <token>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<username>/<repo>/pages \
  -d '{"source":{"branch":"main","path":"/"}}'
```

The site will be at `https://<username>.github.io/<repo>/`.

Wait ~30-60 seconds for the first build. Check status:
```bash
curl https://api.github.com/repos/<username>/<repo>/pages/builds/latest
```

## Step 4: End-to-End Verification

1. **Health check**: `curl https://<username>.github.io/<repo>/` → HTTP 200
2. **API health**: `curl https://<ref>.supabase.co/functions/v1/<name>` → `{"status":"ok"}`
3. **Full flow**: `curl -X POST https://<ref>.supabase.co/functions/v1/<name> -H "Content-Type: application/json" -d '<sample-payload>'` → valid JSON response
4. **Frontend-API integration**: Open the GitHub Pages URL in a browser, complete the full user flow

## Step 5: Update Progress Docs and Memory

Update the project's `progress.md` and the Claude memory file with:
- New deployment URLs
- New architecture diagram
- Admin dashboard links

Admin dashboard links to save:
| Dashboard | URL |
|-----------|-----|
| Supabase Project | `https://supabase.com/dashboard/project/<ref>` |
| Supabase Edge Function Settings | `https://supabase.com/dashboard/project/<ref>/settings/functions` |
| GitHub Repo | `https://github.com/<username>/<repo>` |
| GitHub Pages Settings | `https://github.com/<username>/<repo>/settings/pages` |
| Third-party API (e.g., DeepSeek) | `https://platform.deepseek.com` |

## Common Pitfalls

1. **Supabase CLI login fails** — Don't bother with `npx supabase secrets set`. Use the Dashboard UI for secrets.
2. **Edge Function returns 500** — Check secrets are set in Dashboard. The function redeploys automatically when secrets change.
3. **GitHub Pages 404 after deploy** — Wait 60s for the build. Check `Settings → Pages` for build errors.
4. **`.env` committed by accident** — Rewrite git history with `git filter-branch` or `BFG Repo-Cleaner`, rotate all exposed keys immediately.
5. **CORS errors** — Make sure the Edge Function returns `Access-Control-Allow-Origin: *` header.
6. **JWT verification** — Set `verify_jwt: false` for public API endpoints. Only enable JWT if the function requires authentication.
