import { Link } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { formatStatsPeriod } from "./stats-period";
import type { MakeRateStatus } from "./view-model";

interface MakeRateCardProps {
  stats: {
    makeRate: number | null;
    status: MakeRateStatus;
    sessionCount: number | null;
    period?: { days: number; start: string; end: string };
  };
  firstSessionHref?: string;
  selectedPeriod?: number;
  loading?: boolean;
  error?: { retry?: () => void; retrying?: boolean };
  onPeriodChange?: (days: number) => void;
}

export function MakeRateCard({ stats, selectedPeriod = 30, loading, error, onPeriodChange, firstSessionHref }: MakeRateCardProps) {
  const value = error || loading || stats.makeRate == null ? null : Math.round(stats.makeRate);
  const display = value == null ? "—" : `${value}%`;
  const widerPeriod = [7, 30, 90].find(days => days > selectedPeriod);
  const details = loading
    ? { title: "Getting your results", description: "Loading completed sessions for this period." }
    : error
      ? { title: "Unable to load results", description: "We couldn’t retrieve your make rate for this period." }
      : stats.status === "firstSession"
        ? { title: "Your make rate starts here", description: "Complete your first putting session to see your percentage." }
        : stats.status === "noRecentSessions"
          ? { title: "Your history is still there", description: `There are no sessions in these ${selectedPeriod} days. ${widerPeriod ? "Try a wider range." : "Complete a session to add a result for these dates."}` }
          : stats.makeRate == null
            ? { title: "Make rate unavailable", description: "Your make rate isn’t available for this period." }
            : stats.sessionCount == null
              ? { title: "Based on your completed sessions", description: "The percentage of attempted putts you made in this period." }
              : { title: `Based on ${stats.sessionCount} ${stats.sessionCount === 1 ? "session" : "sessions"}`, description: "Only completed putting sessions count toward this result." };

  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <CardTitle>Make rate</CardTitle>
        <CardDescription>Completed sessions · last {selectedPeriod} days</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-5" aria-busy={loading}>
        <div className={cn("relative size-40", loading && "animate-pulse motion-reduce:animate-none")} role="img" aria-label={`Current ${selectedPeriod}-day make rate: ${loading ? "Loading" : display}`}>
          <svg aria-hidden="true" className="size-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="6" className="stroke-make-rate-track" />
            {value != null && value > 0 && <circle cx="60" cy="60" r="52" fill="none" strokeWidth="6" pathLength="100" strokeDasharray={`${stats.makeRate} 100`} strokeLinecap="round" transform="rotate(-90 60 60)" className="stroke-make-rate-arc" />}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="font-mono text-4xl font-semibold tracking-tight tabular-nums">{loading ? <Skeleton className="h-8 w-16 motion-reduce:animate-none" /> : display}</div>
            <span className="text-xs text-muted-foreground">{loading ? "Loading" : error ? "Unavailable" : "putts made"}</span>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-3 border-t pt-4">
          {onPeriodChange && <Select value={String(selectedPeriod)} onValueChange={value => onPeriodChange(Number(value))}>
            <SelectTrigger size="sm" className="w-40 max-w-full" aria-label="Make rate period"><SelectValue /></SelectTrigger>
            <SelectContent position="popper" align="center" sideOffset={6}>
              <SelectGroup>{[7, 30, 90].map(days => <SelectItem key={days} value={String(days)}>Last {days} days</SelectItem>)}</SelectGroup>
            </SelectContent>
          </Select>}
          <div className="flex w-full flex-col gap-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-xs text-muted-foreground" aria-description="Date ranges are based on UTC">{formatStatsPeriod(stats.period, selectedPeriod)}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label="About date timezone" className="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                        <Info className="size-3.5" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={6}>Date ranges are based on UTC</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={cn("mx-auto flex w-full max-w-64 flex-col gap-2", error && "text-left")} role={error ? "alert" : loading ? "status" : undefined}>
                {(loading || error || stats.status !== "noRecentSessions") && <p className="text-sm font-semibold">{details.title}</p>}
                <p className="text-xs leading-relaxed text-muted-foreground">{details.description}</p>
                {error?.retry && <Button size="sm" variant="destructive-outline" className="mt-1 w-full" onClick={error.retry} disabled={error.retrying}>Retry</Button>}
                {!loading && !error && stats.status === "firstSession" && firstSessionHref && <Button size="sm" className="mt-1 self-center" asChild><Link to={firstSessionHref}>Start a session</Link></Button>}
                {!loading && !error && stats.status === "noRecentSessions" && widerPeriod && onPeriodChange && <Button size="sm" variant="outline" className="mt-1 cursor-pointer self-center" onClick={() => onPeriodChange(widerPeriod)}>View last {widerPeriod} days</Button>}
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
