import { Card, CardContent } from "~/components/ui/card";
import { Lightbulb } from "lucide-react";

export function FocusInsightCard() {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Focus Insight</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          You struggle most at 30ft. Focus on consistency at 25ft before
          advancing.
        </p>
      </CardContent>
    </Card>
  );
}
