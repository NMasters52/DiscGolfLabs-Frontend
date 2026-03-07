import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "lucide-react";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

export function PracticeModeCard() {
  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="training" density={10} />
      <div className="relative z-10">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Extra Practice Mode</h3>
          </div>
          <Button variant="outline" className="w-full">
            Start Putting Game
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
