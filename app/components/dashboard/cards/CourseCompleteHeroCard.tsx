import { Card, CardContent } from "~/components/ui/card";
import { Trophy } from "lucide-react";
import { mockUser } from "../data";

export function CourseCompleteHeroCard() {
  const { improvement } = mockUser;
  const distanceGained =
    improvement.currentDistance - improvement.startDistance;
  const consistencyGain = 18;

  return (
    <Card className="border-l-4 border-l-accent">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Course Complete</h2>
        </div>
        <p className="text-sm text-muted-foreground">You Improved</p>

        <div className="space-y-3 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Average Max Distance
            </p>
            <p className="text-lg font-bold text-accent">+{distanceGained}ft</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Consistency</p>
            <p className="text-lg font-bold text-accent">+{consistencyGain}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
