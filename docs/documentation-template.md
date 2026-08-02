# Documentation Template

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-07-29

## Why
Every doc in `docs/` follows this shape so a reader (or agent) always knows where to find the status,
the purpose, and the next doc. It blends a clear **status bar + "Why" + See-also** (orientation) with
**tight, concise** headers and prose — no filler.

## Structure

```markdown
# <Title>

> Status: **reference** | **stub** | **archive**  ·  Part of: docs/README.md  ·  Last verified: YYYY-MM-DD

## Why
1–2 lines: what this doc is for and when you'd read it. Lead with purpose, not history.

## <Body section>
Concise `##` headers. Use tables for structured data and code fences for examples.

## See also
- related.md — one-line reason
```

## Rules

- **Status banner** — one `>` line, always present.
  - `reference` = complete and authoritative · `stub` = incomplete · `archive` = superseded.
- **Why** — 1–2 lines max. Say what the doc is for; skip the changelog.
- **Body** — tight `##` headers. Prefer tables/lists over prose. No filler sentences.
- **See also** — 1–3 links to related docs, each with a one-line reason. Pairs with `docs/README.md`.

## Worked example (ENV.md under this template)

```markdown
# Environment Variables

> Status: **reference**  ·  Part of: docs/README.md  ·  Last verified: 2026-07-29

## Why
Points the app at the dgl-api backend; without it every API call fails with undefined paths.

## Variables

| Variable       | Required | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| VITE_API_URL   | yes      | Base URL for the dgl-api backend (e.g., localhost:3000)|

## Example .env
…(code fence)…

## Notes
- VITE_API_URL must be set or all API calls fail with undefined paths.
- Clerk auth keys are configured via the Clerk dashboard, not env vars.

## See also
- architecture.md — where API calls originate
- STATE.md — query layer that consumes VITE_API_URL
```

## See also

- `README.md` — the docs index (hub for these See-also spokes)
- `frontend-patterns.md` — code & styling conventions
