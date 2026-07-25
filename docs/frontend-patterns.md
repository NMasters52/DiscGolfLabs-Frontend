# Frontend Patterns

> Status: **stub** — conventions to follow when building UI here. Convention candidates salvaged from the removed `.clinerules/` setup live in [`_to-consolidate.md`](_to-consolidate.md); fold them in here over time.

## Styling
- Tailwind v4 utilities; shadcn/ui components live in `app/components/ui/`.
- Theme colors (tokens in `app/app.css`, consumed as Tailwind utilities): `--primary` teal `#0e7490` (light) / `#6deaf9` (dark); `--accent` green `#10b84e` (light) / `#33cb6b` (dark). The `#22577A` / `#38A3A5` "Metallic Blue / Teal" values are **Clerk-only** (`appearance.variables.colorPrimary` in `app/root.tsx:66`) and are not wired into the theme. Dark mode via `next-themes`.
- Typography: Inter; monospace for data/labels.

## Components
- Group by domain under `app/components/` (`landing`, `dashboard`, `games`, `ui`).
- Reusable primitives go in `ui/` (shadcn); compose them into domain components.

## Data
- Server reads via React Router loaders; client/server cache via TanStack Query hooks in `app/queries/`.
- Mutations via React Router actions or TanStack mutations.

## Code style
- TypeScript-first. For existing `.js/.jsx` modules (game, queries, api), match the file's current language when editing; prefer TS for new files.
- *(Convention candidates to fold in live in [`_to-consolidate.md`](_to-consolidate.md).)*
