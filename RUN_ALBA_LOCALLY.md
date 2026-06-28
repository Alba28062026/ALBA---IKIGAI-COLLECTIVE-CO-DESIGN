# Run ALBA Locally

This guide is for contributors who want to explore or improve the prototype.

## Requirements

- Node.js 20+
- pnpm

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Create the local environment file

```bash
cp .env.example .env.local
```

3. Initialize the local database

```bash
pnpm run db:init
```

4. Start the app

```bash
pnpm run dev
```

5. Open the app

```text
http://localhost:3000
```

## Optional shared public demo mode

If you want to run the same empty-state public walkthrough used for community sharing:

```bash
NEXT_PUBLIC_ALBA_PUBLIC_DEMO=true NEXT_PUBLIC_ALBA_BLANK_DEMO=true pnpm run dev
```

In this mode:

- the demo stays empty
- uploads are disabled
- local attachment history is hidden

## Useful pages

- `/`
- `/infographic?lang=en`
- `/infographic?lang=it`
- `/evidence`
- `/skills`
- `/wellbeing`
- `/opportunities`

## If something fails

Try:

```bash
pnpm install
pnpm run db:init
pnpm run dev
```

If the issue persists, please open a GitHub issue with:

- your operating system
- the command that failed
- the error message
- a screenshot if useful
