import { useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router";
import { Menu } from "lucide-react";

import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const navLinks = [
  { label: "Methodology", to: "/methodology" },
  { label: "About", to: "/about" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "FAQ", to: "/faq" },
  { label: "Pricing", to: "/pricing" },
];

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3.5 py-2 text-[14px] font-medium transition-colors rounded-md tracking-wide uppercase ${
    isActive
      ? "text-primary font-semibold underline underline-offset-[6px] decoration-primary decoration-2"
      : "text-muted-foreground hover:text-foreground"
  }`;

const DRAG_DISMISS_THRESHOLD = 100; // px — sheet closes if dragged past this

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleClose = () => setOpen(false);

  // --- Swipe-to-close state ---
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const currentDragY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    // Disable transition during drag so sheet tracks finger 1:1
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    // Only allow downward drag (positive deltaY)
    if (deltaY > 0 && sheetRef.current) {
      currentDragY.current = deltaY;
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (currentDragY.current > DRAG_DISMISS_THRESHOLD) {
      // Clear transform before close so Radix exit animation plays cleanly
      if (sheetRef.current) {
        sheetRef.current.style.transition = "";
        sheetRef.current.style.transform = "";
      }
      handleClose();
    } else if (sheetRef.current) {
      // Smooth snap-back to open position
      sheetRef.current.style.transition = "transform 0.2s ease-out";
      sheetRef.current.style.transform = "";
    }
    // Reset
    dragStartY.current = null;
    currentDragY.current = 0;
  };

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-medium tracking-wide uppercase transition-colors min-h-[56px] w-full ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-foreground hover:bg-accent/10 hover:text-accent"
    }`;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Disc Golf Lab home"
          className="flex shrink-0 items-center justify-center overflow-hidden h-10 w-20"
        >
          <img
            src="/logos/dgl-logo.png"
            alt="Disc Golf Lab"
            className="h-full w-full object-cover scale-120 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              prefetch="intent"
              className={desktopLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" asChild>
            <Link
              to="/sign-in"
              className="text-[13px] font-medium tracking-wide uppercase"
            >
              Sign in
            </Link>
          </Button>
          <Button asChild>
            <Link
              to="/sign-up"
              className="text-[13px] font-bold tracking-wide uppercase"
            >
              Join Lab
            </Link>
          </Button>
        </div>

        {/* Mobile trigger — bottom sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden min-h-[44px] min-w-[44px]"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav-sheet"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            ref={sheetRef}
            id="mobile-nav-sheet"
            side="bottom"
            showCloseButton={true}
            className="mx-auto max-w-md rounded-t-2xl px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3"
          >
            {/* Grab handle — drag down to dismiss */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="mx-auto mb-4 h-[7px] w-[53px] cursor-grab touch-none rounded-full bg-border py-2 active:cursor-grabbing"
              aria-hidden="true"
            />

            <SheetHeader className="p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            </SheetHeader>

            <nav
              aria-label="Mobile"
              key={location.pathname}
              className="flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <SheetClose asChild key={link.label}>
                  <NavLink
                    to={link.to}
                    className={mobileLinkClass}
                    onClick={handleClose}
                  >
                    {link.label}
                  </NavLink>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
              <div className="flex justify-center">
                <ModeToggle />
              </div>
              <Button variant="outline" asChild className="min-h-[48px] w-full">
                <Link to="/sign-in" onClick={handleClose}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="min-h-[48px] w-full">
                <Link to="/sign-up" onClick={handleClose}>
                  Join Lab
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
