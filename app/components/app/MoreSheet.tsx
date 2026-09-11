import * as React from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  LogOut,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { ThemeChoice } from "~/components/app/theme-choice";

/**
 * Distance (px) a downward drag must cover before the sheet dismisses.
 * Below it the sheet springs back, so an accidental graze never closes it.
 */
const SWIPE_CLOSE_THRESHOLD = 80;

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Radix's close-focus default restores to a registered SheetTrigger; this
   * sheet is opened by a plain button in the bottom bar, so the owner names
   * the restore target itself.
   */
  onCloseAutoFocus?: (event: Event) => void;
}

// The More destination's mobile surface: a content-sized bottom sheet with
// the Clerk account summary, the System/Light/Dark control, and Sign Out.
// The account card doubles as the sheet's only navigation affordance —
// Account and Settings are one combined page, so the card carries a single
// "Account & Settings" strip instead of two rows. Radix's dialog primitives
// own the focus trap, Escape, and outside-tap dismissal; this component adds
// the downward swipe-to-close gesture.
export function MoreSheet({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: MoreSheetProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{
    id: number;
    startY: number;
    dy: number;
    /** True once the gesture turned into scrolling the sheet's overflow. */
    scrolled: boolean;
  } | null>(null);

  // React attaches touchmove listeners passively, so these handlers only
  // observe and translate — they never preventDefault. That is enough
  // because Radix scroll-locks the page behind the open sheet, and when the
  // gesture would scroll the sheet's own overflow the drag yields to it
  // (see onTouchMove) so scroll and dismiss never fight over one finger.
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    drag.current = {
      id: touch.identifier,
      startY: touch.clientY,
      dy: 0,
      scrolled: false,
    };
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const state = drag.current;
    const element = contentRef.current;
    if (!state || !element) return;
    const touch = Array.from(event.changedTouches).find(
      (candidate) => candidate.identifier === state.id,
    );
    if (!touch) return;
    // Dismissal only owns the gesture while the sheet sits at its scroll
    // top; a drag on scrolled content is a scroll, not a dismissal.
    if (state.scrolled || element.scrollTop > 0) {
      state.scrolled = true;
      state.dy = 0;
    } else {
      state.dy = Math.max(0, touch.clientY - state.startY);
    }
    element.style.transition = "none";
    element.style.transform =
      state.dy > 0 ? `translateY(${state.dy}px)` : "";
  };

  const onTouchEnd = () => {
    const state = drag.current;
    drag.current = null;
    const element = contentRef.current;
    if (!element) return;
    // Drop the inline transform before closing so the unmount animation's
    // own slide-out transition (class-driven) starts from the natural spot.
    element.style.transition = "";
    element.style.transform = "";
    if (state && state.dy >= SWIPE_CLOSE_THRESHOLD) {
      onOpenChange(false);
    }
  };

  const initials =
    user?.fullName
      ?.split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={contentRef}
        side="bottom"
        // md:hidden keeps the sheet reachable only from the mobile bottom
        // bar (its portal would otherwise escape the bar's md:hidden).
        // Content-sized: h-auto from the bottom variant, capped so a very
        // short landscape viewport scrolls the sheet instead of clipping it.
        // px-0/gap-0 so the header and body share one 16px gutter instead of
        // stacking SheetContent's px-4 under SheetHeader's p-4. rounded-t-2xl
        // + the grab handle below mark the sheet as a draggable surface.
        className="mx-auto max-h-[85svh] w-full max-w-md gap-0 overflow-y-auto rounded-t-2xl px-0 pb-[env(safe-area-inset-bottom)] md:hidden"
        onCloseAutoFocus={onCloseAutoFocus}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* The grab handle: purely a visual cue where to start the drag —
            the whole sheet surface already carries the swipe-to-close
            gesture, so dragging here drags the sheet. */}
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-9 rounded-full bg-muted-foreground/30"
        />
        {/* pb-8 keeps the card clear of the corner close button: X owns a
            48px absolute target, and the card is itself a tap target, so the
            gap stops a thumb aimed at one from landing on the other. */}
        <SheetHeader className="px-4 pb-8 pt-3">
          <SheetTitle>More</SheetTitle>
          <SheetDescription className="sr-only">
            Account and app controls.
          </SheetDescription>
        </SheetHeader>

        {/* Graded section spacing instead of one uniform gap: the identity
            card stands alone, Appearance holds its label and buttons tight
            (mt-3), and Sign Out gets the widest break as the destructive
            end of the menu. */}
        <div className="flex flex-col px-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {/* The whole card is the tap target into the combined Account &
              Settings page; the footer strip names the destination. */}
          <Link
            to="/app/settings"
            replace
            data-slot="more-account"
            className="group block cursor-pointer overflow-hidden rounded-xl border bg-card transition-colors outline-none hover:border-primary/50 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-11 w-11">
                {user?.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt="" />
                ) : null}
                <AvatarFallback>
                  {isLoaded && isSignedIn ? initials : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.fullName ?? "Account"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {email ?? " "}
                </p>
              </div>
            </div>
            <div className="flex min-h-12 items-center justify-between border-t px-3">
              <span className="text-sm font-semibold">
                Account &amp; Settings
              </span>
              <ChevronRight
                className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </div>
          </Link>

          <section aria-label="Appearance" className="mt-7">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Appearance
            </p>
            <div className="mt-3">
              <ThemeChoice />
            </div>
          </section>

          {/* The widest break in the sheet: Sign Out is the destructive
              terminal action, not a sibling of the theme preference. */}
          <div className="mt-8">
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-destructive/30 text-sm font-semibold text-destructive transition-colors outline-none hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring dark:border-destructive/40"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
