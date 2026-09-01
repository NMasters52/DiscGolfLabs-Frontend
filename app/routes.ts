import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "routes/_landing/_layout.jsx", [
    index("routes/_landing/index.jsx"),
    route("methodology", "routes/_landing/methodology.jsx"),
    route("about", "routes/_landing/about.jsx"),
    route("testimonials", "routes/_landing/testimonials.jsx"),
    route("faq", "routes/_landing/faq.jsx"),
    route("pricing", "routes/_landing/pricing.jsx"),
    route("courses/:slug", "routes/_landing/courses.$slug.jsx"),
  ]),

  route("sign-in", "routes/sign-in.jsx"),
  route("sign-up", "routes/sign-up.jsx"),

  route("checkout/success", "routes/checkout/success.jsx"),

  // `/app` is the authenticated product boundary: the layout authenticates
  // and owns AppShell; nested layouts authorize data access (e.g. course
  // enrollment) and provide it through outlet context.
  route("app", "routes/app/_layout.jsx", [
    index("routes/app/_index.jsx"),
    route("dashboard", "routes/app/dashboard/index.tsx"),
    route("courses/:slug/learn", "routes/app/courses/learn/_layout.jsx", [
      index("routes/app/courses/learn/index.jsx"),
      route("day/:dayNumber", "routes/app/courses/learn/day.jsx"),
    ]),
    route("settings", "routes/app/settings/index.tsx"),
  ]),
] satisfies RouteConfig;
