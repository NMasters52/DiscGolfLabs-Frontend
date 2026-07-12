import { Link } from "react-router";
import { Check, Sparkles } from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import type { PricingTier } from "./data";

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  const {
    name,
    price,
    cadence,
    description,
    features,
    ctaLabel,
    ctaTo,
    featured,
    badge,
  } = tier;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-xl bg-card p-6",
        featured
          ? "border-2 border-accent/40 shadow-[0_4px_12px_rgba(15,23,42,0.06),0_24px_48px_rgba(15,23,42,0.10)] dark:border-accent/40 dark:shadow-none lg:scale-[1.02]"
          : "border border-border/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {name}
        </h3>
        {badge && (
          <Badge className="border border-accent/40 bg-accent/15 text-accent">
            <Sparkles className="size-3" />
            {badge}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-foreground/80"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          asChild
          variant={featured ? "green-hover" : "outline"}
          className={cn(
            "w-full",
            featured && "bg-accent text-accent-foreground hover:bg-accent/90",
          )}
        >
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
