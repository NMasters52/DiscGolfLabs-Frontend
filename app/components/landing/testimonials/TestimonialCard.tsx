import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";
import type { Testimonial } from "./data";

interface TestimonialCardProps {
  testimonial: Testimonial;
  featured?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({
  testimonial,
  featured = false,
  className,
}: TestimonialCardProps) {
  const { name, meta, rating, quote, tag } = testimonial;

  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-4 rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none",
        featured ? "p-8 sm:p-10" : "p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar size={featured ? "lg" : "default"}>
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <figcaption className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{meta}</p>
        </figcaption>
      </div>

      <div
        className="flex items-center gap-1"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            className="size-3.5 fill-current text-accent"
            aria-hidden
          />
        ))}
      </div>

      <blockquote
        className={cn(
          "leading-relaxed text-foreground/80",
          featured
            ? "text-xl font-medium tracking-tight text-foreground sm:text-2xl"
            : "text-[15px]",
        )}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        {tag ? (
          <Badge
            variant="outline"
            className="border-accent/30 bg-accent/10 text-foreground/80"
          >
            {tag}
          </Badge>
        ) : (
          <span aria-hidden />
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Sample
        </span>
      </div>
    </figure>
  );
}
