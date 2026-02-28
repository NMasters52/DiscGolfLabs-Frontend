import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Badge } from "~/components/ui/badge";
import { mockUser } from "./data";
import { Separator } from "~/components/ui/separator";
import { ThemeProvider } from "~/components/theme-provider";
import { ModeToggle } from "~/components/mode-toggle";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const { streak } = mockUser;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="discgolf-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-muted/30 px-4">
              <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <div className="flex items-center gap-3">
                  <ModeToggle />
                  <SidebarTrigger className="ml-2" />
                </div>
              </div>
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
