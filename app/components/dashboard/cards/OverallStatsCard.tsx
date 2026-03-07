import { Card, CardContent } from "~/components/ui/card";
import { mockUser } from "../data";
import { TrendingUp, Trophy } from "lucide-react";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

export function OverallStatsCard() {
  const { overallMakeRate, personalBest } = mockUser;

  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="putting" density={12} />
      <div className="relative z-10">
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall Make %</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">
                {Math.round(overallMakeRate * 100)}%
              </p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Personal Best</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">{personalBest}ft</p>
              <Trophy className="h-4 w-4 text-accent" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
