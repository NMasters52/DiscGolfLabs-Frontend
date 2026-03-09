import { SignUp } from "@clerk/react-router";
import { useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import {
  Target,
  Zap,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/app/dashboard";

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
                  Start Your Journey
                </p>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Transform your putting game with data-driven practice
                </h1>
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-lg">
                  Join thousands of disc golfers using our scientifically-backed putting ladder system to lower their scores and build lasting confidence on the green.
                </p>
              </div>

              {/* Value proposition */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">What you'll get:</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Progress Tracking</p>
                      <p className="text-xs text-muted-foreground">
                        Visual stats and make rates by distance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Structured Drills</p>
                      <p className="text-xs text-muted-foreground">
                        Daily putting ladder exercises
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Community Support</p>
                      <p className="text-xs text-muted-foreground">
                        Join dedicated practice groups
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Expert Guidance</p>
                      <p className="text-xs text-muted-foreground">
                        Tips from touring professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">10k+</p>
                    <p className="text-xs text-muted-foreground">Active Practitioners</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">500k+</p>
                    <p className="text-xs text-muted-foreground">Sessions Completed</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">23%</p>
                    <p className="text-xs text-muted-foreground">Avg. Improvement</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Based on user surveys and practice data
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Sign up form */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-2xl font-bold">Create Your Account</h2>
                    <p className="text-sm text-muted-foreground">
                      Start your putting transformation today
                    </p>
                  </div>

                  <SignUp forceRedirectUrl={redirectUrl} />

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-muted-foreground">
                        By signing up, you agree to our
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <a href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </a>
                        <span className="text-muted-foreground">•</span>
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Protected by Clerk authentication
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back to sign in */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?
                </p>
                <Button variant="ghost" asChild className="text-sm">
                  <a href="/sign-in">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Sign In
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}