# physics.si — Physics Superintelligence

A published, research-grade physics AI site powered by the Anthropic API. Deep-space design, 16 physics fields, 8 purpose-built tools, streaming responses with LaTeX math rendering.

## Structure

```
physics-si/
├── index.html            # Entire frontend (design, fields, tools, streaming chat)
├── api/chat.js           # Vercel Edge Function — secure Anthropic API proxy
├── favicon.svg / .ico    # Favicons (+ favicon-32.png, apple-touch-icon.png, icon-512.png)
├── vercel.json           # Deploy config + security headers
├── package.json
├── .gitignore            # keeps .env / secrets out of the repo
└── .env.example
```

Your API key lives **only on the server** — it is never exposed to visitors or committed to git.

## Push to GitHub

```bash
cd physics-si
git init
git add .
git commit -m "physics.si — physics superintelligence"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/physics-si.git
git push -u origin main
```

## Deploy to Vercel (~3 minutes)

**Via GitHub (recommended):** import the repo at https://vercel.com/new, then add `ANTHROPIC_API_KEY` under Project → Settings → Environment Variables (key from https://console.anthropic.com/settings/keys). Every push to `main` auto-deploys.

**Via CLI:**
1. `npm i -g vercel`
2. From this folder: `vercel`  (accept defaults)
3. `vercel env add ANTHROPIC_API_KEY`
4. `vercel --prod`

### Custom domain (physics.si)

Vercel dashboard → Project → Settings → Domains → add `physics.si`, then point the domain's DNS (A record `76.76.21.21` or CNAME `cname.vercel-dns.com`) as instructed. Note: `.si` is Slovenia's TLD — register at a registrar that supports it (e.g., Porkbun, Gandi).

## Configuration

| Env var | Purpose | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic key (required) | — |
| `ANTHROPIC_MODEL_LOW` | Model for toddler/elementary | `claude-haiku-4-5` |
| `ANTHROPIC_MODEL_MID` | Model for high school/undergrad/graduate | `claude-sonnet-5` |
| `ANTHROPIC_MODEL_HIGH` | Model for PhD/Frontier | `claude-opus-5` |
| `ANTHROPIC_MODEL` | Force one model for all depths (overrides the three above) | — |
| `RATE_LIMIT_PER_HOUR` | Per-IP message cap per hour | `30` |

## Features

- **Model routing** — cheap/fast models answer kids' questions; your best model handles the research frontier. Frontier depth also enables Claude's extended thinking (visible as "thinking deeply…").
- **Rate limiting** — per-IP hourly cap, in-memory per edge region. For strict global limits under heavy traffic, add a shared store (e.g., Upstash Redis) or Vercel Firewall rules.
- **Sessions** — conversations auto-save to the visitor's browser (localStorage, last 12); "◷ sessions" (top right) restores them. Nothing is stored server-side.
- **Export** — any session downloads as Markdown; every response has a copy button (raw Markdown/LaTeX).
- **Paper upload** — the ⎘ button attaches a PDF (text extracted client-side via pdf.js, 40-page cap), .txt, .md, or .tex file to your message.
- **Voice** — mic input everywhere (Web Speech API); at toddler/elementary depth every answer gets a "listen" read-aloud button.
- **Live math** — KaTeX renders equations while the answer streams.

## Local preview

`vercel dev` runs the site + API function locally at http://localhost:3000 (reads `.env`).

## Notes

- Depth selector (Undergrad / Graduate / PhD / Frontier) changes the system prompt server-side.
- Field and tool selections tune the system prompt per session; prompts are defined in `api/chat.js`.
- Consider adding rate limiting (e.g., Vercel Firewall or Upstash) before heavy public traffic — every chat costs API tokens billed to your key.
