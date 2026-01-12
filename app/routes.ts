import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index/index.jsx"),
  route("sign-in", "routes/sign-in.jsx"),
  route("sign-up", "routes/sign-up.jsx"),
  route("app", "routes/app/_layout.jsx", [
    index("routes/app/_index.jsx"),
    route("dashboard", "routes/app/dashboard/index.jsx"),
  ]),
] satisfies RouteConfig;
