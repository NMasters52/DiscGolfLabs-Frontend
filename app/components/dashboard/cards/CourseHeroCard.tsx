import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

interface CourseHeroCardProps {
  currentDay?: number;
  totalDays?: number;
}

export function CourseHeroCard({
  currentDay = 1,
  totalDays = 5,
}: CourseHeroCardProps) {
  const progress = Math.round(((currentDay - 1) / totalDays) * 100);

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Continue Day {currentDay}: Circle 1 Confidence
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentDay - 1} of {totalDays} days completed
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
