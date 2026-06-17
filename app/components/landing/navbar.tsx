import { useState } from "react";

import { Menu, X } from "lucide-react";

import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

const navLinks = [
  { label: "Methodology", href: "/methodology" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Pricing", href: "/pricing" },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="/"
          aria-label="Disc Golf Lab home"
          className=" flex shrink-0 items-center justify-center overflow-hidden h-10 w-20"
        >
          <img
            src="/logos/dgl-logo.png"
            alt="Disc Golf Lab"
            className="h-full w-full object-cover scale-120 [filter:brightness(0)_invert(1)]"
          />
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" asChild>
            <a
              href="/sign-in"
              className="text-[13px] font-medium tracking-wide uppercase"
            >
              Sign in
            </a>
          </Button>
          <Button asChild>
            <a
              href="/sign-up"
              className="text-[13px] font-bold tracking-wide uppercase"
            >
              Join Lab
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </nav>

      {/* Mobile slide-down */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border px-6 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-3 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-center">
              <ModeToggle />
            </div>
            <Button variant="ghost" asChild>
              <a
                href="/sign-in"
                className="text-[13px] text-muted-foreground tracking-wide uppercase"
              >
                Sign in
              </a>
            </Button>
            <Button asChild>
              <a
                href="/sign-up"
                className="text-[13px] font-bold tracking-wide uppercase"
              >
                Join Lab
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
