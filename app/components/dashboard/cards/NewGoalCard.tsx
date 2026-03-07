import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Target } from "lucide-react";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

export function NewGoalCard() {
  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="accuracy" density={8} />
      <div className="relative z-10">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">New Goal</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Clear 30ft 3 sessions in a row.
          </p>
          <Button className="w-full">Start Benchmark Session</Button>
        </CardContent>
      </div>
    </Card>
  );
}
