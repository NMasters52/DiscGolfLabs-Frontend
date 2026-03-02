import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Flame, AlertTriangle } from "lucide-react";
import { SessionProgressChart, EmailSignupSection } from "./cards";

interface DesktopDashboardProps {
  state: "inCourse" | "courseComplete";
  stats?: any;
}

export function DesktopDashboard({ state, stats }: DesktopDashboardProps) {
  // Use real stats if available, otherwise use defaults
  const makeRate = stats?.overall?.makeRate || 0;
  const totalPuttsMade = stats?.overall?.totalPuttsMade || 0;
  const sessionCount = stats?.overall?.sessionCount || 0;
  const currentStreak = stats?.streaks?.currentStreak || 0;
  const longestStreak = stats?.streaks?.longestStreak || 0;
  const weakestDistance = stats?.highlights?.weakestDistance;
  const weakestDistanceValue = weakestDistance?.distance || 0;
  const weakestDistanceRate = weakestDistance?.percentage || 0;
  const changePercentage = stats?.comparison?.changePercentage || 0;
  const distanceGained = Math.round(
    changePercentage >= 0 ? changePercentage : 0,
  );

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

          {/* Make Rate Card */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary">
                <span className="text-2xl font-bold">
                  {Math.round(makeRate)}%
                </span>
              </div>
              <p className="text-sm font-medium">Make Rate</p>
              <p className="text-xs text-muted-foreground">Overall</p>
            </CardContent>
          </Card>

          {/* Total Putts Card */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
              <p className="text-3xl font-bold">{totalPuttsMade}</p>
              <p className="text-sm font-medium">Putts Made</p>
              <p className="text-xs text-muted-foreground">
                {sessionCount} sessions
              </p>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FE6B36]/10">
                <Flame className="h-6 w-6 text-[#FE6B36]" />
              </div>
              <p className="text-2xl font-bold text-[#FE6B36]">
                {currentStreak}
              </p>
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-xs text-muted-foreground">
                Best: {longestStreak}
              </p>
            </CardContent>
          </Card>

          {/* Weakest Distance Card */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-2xl font-bold">{weakestDistanceValue}ft</p>
              <p className="text-sm font-medium">Weakest Distance</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(weakestDistanceRate)}% make rate
              </p>
            </CardContent>
          </Card>

          {/* Bottom Full-Width Graph */}
          <SessionProgressChart stats={stats} />
        </div>
      </div>
    </div>
  );
}
