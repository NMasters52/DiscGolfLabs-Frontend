# Environment Variables

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-07-29

## Why

Points the app at the `dgl-api` backend; without `VITE_API_URL` every API call fails with `undefined` paths.

## Variables

| Variable       | Required | Description                                                      |
| -------------- | -------- | ---------------------------------------------------------------- |
| `VITE_API_URL` | **yes**  | Base URL for the dgl-api backend (e.g., `http://localhost:3000`) |

## Example `.env`

```env
VITE_API_URL=http://localhost:3000
```

## Notes

- `VITE_API_URL` must be set or all API calls will fail with `undefined` paths.
- Clerk auth keys are configured through the Clerk dashboard, not env vars in this repo.

## See also

- `architecture.md` — where API calls originate
- `STATE.md` — query layer that consumes `VITE_API_URL`
