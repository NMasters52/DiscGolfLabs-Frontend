import { ThemeChoice } from "~/components/app/theme-choice";

// Minimal Settings screen: issue #46 establishes the `/app/settings` route.
// Account & Security (Clerk UserProfile with path routing) arrives with the
// dedicated Settings ticket.
export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
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
    </div>
  );
}
