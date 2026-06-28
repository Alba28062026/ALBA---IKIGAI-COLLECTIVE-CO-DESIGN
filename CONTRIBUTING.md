# Contributing to ALBA

Thank you for helping improve ALBA.

ALBA is an early privacy-first prototype for:

- Awareness
- Simulation
- Activation

The goal of this repository is to make the prototype clearer, more useful, and more stable without turning it into a diagnostic, clinical, or surveillance product.

## Before you contribute

Please keep these principles in mind:

- no real personal data
- no analytics
- no login for this sprint
- no public cloud dependence for personal files
- no clinical claims
- every output must remain a hypothesis to validate

## Best ways to contribute

You can help in two ways:

1. Product and UX feedback
2. Hands-on prototype improvements

If you are not technical, open an issue or comment in the community Discord channel.

If you are technical, you can:

- fork the repository
- run it locally
- make a focused improvement
- open a pull request

## What kind of contributions are most useful

Right now the most helpful areas are:

- navigation clarity
- bilingual consistency between Italian and English
- mobile usability on Mac and iPhone browsers
- clarity of the 3-phase flow
- Simulation logic and ESCO or O*NET framing
- Activation clarity and practical next steps
- copy improvements
- bug fixes

## Local setup

Use the quick guide in:

- `RUN_ALBA_LOCALLY.md`

Short version:

```bash
pnpm install
cp .env.example .env.local
pnpm run db:init
pnpm run dev
```

Then open:

- `http://localhost:3000`

## Public demo mode

If you want to test the same shared demo used for community walkthroughs, set:

```bash
NEXT_PUBLIC_ALBA_PUBLIC_DEMO=true
NEXT_PUBLIC_ALBA_BLANK_DEMO=true
```

In this mode:

- the demo stays empty
- local attachments are hidden
- uploads are disabled

## Contribution guidelines

Please keep contributions:

- small and focused
- easy to review
- consistent with the current ALBA structure
- privacy-safe

Please avoid:

- adding real personal data
- introducing analytics or trackers
- adding authentication unless explicitly requested
- changing the 3-phase logic without explaining why
- merging unrelated visual or structural rewrites into one PR

## Pull request expectations

A good pull request should include:

- what changed
- why it improves ALBA
- which area it affects
- how it was tested
- screenshots if the change is visual

## Suggested PR title style

Use a short descriptive title, for example:

- `Improve top navigation clarity on mobile`
- `Refine Simulation copy around ESCO and O*NET`
- `Fix Evidence page button hit area`

## Privacy reminder

This repository should stay safe to share publicly.

That means:

- no uploaded user files
- no private exports
- no secrets in committed files

Do not commit:

- `.env.local`
- `vault/`
- `exports/`
- `prisma/dev.db`

## Questions

If you are unsure whether a contribution fits the prototype direction, open an issue first or ask in the Discord community before building too much.
