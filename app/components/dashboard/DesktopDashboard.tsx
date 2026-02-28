import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { mockUser } from "./data";
import { Play, Flame, TrendingUp } from "lucide-react";
import { SessionProgressChart, EmailSignupSection } from "./cards";

interface DesktopDashboardProps {
  state: "inCourse" | "courseComplete";
}

export function DesktopDashboard({ state }: DesktopDashboardProps) {
  const { lastSession, improvement, streak } = mockUser;
  const distanceGained =
    improvement.currentDistance - improvement.startDistance;

  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-6 md:grid-cols-4">
          {/* Hero Tile - spans 2 cols, 2 rows */}
          <Card className="col-span-2 row-span-2 border-l-4 border-l-primary">
            <CardContent className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {state === "inCourse"
                    ? "Continue Day 3: Circle 1 Confidence"
                    : "Course Complete"}
                </h2>
                <p className="text-muted-foreground">
                  {state === "inCourse"
                    ? "3 of 5 days completed"
                    : "You Improved"}
                </p>
              </div>

              {state === "inCourse" ? (
                <Button className="w-full" size="lg">
                  Continue Course
                </Button>
              ) : (
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Distance Gained
                    </span>
                    <span className="text-lg font-bold text-accent">
                      +{distanceGained}ft
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Consistency
                    </span>
                    <span className="text-lg font-bold text-accent">+18%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last Session % Tile */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary">
                <span className="text-2xl font-bold">
                  {Math.round(lastSession.makeRate * 100)}%
                </span>
              </div>
              <p className="text-sm font-medium">Make Rate</p>
              <p className="text-xs text-muted-foreground">Last Session</p>
            </CardContent>
          </Card>

          {/* Start Practice Tile */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <p className="text-center text-sm font-medium">Start Practice</p>
              <Button variant="outline" size="sm" className="w-full">
                Begin
              </Button>
            </CardContent>
          </Card>

          {/* Improvement Tile */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col justify-center space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Improvement
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start</span>
                  <span className="font-bold">
                    {improvement.startDistance}ft
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Now</span>
                  <span className="font-bold">
                    {improvement.currentDistance}ft
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm text-muted-foreground">Gain</span>
                  <div className="flex items-center gap-1 text-accent">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-bold">+{distanceGained}ft</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Tile - Only shown in inCourse state */}
          {state === "inCourse" && (
            <Card className="col-span-1 row-span-1">
              <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FE6B36]/10">
                  <Flame className="h-6 w-6 text-[#FE6B36]" />
                </div>
                <p className="text-2xl font-bold text-[#FE6B36]">{streak}</p>
                <p className="text-sm font-medium">Day Streak</p>
              </CardContent>
            </Card>
          )}

          {/* Email Signup Tile - Only shown in courseComplete state, replaces Streak Tile */}
          {state === "courseComplete" && (
            <EmailSignupSection className="col-span-1 row-span-1" />
          )}

          {/* Bottom Full-Width Graph */}
          <SessionProgressChart />
        </div>
      </div>
    </div>
  );
}
