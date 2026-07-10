import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";
import type { Pillar } from "./data";

interface PillarCardProps {
  pillar: Pillar;
  left: boolean;
}

export function PillarCard({ pillar, left }: PillarCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none",
        left ? "lg:col-start-1 lg:mr-12" : "lg:col-start-2 lg:ml-12",
      )}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">Phase {pillar.index}</span>
        <span className="text-muted-foreground/50">/</span>
        <span>{pillar.code}</span>
      </div>

      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {pillar.title}
      </h3>

      <p className="mt-1 text-[15px] font-medium italic text-foreground/70">
        {pillar.tagline}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        {pillar.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {pillar.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="border-accent/30 bg-accent/10 text-foreground/80"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
