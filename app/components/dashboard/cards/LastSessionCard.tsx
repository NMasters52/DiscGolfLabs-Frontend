import { Card, CardContent } from "~/components/ui/card";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

interface LastSessionCardProps {
  lastSession?: {
    maxDistance: number;
    makeRate: number;
    attempts: number;
    date: string;
  } | null;
}

export function LastSessionCard({ lastSession }: LastSessionCardProps) {
  if (!lastSession) {
    return (
      <Card className="relative overflow-hidden">
        <DiscGolfLabBackground variant="putting" density={10} />
        <div className="relative z-10">
          <CardContent>
            <h3 className="text-base font-semibold text-card-foreground mb-3">
              Last Session
            </h3>
            <p className="text-sm text-muted-foreground">
              No recent sessions. Start a putting session to add one!
            </p>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="putting" density={10} />
      <div className="relative z-10">
        <CardContent>
          <h3 className="text-base font-semibold text-card-foreground mb-3">
            Last Session
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-card-foreground/70">Max Distance</p>
              <p className="text-lg font-bold text-primary">
                {lastSession.maxDistance}ft
              </p>
            </div>
            <div>
              <p className="text-xs text-card-foreground/70">Make Rate</p>
              <p className="text-lg font-bold text-primary">
                {Math.round(lastSession.makeRate * 100)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-card-foreground/70">Attempts</p>
              <p className="text-lg font-bold text-primary">
                {lastSession.attempts}
              </p>
            </div>
            <div>
              <p className="text-xs text-card-foreground/70">Date</p>
              <p className="text-lg font-bold text-primary">
                {lastSession.date}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
