import { Outlet, useLocation } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app/AppSidebar";
import { resolveDestination } from "~/components/app/navigation";
import { ModeToggle } from "~/components/mode-toggle";

// The one authenticated application shell, rendered by routes/app/_layout.jsx
// around its <Outlet /> so every /app page inherits it. Theming comes solely
// from the root next-themes provider in root.tsx — no nested provider here.
export function AppShell() {
  const { pathname } = useLocation();
  const destination = resolveDestination(pathname);

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
