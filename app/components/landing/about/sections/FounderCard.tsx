import { MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "../../../ui/badge";
import { founder } from "../data";

/**
 * Founder bio rendered as a single soft card (rounded-3xl on a secondary tint),
 * carried over from the Zen design. Avatar is static — the parallax/breath
 * motion wrappers were removed for a mobile-safe base.
 */
export function FounderCard() {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl border border-border/70 bg-secondary/50 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left">
          <Avatar className="size-28 shrink-0 rounded-full ring-1 ring-accent/30 sm:size-36">
            <AvatarImage src="/avatar.jpg" alt={founder.name} />
            <AvatarFallback className="rounded-full bg-background text-2xl font-light tracking-tight text-foreground">
              {founder.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground"
              >
                PDGA {founder.pdga}
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {founder.name}
              </h2>
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                <MapPin className="size-3" />
                {founder.location}
              </p>
            </div>
            <div className="space-y-3">
              {founder.bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-[15px] leading-relaxed text-foreground/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
