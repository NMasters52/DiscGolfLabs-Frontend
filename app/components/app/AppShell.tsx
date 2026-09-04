import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app/AppSidebar";
import { APP_NAME, documentTitle, resolveDestination } from "~/components/app/navigation";
import { ModeToggle } from "~/components/mode-toggle";

// The one authenticated application shell, rendered by routes/app/_layout.jsx
// around its <Outlet /> so every /app page inherits it. Theming comes solely
// from the root next-themes provider in root.tsx — no nested provider here.
export function AppShell() {
  const { pathname } = useLocation();
  const destination = resolveDestination(pathname);
  // The last title this shell assigned, so the unmount reset can tell its own
  // writes apart from a title some other page set after the shell left.
  const lastAssigned = useRef<string | null>(null);

  // Clerk's UserProfile swaps Account/Security entirely on the client, so
  // moving between them never re-matches a React Router route and never
  // re-runs a loader. Route metadata (`meta`/`handle`) would therefore only
  // fire on the initial document; the title has to follow the router location
  // instead. Keying on the full pathname — not on mount — keeps the title
  // correct across direct navigation, reload, and Back/Forward between Clerk
  // pages, whether or not the shell remounts.
  useEffect(() => {
    const title = documentTitle(pathname);
    document.title = title;
    lastAssigned.current = title;
  }, [pathname]);

  // Hand the tab back to the product name when the shell unmounts (e.g. a
  // link out to the landing pages), so no destination title leaks onto pages
  // that set no title of their own. A separate effect keeps this off the
  // pathname changes above, which only need to re-run the title assignment.
  // React runs this cleanup after the destination page's commit, so only
  // reset when the title is still ours — if a landing route ever sets a
  // title of its own (route `meta` or an effect), it wins over the reset.
  useEffect(
    () => () => {
      if (document.title === lastAssigned.current) {
        document.title = APP_NAME;
      }
    },
    [],
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-lg font-semibold">
                {destination?.title ?? "Disc Golf Labs"}
              </span>
              <div className="flex items-center gap-3">
                <ModeToggle />
                <SidebarTrigger className="ml-2" />
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
