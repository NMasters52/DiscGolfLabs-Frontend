# Environment Variables

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
