import { useAuth } from "@clerk/react-router";
import { Navigate, useSearchParams } from "react-router";
import { SignIn } from "@clerk/react-router";
import { Button } from "../components/ui/button";
import { WaitlistForm } from "../components/landing/waitlist-form";
import {
  Disc,
  Target,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/app/dashboard";

  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to={redirectUrl} replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow effects */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-200 h-150 rounded-full blur-[150px]"
          style={{ background: "rgba(109,234,249,0.03)" }}
        />
      </div>

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            {/* Logo mark */}
            <a
              href="/"
              className="inline-flex items-center gap-3 group"
              aria-label="Disc Golf Lab home"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card border border-border transition-transform group-hover:scale-105">
                {/* Abstract disc + flask icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    stroke="#6deaf9"
                    strokeWidth="1.2"
                  />
                  <ellipse
                    cx="10"
                    cy="10"
                    rx="4"
                    ry="1.5"
                    stroke="#6deaf9"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                  <line
                    x1="10"
                    y1="3"
                    x2="10"
                    y2="0"
                    stroke="#2fd463"
                    strokeWidth="1.2"
                  />
                  <circle cx="10" cy="0" r="1" fill="#2fd463" opacity="0.6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground text-lg font-bold tracking-wide uppercase leading-tight">
                  Disc Golf Lab
                </span>
                <span className="text-[10px] font-mono text-muted-foreground tracking-[0.25em] uppercase leading-tight">
                  Foundation First
                </span>
              </div>
            </a>

            {/* Hero content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary">
                  Access Your Lab
                </p>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Sign in to continue your putting journey
                </h1>
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-lg">
                  Track your progress, access exclusive drills, and join a community of serious disc golfers committed to mastery.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                    <Disc className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Track Progress</p>
                    <p className="text-xs text-muted-foreground">Session data & stats</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Daily Drills</p>
                    <p className="text-xs text-muted-foreground">Structured practice</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Level Up</p>
                    <p className="text-xs text-muted-foreground">Unlock advanced</p>
                  </div>
                </div>
              </div>

              {/* CTA for new users */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  New to Disc Golf Lab?
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Join the waitlist for early access to our putting courses and drills.
                  </p>
                  <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                </div>
                <WaitlistForm source="hero" showCount={true} />
              </div>

              {/* Sign up CTA */}
              <div className="pt-4">
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href="/sign-up"
                    className="text-[13px] font-bold tracking-wide uppercase"
                  >
                    Create Account
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  No credit card required to sign up
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Sign in form */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-sm text-muted-foreground">
                      Sign in to access your dashboard
                    </p>
                  </div>

                  <SignIn forceRedirectUrl={redirectUrl} />

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Protected by Clerk authentication
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to home */}
              <div className="text-center">
                <Button variant="ghost" asChild className="text-sm">
                  <a href="/">← Back to Home</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}