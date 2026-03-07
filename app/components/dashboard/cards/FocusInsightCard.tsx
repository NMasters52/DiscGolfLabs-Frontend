import { Card, CardContent } from "~/components/ui/card";
import { Lightbulb } from "lucide-react";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

export function FocusInsightCard() {
  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="lab" density={8} />
      <div className="relative z-10">
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
      </div>
    </Card>
  );
}
