import { Card, CardContent } from "~/components/ui/card";
import { mockUser } from "../data";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

export function LastSessionCard() {
  const { lastSession } = mockUser;

  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="putting" density={10} />
      <div className="relative z-10">
        <CardContent>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Last Session
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Max Distance</p>
              <p className="text-lg font-bold">{lastSession.maxDistance}ft</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Make Rate</p>
              <p className="text-lg font-bold">
                {Math.round(lastSession.makeRate * 100)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Attempts</p>
              <p className="text-lg font-bold">{lastSession.attempts}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-lg font-bold">{lastSession.date}</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
