# Frontend Patterns

> Status: **stub** — conventions to follow when building UI here. Convention candidates salvaged from the removed `.clinerules/` setup live in [`_to-consolidate.md`](_to-consolidate.md); fold them in here over time.

## Styling
- Tailwind v4 utilities; shadcn/ui components live in `app/components/ui/`.
- Theme colors: primary Metallic Blue `#22577A` / Teal `#38A3A5`, accent Cyan `#6DEAF9`. Dark mode via `next-themes`.
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
