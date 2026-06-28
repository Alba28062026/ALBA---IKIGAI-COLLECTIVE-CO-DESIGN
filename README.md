# Alba Prototype

Local first prototype of **Alba**, a privacy-first web app for organizing evidence, building a Portable Human Portfolio, simulating life and career crafting scenarios, and translating them into practical activation levers.

The prototype now includes a built-in language switcher:

- Italian
- English

The route structure stays identical in both languages. Alba preserves the selected language through internal navigation via the `?lang=it` or `?lang=en` query parameter.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- Local storage in `vault/`
- Mock Markdown/JSON export
- No login, analytics, or public cloud
- Real AI not implemented yet: only a stub in `lib/ai.ts`
- ESCO live bridge through the official public API
- O*NET live bridge when optional credentials are configured

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create the local environment file:

```bash
cp .env.example .env.local
```

Optional live Simulation setup:

- ESCO works live by default through the official public API
- O*NET becomes live only if you add official credentials in `.env.local`

3. Initialize Prisma + SQLite with mock seed data:

```bash
pnpm run db:init
```

## Easiest access

### Double-click on Mac

Use these files directly from Finder:

- `Open Alba.command`
- `Stop Alba.command`

`Open Alba.command` starts Alba and opens it in your browser.

### Terminal fallback

Use this one command:

```bash
pnpm run alba
```

What it does:

- builds Alba
- starts the app in the background on port `3000`
- opens the app automatically on your Mac
- prints the best Mac URL and the best iPhone URL

Typical output:

- Mac: `http://localhost:3000`
- iPhone: `http://YOUR-MAC-NAME.local:3000`
- Fallback: `http://YOUR-MAC-IP:3000`

Useful follow-up commands:

```bash
pnpm run alba:status
pnpm run alba:down
```

If your iPhone is on the same Wi-Fi, prefer the `*.local` address printed by the launcher. If that does not resolve on your network, use the fallback IP address printed in the same output.

## Public empty-state demo

ALBA now supports a dedicated **shared public demo mode** for co-design:

- the prototype stays in empty state
- stored local attachments are hidden
- the evidence upload API becomes read-only

Enable it with:

```bash
NEXT_PUBLIC_ALBA_PUBLIC_DEMO=true
NEXT_PUBLIC_ALBA_BLANK_DEMO=true
```

Use this mode when sharing ALBA publicly on Discord or with external testers.

Deployment notes live in:

- `PUBLIC_DEMO_GUIDE.md`

## Community co-design kit

If you want to share ALBA with a Discord community and invite contributors, use:

- `COMMUNITY_START_HERE.md`
- `COMMUNITY_LAUNCH_CHECKLIST.md`
- `DISCORD_POST_IT.md`
- `DISCORD_POST_EN.md`
- `CONTRIBUTING.md`
- `RUN_ALBA_LOCALLY.md`

## Development mode

Development mode is still available, but it is less reliable for cross-device testing:

```bash
pnpm run dev
pnpm run dev:lan
```

Prefer `pnpm run alba` for everyday use.

## Health check

You can verify that the app is up with:

```bash
curl http://127.0.0.1:3000/api/health
```

## Included routes

- `/`
- `/evidence`
- `/evidence/new`
- `/evidence/[id]`
- `/patterns`
- `/why`
- `/ikigai`
- `/wellbeing`
- `/skills`
- `/opportunities`
- `/experiments`
- `/dossier`
- `/infographic`

## Evidence attachments

The Evidence flow now supports local attachments in addition to manual entry:

- PDF
- DOCX
- TXT / Markdown
- JSON / CSV
- PNG / JPG / WEBP

How it works in the current sprint:

- files are uploaded locally only
- files are stored in `vault/evidence-intake/`
- the intake includes a lightweight wizard so you can choose source type and Alba destination areas before upload
- Alba creates a cautious draft summary when text extraction is available
- uploaded material is shown again inside `/evidence`, `/evidence/new`, and the home dashboard
- each attachment can later contribute to Patterns, Why, Ikigai, Wellbeing, Skills, Opportunities, Experiments, and Dossier
- the final interpretation still remains a hypothesis to validate

Notes:

- `.doc` files can be stored locally, but text extraction is not guaranteed in this sprint
- LinkedIn direct API sync is not implemented; use a local export or PDF instead

## First sprint scope

- Awareness -> Simulation -> Activation journey on the homepage
- Realistic mock data with no personal information
- Local evidence intake from attachments with privacy-first storage in `vault/evidence-intake/`
- Wellbeing sliders with `gap` and `activationNeed`
- Expressed, latent, and strategic skills with ESCO/O*NET placeholders
- Opportunity cards with mock fit scores
- Scenario-focused dossier export in Markdown and JSON
- Essential Prisma schema with local seed data
- O*NET mock bridges in the Simulation area
- live ESCO bridge with stable local fallback
- O*NET-ready bridge with fallback when credentials are missing
- dummy digital twin intake agent aware of local attachments
- Mobile-friendly layout for Mac and iPhone browsers
- Top-right Italian / English switch with identical structure in both languages
- Shareable infographic route for fast presentations: `/infographic`

## Live opportunity pipeline

The Simulation area now uses two source modes:

- `ESCO`: live through the official public API
- `O*NET`: live only when `ONET_USERNAME` and `ONET_PASSWORD` are configured

If O*NET credentials are missing, Alba keeps the local O*NET bridge visible and labels it as fallback instead of pretending to be fully live.

## Digital twin agent

The prototype now includes a dummy `digital twin` intake agent:

- it watches local attachments already stored in `vault/evidence-intake/`
- it combines them with dummy sources such as CV, LinkedIn-style profile, and wellbeing snapshots
- it proposes cautious input hypotheses for Evidence, Why, Ikigai, Wellbeing, Skills, Opportunities, Experiments, and Dossier

Current limitation:

- this is not a real autonomous AI agent yet
- it does not send data anywhere
- it does not infer identity or diagnosis

## Activation scope

Activation now explicitly includes:

- learning paths and portfolio projects
- sleep routines
- nutrition cues
- movement and sport
- recovery practices
- mentorship and networking
- financial guardrails and context choices

## Privacy guardrails

- No real personal data in the repository
- No analytics
- No login
- No public cloud
- Every output is presented as a **hypothesis to validate**
- No diagnosis or clinical interpretation

## Files ignored by Git

These resources are excluded from version control:

- `.env.local`
- `vault/`
- `exports/`
- `prisma/dev.db`

## Database notes

- SQLite uses `prisma/dev.db`
- The seed populates evidence, signals, patterns, why hypothesis, wellbeing targets, skill profile, opportunities, fit assessments, activation plans, experiments, digital twin snapshots, and dossier export
- The live ESCO bridge is real, while O*NET still depends on official credentials
- The deeper Portfolio -> ESCO/O*NET crosswalk and final scoring logic remain intentionally hypothesis-driven in this sprint

## Natural next steps

- Connect forms to Prisma persistence
- Save exports to `exports/`
- Add richer parsing for `.doc`, OCR, and structured resume imports
- Implement the Canonical Human Profile and a real ESCO/O*NET pipeline
- Replace the dummy digital twin orchestrator with real private ingestion adapters
