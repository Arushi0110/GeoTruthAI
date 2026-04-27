# GitHub Actions - Setup Required Secrets

## Required Secrets (Go to: GitHub Repo → Settings → Secrets and variables → Actions)

### Render Secrets
```
RENDER_API_KEY     # From Render Dashboard → Account Settings → API Keys
RENDER_SERVER_ID   # From Render Dashboard → geotruthai-server → Settings
RENDER_AI_ID       # From Render Dashboard → geotruthai-ai → Settings
```

### Vercel Secrets
```
VERCEL_TOKEN       # From Vercel Dashboard → Settings → Tokens
                     Create new token with full scope
```

## How to Find Service IDs

### Render Service ID:
1. Go to https://dashboard.render.com
2. Click on your service (e.g., geotruthai-server)
3. In Settings tab → Copy the Service ID (looks like srv-xxxxx)

### Vercel Token:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Give it any name (e.g., GitHub Actions)
4. Keep scope as default
5. Copy the token

