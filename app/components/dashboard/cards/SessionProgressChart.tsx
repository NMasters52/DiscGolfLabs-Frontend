import { Card, CardContent } from "~/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "~/components/ui/chart";
import { BarChart, Bar, Tooltip, CartesianGrid, YAxis, XAxis } from "recharts";
import "./SessionProgressChart.css";

interface SessionProgressChartProps {
  stats?: any;
}

const chartConfig = {
  makeRate: {
    label: "Make Rate %",
    theme: {
      light: "#22c55e",
      dark: "#4ade80",
    },
  },
};

export function SessionProgressChart({ stats }: SessionProgressChartProps) {
  // Transform distance breakdown data into chart data
  const chartData =
    stats?.distanceBreakdown?.map((item: any) => ({
      distance: `${item.distance}ft`,
      makeRate: item.percentage,
    })) || [];

  return (
    <Card className="col-span-4 relative overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Edge fade masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      </div>

      <CardContent className="pt-6 relative z-10">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Make Rate by Distance</h3>
          <p className="text-xs text-muted-foreground">
            Putting performance across distances
          </p>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="distance"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Bar
              dataKey="makeRate"
              fill="var(--color-makeRate)"
              radius={[4, 4, 0, 0]}
            />
            <Tooltip content={<ChartTooltipContent />} cursor={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
