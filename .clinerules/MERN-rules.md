## Frontend (React/Vite)

- Use **Tailwind CSS** for all styling. Use consistent spacing utilities.
- Components: Use Arrow functions. Group imports: React first, then external libs, then internal components, then styles.
- Hooks: Keep logic out of the JSX. Extract complex logic into custom hooks (`useTaskLogic.ts`).
- State: Prefer local state; use Global state only for truly global data (Auth, Theme).

## Backend (Node/Express/MongoDB)

- Use the **Controller-Service-Model** pattern.
- Middleware: Always implement a global error handler and a `try-catch` wrapper for async routes.
- Security: Always sanitize inputs using `express-validator` and use `helmet` headers.
- MongoDB: Use Mongoose schemas with strict typing. Never use `any` for document types.

## API Design

- Use RESTful conventions: `GET /api/v1/resource`, `POST /api/v1/resource`.
- Always return consistent JSON shapes: `{ "success": true, "data": {}, "message": "" }`.
