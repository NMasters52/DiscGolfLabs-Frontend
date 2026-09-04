import { useEffect } from "react";
import { useLocation } from "react-router";
import { UserProfile } from "@clerk/react-router";

import { APP_NAME, documentTitle } from "~/components/app/navigation";
import { ThemeChoice } from "~/components/app/theme-choice";

// Served by the `settings/*` splat route: React Router owns the URL, and
// Clerk's UserProfile (routing="path") picks the Account page on an empty
// remainder and Security (and any other internal page) from the same module.
// Clerk's card sizes to its own intrinsic width by default, which overflows
// the page column and adds a document-level horizontal scrollbar. Pin every
// wrapper to the container (inline styles win over Clerk's runtime CSS) so
// the card shrinks to fit instead.
const CLERK_APPEARANCE = {
  elements: {
    rootBox: { width: "100%", minWidth: 0 },
    cardBox: { width: "100%", minWidth: 0 },
    card: { width: "100%", minWidth: 0 },
    profilePage: { minWidth: 0 },
    profileSection: { minWidth: 0 },
  },
} as const;

export default function Settings() {
  // Clerk's UserProfile swaps Account/Security entirely on the client, so
  // moving between them never re-matches a React Router route and never
  // re-runs a loader. Route metadata (`meta`/`handle`) would therefore only
  // fire on the initial document; the title has to follow the router location
  // instead. Keying on the full pathname — not on mount — keeps the title
  // correct across direct navigation, reload, and Back/Forward between Clerk
  // pages, whether or not the splat route remounts.
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = documentTitle(pathname);
  }, [pathname]);

  // Hand the tab back to the product name when Settings unmounts, so the
  // Settings title does not leak onto pages that set no title of their own.
  // A separate effect keeps this off the Clerk sub-path changes above, which
  // only need to re-run the title assignment.
  useEffect(() => () => {
    document.title = APP_NAME;
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="mt-6">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          System follows your device. Light and Dark override it.
        </p>
        <div className="mt-3">
          <ThemeChoice />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Account &amp; Security</h2>
        <div className="mt-3">
          <UserProfile
            path="/app/settings"
            routing="path"
            appearance={CLERK_APPEARANCE}
          />
        </div>
      </section>
    </div>
  );
}
