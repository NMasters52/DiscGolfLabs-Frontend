import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

export function CourseHeroCard() {
  const progress = 60;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Continue Day 3: Circle 1 Confidence
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            3 of 5 days completed
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Continue Course
        </Button>
      </CardContent>
    </Card>
  );
}
