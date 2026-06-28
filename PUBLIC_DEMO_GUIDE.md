# ALBA Public Demo Guide

This guide is for the **shared empty-state demo** you want to post in Discord for co-design.

## Recommended path

For the current ALBA prototype, the simplest public setup is:

1. keep the app in **blank demo mode**
2. enable **public shared demo mode**
3. deploy it as a **read-only public prototype**
4. collect feedback in Discord instead of collecting user files inside the demo

This is the safest option because the current prototype still contains a local upload flow that writes files into `vault/`.

## Why this path is the simplest

The public co-design demo should stay:

- empty
- stable
- identical for every visitor
- free from participant uploads

That means:

- **do not** expose local file uploads in the public build
- **do not** let the public demo accumulate personal files
- **do not** rely on your Mac being turned on

## Public demo environment variables

Set these variables in your hosting provider:

```bash
NEXT_PUBLIC_ALBA_PUBLIC_DEMO=true
NEXT_PUBLIC_ALBA_BLANK_DEMO=true
```

Effect:

- the app stays in empty state
- uploaded attachments are hidden
- the upload API returns read-only mode

## Easiest hosting choice for this phase

For the current read-only demo, **Vercel** is the easiest option because the shared build no longer needs writable local storage.

Use Vercel for:

- public clickable prototype
- stable URL for Discord
- fast redeploys from Git

Keep Railway / Render / Fly for a later phase, when you want:

- persistent uploads
- writable SQLite or another real database
- authenticated user spaces

## Suggested publishing flow

### 1. Push ALBA to a Git repository

You can use GitHub. Make sure these stay ignored:

- `.env.local`
- `vault/`
- `exports/`
- `prisma/dev.db`

### 2. Create the public demo deployment

On Vercel:

1. import the Git repository
2. let Vercel detect the Next.js app
3. add the two environment variables above
4. deploy

### 3. Validate the public build

Check:

- home loads in both `?lang=it` and `?lang=en`
- `/infographic` loads
- `/evidence` loads
- `/evidence/new` shows the read-only public demo notice
- uploads are blocked
- no personal attachments appear

### 4. Share only one public URL

In Discord, share:

- one demo URL
- one short concept note
- one infographic
- one clear feedback request

## Recommended Discord feedback prompt

Ask people to focus on:

1. Is the 3-phase journey clear within 60 seconds?
2. Which screen feels most useful?
3. Where does the navigation feel confusing?
4. What feels missing for real-life usefulness?

## Important product rule

For this public co-design phase, ALBA should be treated as a **shared walkthrough**, not as a live personal data intake environment.

That keeps the demo:

- privacy-safe
- easier to maintain
- easier to explain
- more stable across devices

## Later upgrade path

When you want public users to input data safely, move to a different architecture:

- authenticated accounts
- per-user storage
- server-side database
- separate private file storage

That is the right moment to move beyond the current read-only shared demo.
